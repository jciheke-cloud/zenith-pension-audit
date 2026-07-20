import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Landmark, FileText, DollarSign, Activity } from 'lucide-react';

// ─── Live Data Sources ──────────────────────────────────────────────────────
// All fetches go through CORS-safe proxies or open APIs.
// No localStorage. In-memory state only.
// Auto-refreshes every 15 minutes. Also fetches on first mount (= user login).
// ────────────────────────────────────────────────────────────────────────────

const REFRESH_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes

// Official / verifiable fallback values (updated periodically)
const FALLBACK = {
  usdNgn:    1535.40,
  cpi:       '15.91',
  mpr:       '26.75',
  bond10yr:  '19.85',
  tbill364:  '21.50',
  spread:    '-165',
};

const TICKER_KEYFRAMES = `
  @keyframes macroScroll {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes tickerSpin {
    100% { transform: rotate(360deg); }
  }
  @keyframes tickerPulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }
  .macro-marquee-container {
    display: flex;
    width: 200%;
    animation: macroScroll 48s linear infinite;
  }
  .macro-marquee-container.paused {
    animation-play-state: paused;
  }
`;

// ─── Data fetching helpers ──────────────────────────────────────────────────

async function fetchWithTimeout(url, timeoutMs = 5000) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(url, { signal: ctrl.signal });
    clearTimeout(id);
    return r;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

