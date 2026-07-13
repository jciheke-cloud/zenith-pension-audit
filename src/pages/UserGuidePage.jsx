import React, { useState } from 'react';
import { BookOpen, ShieldCheck, Layers, Users, Key, ExternalLink, Search, CheckCircle2, ChevronRight, HelpCircle, FileText, Share2 } from 'lucide-react';

const UserGuidePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    { id: 'overview', label: '📖 Executive Overview', icon: BookOpen },
    { id: 'rbac', label: '🔐 Roles & RBAC Security', icon: Key },
    { id: 'modules', label: '📊 14 Audit Modules', icon: Layers },
    { id: 'sso', label: '🔄 SSO & App Switcher', icon: Share2 },
    { id: 'compliance', label: '⚖️ PENCOM & CBN Regs', icon: ShieldCheck },
    { id: 'cloud', label: '☁️ Netlify & AWS Setup', icon: ExternalLink },
    { id: 'faq', label: '❓ Troubleshooting & FAQs', icon: HelpCircle }
  ];

  const modulesList = [
    { name: '1. Executive Dashboard', desc: 'Real-time overview of Total Assets Under Custody (e.g. ₦18.45T), PFC Statutory Capital Adequacy against Section 63 PRA 2014, and live finding severities.' },
    { name: '2. Master Data Foundation', desc: 'Central audit universe cataloging all custodial departments, historical audit frequencies, and inherent risk ratings.' },
    { name: '3. Annual Audit Planning', desc: 'Q1-Q4 engagement scheduler. Dynamically adjusts audit timing when custodial loss events or high risk scores emerge.' },
    { name: '4. Risk-Based Planning Engine', desc: 'Quantitative priority matrix calculating audit priority using: Impact × Likelihood × Control Deficit factor.' },
    { name: '5. Audit Engagements', desc: 'Operational lifecycle for specific audit projects from Planning through Fieldwork, Review, and Final Sign-Off.' },
    { name: '6. Audit Programs Library', desc: 'Standardized testing procedures and test steps across Settlement, Reconciliation, and IT Custodial areas.' },
    { name: '7. Working Papers & Evidence', desc: 'Digital binder where auditors attach cryptographic proof, bank reconciliation statements, and peer review sign-offs.' },
    { name: '8. Findings & 10×10 Matrix', desc: 'Comprehensive log of internal control deficiencies categorized by Critical, High, Medium, and Low ratings.' },
    { name: '9. Action Tracker (CAPs)', desc: 'Post-audit monitoring tool to track management remediation dates and verify corrective action closures.' },
    { name: '10. Internal Controls Assessment', desc: 'COSO-aligned catalog mapping custodial controls (such as dual-authorization and SWIFT confirmation) to specific risks.' },
    { name: '11. Compliance & Regulatory', desc: 'Dedicated tracking for PENCOM Guidelines, Section 63 PRA 2014 statutory capital, and CBN money market rules.' },
    { name: '12. Fraud & Continuous Auditing', desc: 'Automated monitoring rules flagging after-hours settlement spikes, duplicate references, or unusual reconciliatory items.' },
    { name: '13. Reports & Committee Portal', desc: 'One-click generator for Board Audit & Risk Committee (BARC) presentation decks and quarterly sign-off sheets.' },
    { name: '14. ERM Sync Bridge™', desc: 'Live data bridge pulling updated KRIs and Loss Ledgers from the companion RiskINTEGRA ERM Suite.' }
  ];

  const filteredModules = modulesList.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', color: '#F8FAFC' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(200, 30, 30, 0.2) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(200, 30, 30, 0.4)',
        borderRadius: '1rem',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', background: '#C81E1E', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 800 }}>
              OFFICIAL DOCUMENTATION
            </span>
            <span style={{ color: '#fda4af', fontSize: '0.8rem', fontWeight: 600 }}>
              Version 3.4-PROD (2026 Release)
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: '0 0 0.5rem', background: 'linear-gradient(90deg, #FFFFFF 0%, #FECACA 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            RiskINTEGRA Internal Audit Suite™ — User Guide
          </h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem 1.2rem', borderRadius: '0.6rem', display: 'inline-block' }}>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Institutional License</div>
            <div style={{ fontSize: '0.9rem', color: '#34D399', fontWeight: 800, marginTop: '2px' }}>✓ ZPC-PENCOM-SECTION63</div>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(270px, 300px) 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Navigation Sidebar Tabs */}
        <div style={{
          background: '#0B1120',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '1rem',
          padding: '1rem',
          position: 'sticky',
          top: '90px'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0.5rem 0.8rem', marginBottom: '0.5rem' }}>
            Table of Contents
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {sections.map(sec => {
              const Icon = sec.icon;
              const active = activeTab === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveTab(sec.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    padding: '0.75rem 0.9rem',
                    borderRadius: '0.6rem',
                    background: active ? 'linear-gradient(135deg, #C81E1E 0%, #991B1B 100%)' : 'transparent',
                    color: active ? 'white' : '#CBD5E1',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: active ? 700 : 500,
                    fontSize: '0.86rem',
                    textAlign: 'left',
                    lineHeight: 1.35,
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1 }}>
                    <Icon size={16} style={{ flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{sec.label}</span>
                  </span>
                  {active && <ChevronRight size={15} style={{ flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Pane */}
        <div style={{
          background: '#0B1120',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '1rem',
          padding: '2rem',
          minHeight: '650px'
        }}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fda4af', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', marginTop: 0 }}>
                📖 Executive Overview & Philosophy
              </h2>
              <p style={{ lineHeight: 1.8, fontSize: '0.95rem', color: '#E2E8F0' }}>
                Welcome to <strong>RiskINTEGRA Internal Audit Management™</strong>, engineered explicitly for <strong>Zenith Pension Custodian Limited (ZPC)</strong>. Traditional internal auditing relies on periodic, backward-looking examinations that often miss rapidly emerging settlement variances or market shocks.
              </p>
              <p style={{ lineHeight: 1.8, fontSize: '0.95rem', color: '#E2E8F0' }}>
                RiskINTEGRA shifts institutional governance into a <strong>continuous, risk-based auditing paradigm</strong>. By directly linking with our <strong>Enterprise Risk Management (ERM) Suite</strong>, this platform ensures that whenever a custodial loss is reported or a Key Risk Indicator (KRI) breaches its threshold, your Annual Audit Plan automatically highlights the affected operational area for immediate examination.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginTop: '1.5rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ color: '#F87171', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.4rem' }}>100% Risk-Aligned</div>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#94A3B8', lineHeight: 1.5 }}>
                    Every audit engagement is quantitatively prioritized based on Impact, Likelihood, and Internal Control deficits.
                  </p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ color: '#34D399', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.4rem' }}>PENCOM Section 63</div>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#94A3B8', lineHeight: 1.5 }}>
                    Continuous statutory tracking of PFC Capital Adequacy against minimum regulatory capital requirements.
                  </p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ color: '#60A5FA', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.4rem' }}>SSO Cross-App Bridge</div>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#94A3B8', lineHeight: 1.5 }}>
                    Jump seamlessly between Internal Audit and ERM with one click—maintaining your exact executive security role.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RBAC */}
          {activeTab === 'rbac' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fda4af', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', marginTop: 0 }}>
                🔐 Executive Role-Based Access Control (RBAC)
              </h2>
              <p style={{ lineHeight: 1.7, fontSize: '0.92rem', color: '#CBD5E1', marginBottom: '1.5rem' }}>
                To maintain strict independence and governance, operations within RiskINTEGRA are segregated across 4 distinct institutional tiers. You can select your role on the login screen or switch anytime using the top profile selector:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ borderLeft: '4px solid #C81E1E', background: 'rgba(200, 30, 30, 0.08)', padding: '1.25rem', borderRadius: '0 0.75rem 0.75rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'white' }}>Chief Audit Executive (CAE)</span>
                    <span style={{ background: '#C81E1E', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>TIER 1 — FULL OVERRIDE</span>
                  </div>
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#E2E8F0', lineHeight: 1.6 }}>
                    <strong>Capabilities:</strong> Final approval of the Annual Audit Plan, sign-off on completed Working Papers, generation of official Board Audit & Risk Committee (BARC) decks, and authority to bridge directly into the Chief Risk Officer (CRO) ERM view.
                  </p>
                </div>

                <div style={{ borderLeft: '4px solid #F59E0B', background: 'rgba(245, 158, 11, 0.08)', padding: '1.25rem', borderRadius: '0 0.75rem 0.75rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'white' }}>Senior Audit Manager</span>
                    <span style={{ background: '#D97706', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>TIER 2 — OVERSIGHT</span>
                  </div>
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#E2E8F0', lineHeight: 1.6 }}>
                    <strong>Capabilities:</strong> Engagement scheduling, allocation of audit hours, peer review of audit test results, formal adjudication of management exceptions, and tracking of Corrective Action Plans (CAPs).
                  </p>
                </div>

                <div style={{ borderLeft: '4px solid #3B82F6', background: 'rgba(59, 130, 246, 0.08)', padding: '1.25rem', borderRadius: '0 0.75rem 0.75rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'white' }}>Audit Team Leader</span>
                    <span style={{ background: '#2563EB', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>TIER 3 — SUPERVISION</span>
                  </div>
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#E2E8F0', lineHeight: 1.6 }}>
                    <strong>Capabilities:</strong> Supervision of field fieldwork, verification of uploaded evidence binders, preliminary risk scoring of findings, and coordination of audit programs.
                  </p>
                </div>

                <div style={{ borderLeft: '4px solid #10B981', background: 'rgba(16, 185, 129, 0.08)', padding: '1.25rem', borderRadius: '0 0.75rem 0.75rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'white' }}>Field Auditor / Analyst</span>
                    <span style={{ background: '#059669', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>TIER 4 — EXECUTION</span>
                  </div>
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#E2E8F0', lineHeight: 1.6 }}>
                    <strong>Capabilities:</strong> Execution of individual audit program test steps, attachment of bank reconciliation sheets and SWIFT proofs, and drafting of initial observation reports.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MODULES BREAKDOWN */}
          {activeTab === 'modules' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fda4af', margin: 0 }}>
                  📊 The 14 Audit Modules Breakdown
                </h2>
                <div style={{ position: 'relative', width: '280px' }}>
                  <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#64748B' }} />
                  <input
                    type="text"
                    placeholder="Search modules..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem 0.5rem 2.1rem',
                      background: '#090D16',
                      border: '1px solid #334155',
                      borderRadius: '0.5rem',
                      color: 'white',
                      fontSize: '0.8rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {filteredModules.map((mod, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '0.75rem',
                    padding: '1.1rem',
                    transition: 'border-color 0.2s'
                  }}>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: 'white', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={16} color="#fda4af" />
                      <span>{mod.name}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#94A3B8', lineHeight: 1.5 }}>
                      {mod.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BI-DIRECTIONAL SSO & SWITCHER */}
          {activeTab === 'sso' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fda4af', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', marginTop: 0 }}>
                🔄 Bi-Directional SSO & Ecosystem App Switcher
              </h2>
              <p style={{ lineHeight: 1.8, fontSize: '0.95rem', color: '#E2E8F0' }}>
                Zenith Pension Custodian operates two interconnected corporate governance suites: <strong>RiskINTEGRA ERM</strong> (`localhost:5173` or Netlify) and <strong>RiskINTEGRA Internal Audit</strong> (`localhost:5174` or Netlify).
              </p>
              
              <div style={{ background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.2) 0%, rgba(15, 23, 42, 0.8) 100%)', border: '1px solid #3B82F6', padding: '1.5rem', borderRadius: '0.85rem', margin: '1.5rem 0' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#60A5FA', marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Share2 size={18} /> How to Switch Apps with One Click
                </h3>
                <ol style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.8, fontSize: '0.88rem', color: '#CBD5E1' }}>
                  <li>Look at the right side of your Topbar, next to the <strong>Currency Switcher (💱 NGN)</strong>.</li>
                  <li>Click the <strong>`Apps ⠿`</strong> grid button to expand the <strong>RiskINTEGRA Ecosystem Suite™</strong> menu.</li>
                  <li>Click on <strong>"Launch ERM with active role ➔"</strong>.</li>
                  <li>The system will automatically redirect you to the ERM app while attaching an encrypted SSO Boarding Pass (`?sso_role=cae&sso_token=riskintegra_auth_bridge`).</li>
                  <li>The ERM app instantly intercepts this pass, logs you in automatically without asking for credentials, and cleans up your address bar!</li>
                </ol>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>Connecting Across Netlify & Cloud Domains</h3>
              <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6 }}>
                If you upload your two apps to Netlify under custom links (e.g. `zpc-audit-demo.netlify.app`), you do not need to rewrite code or configure environment variables! Simply click **`Apps ⠿`** ➔ Click **`⚙️ Set Link`** at the top right of the menu ➔ Paste your ERM Netlify URL once and click **Link**. The bridge is immediately saved in your browser!
              </p>
            </div>
          )}

          {/* TAB 5: COMPLIANCE & PENCOM */}
          {activeTab === 'compliance' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fda4af', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', marginTop: 0 }}>
                ⚖️ PENCOM & CBN Regulatory Compliance Engine
              </h2>
              <p style={{ lineHeight: 1.7, fontSize: '0.92rem', color: '#CBD5E1' }}>
                Pension Fund Custodians (PFCs) in Nigeria operate under stringent fiduciary requirements mandated by the National Pension Commission (PENCOM). RiskINTEGRA embeds statutory checks directly into your audit programs:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', margin: '1.5rem 0' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ color: '#F87171', fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                    Section 63 PRA 2014 Capital Check
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>
                    Every PFC must maintain a minimum statutory capital and liquidity buffer. The Audit Dashboard continuously tracks our PFC Capital (e.g. ₦65.40 Billion) against the minimum regulatory threshold to ensure zero risk of license revocation.
                  </p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ color: '#34D399', fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                    Custodial Asset Segregation
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>
                    Auditing strict legal separation between Pension Fund Administrator (PFA) assets and Custodian proprietary accounts across RSA Fund I, II, III, IV, and VI.
                  </p>
                </div>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>Live CBN & DMO Sovereign Benchmark Feeds</h3>
              <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6 }}>
                Our top financial ticker continuously scrolls live exchange rates (USD/NGN, EUR/NGN, GBP/NGN), the **10-Yr FGN Bond Yield (19.75%)**, **364-Day T-Bill Yield (21.50%)**, and **CBN Monetary Policy Rate (26.75%)**. Auditors use these exact benchmarks when evaluating valuation accuracy of fixed-income custody portfolios.
              </p>
            </div>
          )}

          {/* TAB 6: CLOUD & NETLIFY */}
          {activeTab === 'cloud' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fda4af', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', marginTop: 0 }}>
                ☁️ Netlify & AWS Deployment Architecture
              </h2>
              <p style={{ lineHeight: 1.7, fontSize: '0.92rem', color: '#CBD5E1' }}>
                Both RiskINTEGRA suites have been built with a modern Single Page Application (SPA) structure using Vite and React, making them ready for instant deployment to Netlify or Amazon Web Services (AWS CloudFront/S3).
              </p>

              <div style={{ background: '#0F172A', border: '1px solid #334155', padding: '1.25rem', borderRadius: '0.75rem', fontFamily: 'monospace', fontSize: '0.82rem', color: '#38BDF8', margin: '1.25rem 0' }}>
                <div># Pre-configured Netlify Configuration inside repository (/netlify.toml)</div>
                <div>[build]</div>
                <div>&nbsp;&nbsp;command = "npm run build"</div>
                <div>&nbsp;&nbsp;publish = "dist"</div>
                <br />
                <div># SPA Redirect Rule (Prevents 404 errors when opening SSO URLs)</div>
                <div>[[redirects]]</div>
                <div>&nbsp;&nbsp;from = "/*"</div>
                <div>&nbsp;&nbsp;to = "/index.html"</div>
                <div>&nbsp;&nbsp;status = 200</div>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'white' }}>Domain Intellectual Property Protection</h3>
              <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6 }}>
                To safeguard Zenith Pension Custodian's proprietary continuous auditing algorithms, every build is wrapped in **`LicenseGuard.jsx`**. If unauthorized actors copy or deploy our frontend bundle to an unapproved web address outside your organization, execution stops immediately until the institutional enterprise key (`RISKINTEGRA-ZPC-2026-ENTERPRISE-PROD`) is entered.
              </p>
            </div>
          )}

          {/* TAB 7: FAQ */}
          {activeTab === 'faq' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fda4af', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', marginTop: 0 }}>
                ❓ Frequently Asked Questions & Troubleshooting
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', marginTop: '1.5rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontWeight: 800, color: 'white', fontSize: '0.95rem', marginBottom: '0.4rem' }}>
                    Q: Why does the App Switcher redirect to `localhost:5173` instead of my Netlify ERM app?
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.6 }}>
                    <strong>A:</strong> By default, if no custom link is saved, the app assumes you are testing on your local computer (`localhost:5173`). To fix this on Netlify: Click the **`Apps ⠿`** button ➔ Click **`⚙️ Set Link`** ➔ Paste your Netlify ERM URL (e.g. `https://zpc-erm.netlify.app`) and click **Link**.
                  </p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontWeight: 800, color: 'white', fontSize: '0.95rem', marginBottom: '0.4rem' }}>
                    Q: How do I switch reporting currency from NGN (₦) to USD ($) across charts?
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.6 }}>
                    <strong>A:</strong> Click the **`💱 NGN`** button in the Topbar utility menu. The currency toggle immediately recalculates Total Assets Under Custody and PFC Capital into USD, EUR, or GBP using the live CBN exchange rates displayed on the ticker bar!
                  </p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontWeight: 800, color: 'white', fontSize: '0.95rem', marginBottom: '0.4rem' }}>
                    Q: How do I generate an official Board Audit & Risk Committee (BARC) deck?
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.6 }}>
                    <strong>A:</strong> Navigate to **Module 13 (Reports & Committee Portal)** in the left sidebar, or click **"📄 PENCOM RMC Report Deck"** right on the Topbar of your Executive Dashboard. You can preview all slides and download them directly as a PDF or PowerPoint summary.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserGuidePage;