async function proxyFetch(targetUrl, timeoutMs = 5000) {
  // allorigins.win is a CORS proxy that works from the browser
  return fetchWithTimeout(
    `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
    timeoutMs
  );
}

// 1. USD/NGN — try ExchangeRate-API (free, no key needed for latest)
async function fetchUsdNgn() {
  try {
    const r = await fetchWithTimeout('https://open.er-api.com/v6/latest/USD', 6000);
    if (r.ok) {
      const d = await r.json();
      if (d.rates && d.rates.NGN) return { value: d.rates.NGN, source: 'Open ER-API' };
    }
  } catch (_) {}

  // Fallback: exchangerate.host
  try {
    const r = await fetchWithTimeout('https://api.exchangerate.host/latest?base=USD&symbols=NGN', 6000);
    if (r.ok) {
      const d = await r.json();
      if (d.rates && d.rates.NGN) return { value: d.rates.NGN, source: 'ExchangeRate.host' };
    }
  } catch (_) {}

  return { value: FALLBACK.usdNgn, source: 'Fallback' };
}

// 2. CBN Inflation Rate — via allorigins proxy to CBN public API
async function fetchCbnCpi() {
  try {
    const r = await proxyFetch('https://www.cbn.gov.ng/api/GetAllInflationRates', 5500);
    if (r.ok) {
      const d = await r.json();
      if (Array.isArray(d) && d.length > 0 && d[0].allItemsYearOn) {
        return { value: Number(d[0].allItemsYearOn).toFixed(2), source: 'CBN API' };
      }
    }
  } catch (_) {}
  return { value: FALLBACK.cpi, source: 'Fallback' };
}

// 3. DMO Bond Yield — proxy to DMO public data
async function fetchDmoBond() {
  try {
    const r = await proxyFetch('https://www.dmo.gov.ng/api/GetCurrentTbillsRates', 5500);
    if (r.ok) {
      const d = await r.json();
      // Try to find 364-day T-Bill rate
      if (Array.isArray(d) && d.length > 0) {
        const tbill = d.find(x => String(x.tenor || x.Tenor || '').includes('364'));
        if (tbill) {
          const rate = tbill.rate || tbill.Rate || tbill.stopRate || tbill.StopRate;
          if (rate) return { tbill364: Number(rate).toFixed(2), source: 'DMO API' };
        }
      }
    }
  } catch (_) {}
  return { tbill364: FALLBACK.tbill364, source: 'Fallback' };
}

// ─── Component ──────────────────────────────────────────────────────────────

const CbnDmoMacroTicker = () => {
  const [isPaused,     setIsPaused]     = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchStatus,  setFetchStatus]  = useState('init'); // 'init' | 'live' | 'partial' | 'offline'
  const [lastUpdated,  setLastUpdated]  = useState(null);
  const [sources,      setSources]      = useState({});
  const timerRef = useRef(null);

  const [macroItems, setMacroItems] = useState([
    { id: 'cbn-mpr',      category: 'CBN MPR',        label: 'Monetary Policy Rate',       value: `${FALLBACK.mpr}%`,       change: '+50 bps', trend: 'up',      iconType: 'Landmark',    iconColor: '#F87171' },
    { id: 'dmo-10yr',     category: 'DMO FGN BOND',   label: '10-Yr Benchmark Yield',      value: `${FALLBACK.bond10yr}%`,  change: '+15 bps', trend: 'up',      iconType: 'FileText',    iconColor: '#34D399' },
    { id: 'dmo-t-bill',   category: 'DMO T-BILLS',    label: '364-Day Cut-Off Yield',      value: `${FALLBACK.tbill364}%`,  change: 'Stable',  trend: 'neutral', iconType: 'FileText',    iconColor: '#60A5FA' },
    { id: 'cbn-fx',       category: 'CBN NAFEX',      label: 'Official USD/NGN Window',    value: `₦${FALLBACK.usdNgn.toFixed(2)}/$`, change: '–',  trend: 'neutral', iconType: 'DollarSign', iconColor: '#38BDF8' },
    { id: 'cbn-cpi',      category: 'CBN INFLATION',  label: 'Headline Inflation (YoY)',   value: `${FALLBACK.cpi}%`,       change: '–',       trend: 'neutral', iconType: 'Activity',    iconColor: '#FBBF24' },
    { id: 'pencom-floor', category: 'PENCOM STAT.',   label: 'Custodial Paid-Up Floor',    value: '₦25B + 0.1% AUC',       change: 'Enforced',trend: 'neutral', iconType: 'Landmark',    iconColor: '#A855F7' },
    { id: 'fgn-spread',   category: 'SOVEREIGN CURVE',label: '10Y vs 1Y Yield Spread',     value: `${FALLBACK.spread} bps`, change: 'Inverted',trend: 'down',    iconType: 'TrendingDown',iconColor: '#FB7185' },
  ]);

  // ── Core live-fetch function ──────────────────────────────────────────────
  const fetchLiveData = useCallback(async () => {
    setIsRefreshing(true);
    const fetchSources = {};
    let anyLive = false;

    try {
      // Fire all three source fetches in parallel
      const [fxResult, cpiResult, dmoResult] = await Promise.allSettled([
        fetchUsdNgn(),
        fetchCbnCpi(),
        fetchDmoBond(),
      ]);

      const fxData  = fxResult.status  === 'fulfilled' ? fxResult.value  : { value: FALLBACK.usdNgn, source: 'Fallback' };
      const cpiData = cpiResult.status === 'fulfilled' ? cpiResult.value : { value: FALLBACK.cpi,    source: 'Fallback' };
      const dmoData = dmoResult.status === 'fulfilled' ? dmoResult.value : { tbill364: FALLBACK.tbill364, source: 'Fallback' };

      fetchSources.fx   = fxData.source;
      fetchSources.cpi  = cpiData.source;
      fetchSources.dmo  = dmoData.source;

      anyLive = [fxData.source, cpiData.source, dmoData.source].some(s => s !== 'Fallback');

      setMacroItems(prev => {
        return prev.map(item => {
          if (item.id === 'cbn-fx') {
            const newVal   = Number(fxData.value).toFixed(2);
            const oldVal   = parseFloat(prev.find(x => x.id === 'cbn-fx')?.value?.replace(/[^0-9.]/g, '') || FALLBACK.usdNgn);
            const diff     = Number(newVal) - oldVal;
            const pct      = oldVal > 0 ? ((diff / oldVal) * 100).toFixed(2) : '0.00';
            const trend    = diff > 0.01 ? 'up' : diff < -0.01 ? 'down' : 'neutral';
            const change   = diff === 0 ? 'Stable' : diff > 0 ? `+${pct}%` : `${pct}%`;
            return { ...item, value: `₦${newVal}/$`, change, trend };
          }
          if (item.id === 'cbn-cpi') {
            const newRate = cpiData.value;
            const oldRate = parseFloat(prev.find(x => x.id === 'cbn-cpi')?.value || FALLBACK.cpi);
            const diff    = Number(newRate) - oldRate;
            const bps     = Math.round(diff * 100);
            const trend   = diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral';
            const change  = bps === 0 ? 'Stable' : bps > 0 ? `+${bps} bps` : `${bps} bps`;
            return { ...item, value: `${newRate}%`, change, trend };
          }
          if (item.id === 'dmo-t-bill' && dmoData.source !== 'Fallback') {
            return { ...item, value: `${dmoData.tbill364}%`, change: 'DMO Live' };
          }
          return item;
        });
      });

      setSources(fetchSources);
      setLastUpdated(new Date());
      setFetchStatus(anyLive ? 'live' : 'offline');
    } catch (e) {
      setFetchStatus('offline');
      console.warn('[MacroTicker] Fetch error:', e.message);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // ── On mount: immediate fetch + 15-min interval ───────────────────────────
  useEffect(() => {
    fetchLiveData();                                      // fires on first render = on login

    timerRef.current = setInterval(fetchLiveData, REFRESH_INTERVAL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchLiveData]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getAgeLabel = () => {
    if (!lastUpdated) return 'Loading…';
    const secs = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
    if (secs < 60) return `${secs}s ago`;
    const mins = Math.floor(secs / 60);
    return `${mins}m ago`;
  };

  const statusColor = fetchStatus === 'live' ? '#4ADE80' : fetchStatus === 'offline' ? '#F87171' : '#FBBF24';
  const statusLabel = fetchStatus === 'live' ? 'LIVE' : fetchStatus === 'offline' ? 'OFFLINE' : fetchStatus === 'init' ? '…' : 'CACHED';

  const renderIcon = (item) => {
    const sz = 13;
    const c  = item.iconColor || '#38BDF8';
    switch (item.iconType) {
      case 'Landmark':    return <Landmark    size={sz} style={{ color: c }} />;
      case 'FileText':    return <FileText    size={sz} style={{ color: c }} />;
      case 'DollarSign':  return <DollarSign  size={sz} style={{ color: c }} />;
      case 'Activity':    return <Activity    size={sz} style={{ color: c }} />;
      case 'TrendingDown':return <TrendingDown size={sz} style={{ color: c }} />;
      default:            return <TrendingUp  size={sz} style={{ color: c }} />;
    }
  };

  return (
    <>
      <style>{TICKER_KEYFRAMES}</style>
      <div style={{
        background: 'linear-gradient(90deg, #060911 0%, #0c1220 50%, #060911 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        height: '34px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
        fontSize: '0.76rem',
        color: '#E2E8F0',
        zIndex: 40,
      }}>

        {/* ── Left badge ─────────────────────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.45rem',
          padding: '0 1rem',
          background: 'linear-gradient(135deg, #991B1B 0%, #7F1D1D 100%)',
          color: 'white', fontWeight: 800, height: '100%',
          flexShrink: 0, boxShadow: '4px 0 12px rgba(0,0,0,0.5)',
          letterSpacing: '0.04em', fontSize: '0.72rem',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: statusColor,
            boxShadow: `0 0 8px ${statusColor}`,
            display: 'inline-block',
            animation: fetchStatus === 'live' ? 'tickerPulse 2s ease-in-out infinite' : 'none',
          }} />
          CBN / DMO MACRO PULSE
        </div>

        {/* ── Scrolling ticker ───────────────────────────────────────────── */}
        <div
          style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className={`macro-marquee-container${isPaused ? ' paused' : ''}`}>
            {[...macroItems, ...macroItems].map((item, idx) => (
              <div key={`${item.id}-${idx}`} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0 1.5rem',
                borderRight: '1px solid rgba(255,255,255,0.06)',
                whiteSpace: 'nowrap',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', opacity: 0.9 }}>
                  {renderIcon(item)}
                </span>
                <span style={{ fontWeight: 700, color: '#94A3B8', fontSize: '0.72rem', letterSpacing: '0.03em' }}>
                  {item.category}:
                </span>
                <span style={{ fontWeight: 800, color: 'white' }}>
                  {item.value}
                </span>
                <span style={{
                  fontSize: '0.68rem', fontWeight: 700,
                  padding: '0.1rem 0.4rem', borderRadius: '3px',
                  background: item.trend === 'up'   ? 'rgba(248,113,113,0.15)'
                            : item.trend === 'down'  ? 'rgba(56,189,248,0.15)'
                            : 'rgba(148,163,184,0.15)',
                  color: item.trend === 'up'   ? '#F87171'
                       : item.trend === 'down'  ? '#38BDF8'
                       : '#94A3B8',
                  display: 'flex', alignItems: 'center', gap: '0.2rem',
                }}>
                  {item.trend === 'up'   && <TrendingUp   size={10} />}
                  {item.trend === 'down' && <TrendingDown size={10} />}
                  {item.change}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: status + sync button ────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.55rem',
          padding: '0 0.85rem',
          background: '#090d16',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          height: '100%', flexShrink: 0,
        }}>
          {/* Status pill */}
          <span style={{
            fontSize: '0.62rem', fontWeight: 800,
            padding: '0.15rem 0.5rem', borderRadius: '20px',
            background: `${statusColor}18`,
            border: `1px solid ${statusColor}44`,
            color: statusColor,
            letterSpacing: '0.06em',
            whiteSpace: 'nowrap',
          }}>
            {statusLabel}
          </span>

          {/* Age */}
          <span style={{ fontSize: '0.66rem', color: '#475569', whiteSpace: 'nowrap' }}>
            {getAgeLabel()}
          </span>

          {/* ⟳ Sync Rates button */}
          <button
            onClick={fetchLiveData}
            disabled={isRefreshing}
            title="Sync live rates now from CBN, DMO and FX sources"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.3rem',
              background: isRefreshing ? 'rgba(255,255,255,0.04)' : 'rgba(99,102,241,0.12)',
              border: `1px solid ${isRefreshing ? 'rgba(255,255,255,0.08)' : 'rgba(99,102,241,0.3)'}`,
              borderRadius: '5px',
              padding: '0.2rem 0.55rem',
              color: isRefreshing ? '#475569' : '#a5b4fc',
              fontWeight: 700,
              fontSize: '0.66rem',
              cursor: isRefreshing ? 'not-allowed' : 'pointer',
              letterSpacing: '0.03em',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            <RefreshCw
              size={11}
              style={{
                animation: isRefreshing ? 'tickerSpin 0.9s linear infinite' : 'none',
                flexShrink: 0,
              }}
            />
            {isRefreshing ? 'Syncing…' : '⟳ Sync Rates'}
          </button>
        </div>

      </div>
    </>
  );
};

export default CbnDmoMacroTicker;
