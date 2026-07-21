import React, { useRef, useContext, useState } from 'react';
import * as XLSX from 'xlsx';
import { AuditContext } from '../context/AuditContext';

// Premium Bulk Upload Modal — RiskINTEGRA Internal Audit Suite (no localStorage)

const KEYFRAMES = `
  @keyframes auditFadeIn  { from { opacity:0; transform:scale(0.96) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }
  @keyframes auditSpin    { 100% { transform: rotate(360deg); } }
  @keyframes auditProgress{ 0%{background-position:-200% 0} 100%{background-position:200% 0} }
`;

const TEMPLATE_CONFIGS = {
  findings: {
    filename: 'ZPC_Audit_Findings_Template.xlsx',
    sheetName: 'AuditFindings',
    // Columns match audit_findings table exactly (snake_case)
    // finding_number UNIQUE NOT NULL, business_unit NOT NULL, observation NOT NULL
    headers: ['finding_number','business_unit','observation','criteria','root_cause','likelihood','impact','residual_risk','priority','severity','status','management_response','remediation_date','auditor'],
    label: 'Audit Findings',
    accent: '16,185,129',
    data: [
      { finding_number:'FND-2026-101', business_unit:'Settlements & Corporate Actions', observation:'Unreconciled Dividend Sweep Variance of ₦12M across Fund II accounts', criteria:'PENCOM Section 63 Custody Guidelines', root_cause:'System timeout during clearing window', likelihood:7, impact:8, residual_risk:56, priority:'High', severity:'High', status:'Open', management_response:'Reviewing automated bridge failover logs.', remediation_date:'2026-09-30', auditor:'Chief Senior Auditor' },
      { finding_number:'FND-2026-102', business_unit:'Contribution Reconciliation Dept', observation:'24h Employer Contribution Schedule Delay beyond SLA threshold', criteria:'SLA Breach Prevention Circular', root_cause:'Portal schedule ingestion lag during peak period', likelihood:6, impact:8, residual_risk:48, priority:'High', severity:'High', status:'Open', management_response:'Upgraded employer API gateway bandwidth.', remediation_date:'2026-08-15', auditor:'Lead Operations Auditor' },
    ],
  },
  universe: {
    filename: 'ZPC_Audit_Universe_Template.xlsx',
    sheetName: 'AuditUniverse',
    // Columns match audit_universe table exactly (snake_case)
    // unit_id NOT NULL, department NOT NULL, process_name NOT NULL
    headers: ['unit_id','department','process_name','inherent_risk','financial_exposure','regulatory_impact','priority','last_audit_date','lead_auditor'],
    label: 'Audit Universe',
    accent: '99,102,241',
    data: [
      { unit_id:'UNIV-101', department:'Treasury & Markets', process_name:'Money Market Placement & Haircut Controls', inherent_risk:8, financial_exposure:9, regulatory_impact:8, priority:'High', last_audit_date:'2025-11-30', lead_auditor:'Lead Treasury Auditor' },
      { unit_id:'UNIV-102', department:'IT & Cybersecurity', process_name:'Core Banking & Custody DB Failover & BCP', inherent_risk:9, financial_exposure:8, regulatory_impact:9, priority:'Critical', last_audit_date:'2025-10-15', lead_auditor:'Lead IT Auditor' },
    ],
  },
  plans: {
    filename: 'ZPC_Annual_Audit_Plans_Template.xlsx',
    sheetName: 'AuditPlans',
    // Columns match audit_plans table exactly (snake_case)
    // plan_id UNIQUE NOT NULL, audit_name NOT NULL, department NOT NULL
    headers: ['plan_id','audit_name','department','planned_hours','actual_hours','status','start_date','end_date','lead_auditor'],
    label: 'Annual Audit Plans',
    accent: '251,191,36',
    data: [
      { plan_id:'PLAN-2026-01', audit_name:'Annual Custody Operations Review', department:'Pension Operations', planned_hours:320, actual_hours:0, status:'Approved', start_date:'2026-02-01', end_date:'2026-03-15', lead_auditor:'Chief Senior Auditor' },
      { plan_id:'PLAN-2026-02', audit_name:'RMAS Cybersecurity Penetration Test', department:'IT & Cybersecurity', planned_hours:240, actual_hours:0, status:'Approved', start_date:'2026-04-10', end_date:'2026-05-20', lead_auditor:'Lead IT Auditor' },
    ],
  },
};

export default function AuditDataUpload({ targetModule = 'findings', buttonText = 'Batch Data Ingestion' }) {
  const { bulkUploadRecords } = useContext(AuditContext);
  const fileInputRef = useRef();

  const [isOpen, setIsOpen]             = useState(false);
  const [parsedData, setParsedData]     = useState([]);
  const [isDragOver, setIsDragOver]     = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle | uploading | success | error
  const [uploadMsg, setUploadMsg]       = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName]         = useState('');

  const cfg = TEMPLATE_CONFIGS[targetModule] || TEMPLATE_CONFIGS.findings;
  const accentRgb = cfg.accent;

  /* ── Template download ──────────────────────────────────────────── */
  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet(cfg.data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, cfg.sheetName);
    XLSX.writeFile(wb, cfg.filename);
  };

  /* ── File parsing ───────────────────────────────────────────────── */
  const processFile = (file) => {
    setFileName(file.name);
    const ext = file.name.split('.').pop().toLowerCase();
    const reader = new FileReader();

    if (ext === 'json') {
      reader.onload = (e) => {
        try { const d = JSON.parse(e.target.result); setParsedData(Array.isArray(d) ? d : []); }
        catch { setParsedData([]); }
      };
      reader.readAsText(file);
    } else if (['csv','xlsx','xls'].includes(ext)) {
      reader.onload = (e) => {
        try {
          const wb = XLSX.read(e.target.result, { type: 'binary' });
          const ws = wb.Sheets[wb.SheetNames[0]];
          setParsedData(XLSX.utils.sheet_to_json(ws));
        } catch { setParsedData([]); }
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleFileUpload = (e) => { if (e.target.files[0]) processFile(e.target.files[0]); };
  const handleDragOver   = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave  = () => setIsDragOver(false);
  const handleDrop       = (e) => { e.preventDefault(); setIsDragOver(false); if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]); };

  /* ── DB commit via S3 pre-signed URL (IFRS 9 ECL pattern) ─────────
   *  Phase 1 (0–10%):  Get a signed S3 PUT URL from backend
   *  Phase 2 (10–80%): Upload full JSON directly to S3 (no API GW limit)
   *  Phase 3 (80–100%): Tell backend the S3 key → it streams + inserts
   * ──────────────────────────────────────────────────────────────────── */
  const AUDIT_API_BASE = (import.meta.env.VITE_AWS_API_URL || 'https://uhzosq0g0i.execute-api.eu-west-1.amazonaws.com/prod').replace(/\/$/, '');

  const AUDIT_BULK_ENDPOINTS = {
    findings: `${AUDIT_API_BASE}/api/audit/findings/bulk`,
    universe: `${AUDIT_API_BASE}/api/audit/universe/bulk`,
    plans:    `${AUDIT_API_BASE}/api/audit/plans/bulk`,
  };

  const commitIngest = async () => {
    if (!parsedData.length) return;
    setUploadStatus('uploading');
    setUploadProgress(5);

    try {
      // ── Phase 1: Get signed URL ──────────────────────────────────────
      setUploadMsg(`Phase 1/3 — Obtaining secure upload URL…`);
      const signedUrlRes = await fetch(`${AUDIT_API_BASE}/api/upload/signed-url`);
      if (!signedUrlRes.ok) throw new Error('Failed to obtain secure upload URL from server');
      const { url: s3PutUrl, key: s3Key } = await signedUrlRes.json();
      setUploadProgress(10);

      // ── Phase 2: Upload JSON directly to S3 via XHR (with progress) ─
      setUploadMsg(`Phase 2/3 — Uploading ${parsedData.length.toLocaleString()} records to secure storage…`);
      const jsonBody = JSON.stringify(parsedData);

      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', s3PutUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = 10 + Math.round((e.loaded / e.total) * 70);
            setUploadProgress(pct);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`S3 upload failed with status ${xhr.status}`));
        };
        xhr.onerror = () => reject(new Error('S3 upload network error'));
        xhr.send(jsonBody);
      });

      setUploadProgress(80);

      // ── Phase 3: bulkUploadRecords reads from S3 key ─────────────────
      setUploadMsg(`Phase 3/3 — Writing ${parsedData.length.toLocaleString()} records to database…`);
      const inserted = await bulkUploadRecords(targetModule, parsedData, s3Key);

      setUploadProgress(100);
      setUploadStatus('success');
      setUploadMsg(`✓ Successfully imported ${(inserted || parsedData.length).toLocaleString()} records to the database`);
      setTimeout(closeModal, 1800);
    } catch (err) {
      console.error('Audit bulk import error:', err);
      setUploadStatus('error');
      setUploadMsg(err.message || 'Upload failed. Check your file format and retry.');
    }
  };


  const closeModal = () => {
    setIsOpen(false);
    setParsedData([]);
    setFileName('');
    setUploadStatus('idle');
    setUploadMsg('');
    setUploadProgress(0);
  };

  /* ── Shared style helpers ───────────────────────────────────────── */
  const pill = (col) => ({ display:'inline-flex', alignItems:'center', gap:6, padding:'3px 10px', borderRadius:20, background:`rgba(${col},0.12)`, border:`1px solid rgba(${col},0.28)`, fontSize:'0.7rem', fontWeight:700, color:`rgb(${col})` });

  const S = {
    overlay:  { position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.74)', backdropFilter:'blur(15px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000, animation:'auditFadeIn 0.22s ease-out' },
    card:     { background:'linear-gradient(145deg,rgba(7,15,30,0.99),rgba(10,18,35,0.97))', border:`1px solid rgba(${accentRgb},0.2)`, borderRadius:16, width:'92%', maxWidth:710, maxHeight:'90vh', overflowY:'auto', padding:0, boxShadow:`0 32px 64px rgba(0,0,0,0.7),0 0 0 1px rgba(${accentRgb},0.08),inset 0 1px 0 rgba(255,255,255,0.04)` },
    header:   { background:`linear-gradient(135deg,rgba(${accentRgb},0.16),rgba(${accentRgb},0.06))`, borderBottom:`1px solid rgba(${accentRgb},0.14)`, padding:'20px 24px', display:'flex', justifyContent:'space-between', alignItems:'center' },
    body:     { padding:'24px', display:'flex', flexDirection:'column', gap:'20px' },
    footer:   { borderTop:'1px solid rgba(255,255,255,0.05)', padding:'16px 24px', display:'flex', justifyContent:'space-between', alignItems:'center' },
    stepHdr:  { fontSize:'0.67rem', fontWeight:700, letterSpacing:'0.1em', color:`rgba(${accentRgb},0.65)`, marginBottom:10 },
    section:  { background:'rgba(255,255,255,0.018)', border:'1px solid rgba(255,255,255,0.055)', borderRadius:10, padding:'16px' },
    dropZone: (active) => ({ border:`2px dashed ${active ? `rgb(${accentRgb})` : 'rgba(255,255,255,0.11)'}`, borderRadius:10, padding:'28px 20px', textAlign:'center', background: active ? `rgba(${accentRgb},0.06)` : 'rgba(0,0,0,0.14)', transition:'all 0.2s', cursor:'pointer' }),
    dlBtn:    { width:'100%', padding:'10px 16px', borderRadius:8, border:`1px solid rgba(${accentRgb},0.35)`, background:`linear-gradient(135deg,rgba(${accentRgb},0.15),rgba(${accentRgb},0.08))`, color:`rgb(${accentRgb})`, fontWeight:600, cursor:'pointer', fontSize:'0.82rem', display:'flex', alignItems:'center', justifyContent:'space-between' },
    importBtn:(ok) => ({ padding:'9px 22px', borderRadius:8, border:'none', background: ok ? `linear-gradient(135deg,rgb(${accentRgb}),rgba(${accentRgb},0.7))` : 'rgba(71,85,105,0.5)', color:'white', fontWeight:700, fontSize:'0.82rem', cursor: ok ? 'pointer' : 'not-allowed', display:'flex', alignItems:'center', gap:6, opacity: ok ? 1 : 0.5, boxShadow: ok ? `0 4px 12px rgba(${accentRgb},0.35)` : 'none', transition:'all 0.2s' }),
    cancelBtn:{ padding:'9px 18px', borderRadius:8, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'#94a3b8', fontWeight:600, fontSize:'0.82rem', cursor:'pointer' },
    th: { padding:'8px 10px', fontSize:'0.68rem', fontWeight:700, color:'#94a3b8', textAlign:'left', borderBottom:'1px solid rgba(255,255,255,0.06)', background:'rgba(0,0,0,0.3)', whiteSpace:'nowrap' },
    td: { padding:'7px 10px', fontSize:'0.72rem', color:'#cbd5e1', borderBottom:'1px solid rgba(255,255,255,0.04)', maxWidth:130, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' },
  };

  const isReady = parsedData.length > 0 && uploadStatus !== 'uploading';

  return (
    <>
      <style>{KEYFRAMES}</style>

      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        style={{ padding:'0.45rem 1rem', borderRadius:8, border:`1px solid rgba(${accentRgb},0.32)`, background:`linear-gradient(135deg,rgba(${accentRgb},0.12),rgba(${accentRgb},0.06))`, color:`rgb(${accentRgb})`, fontWeight:600, cursor:'pointer', fontSize:'0.8rem', display:'flex', alignItems:'center', gap:'0.4rem', backdropFilter:'blur(4px)', transition:'all 0.2s' }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        {buttonText}
      </button>

      {isOpen && (
        <div style={S.overlay} onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div style={S.card}>

            {/* ── Header ── */}
            <div style={S.header}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:38, height:38, borderRadius:10, background:`linear-gradient(135deg,rgba(${accentRgb},0.28),rgba(${accentRgb},0.12))`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', border:`1px solid rgba(${accentRgb},0.22)` }}>🏛️</div>
                <div>
                  <div style={{ fontSize:'1rem', fontWeight:700, color:'white' }}>Audit Batch Ingestion Portal</div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:3 }}>
                    <span style={{ fontSize:'0.72rem', color:'#94a3b8' }}>Module:</span>
                    <span style={pill(accentRgb)}>{cfg.label}</span>
                  </div>
                </div>
              </div>
              <button onClick={closeModal} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#94a3b8', borderRadius:8, width:32, height:32, cursor:'pointer', fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
            </div>

            {/* ── Body ── */}
            <div style={S.body}>

              {/* Step 1 — Download Template */}
              <div style={S.section}>
                <div style={S.stepHdr}>STEP 1 — DOWNLOAD TEMPLATE</div>
                <button onClick={downloadTemplate} style={S.dlBtn}>
                  <span>📥 {cfg.filename}</span>
                  <span style={{ fontSize:'0.7rem', opacity:0.6 }}>Click to download →</span>
                </button>
                <p style={{ margin:'8px 0 0', fontSize:'0.72rem', color:'#64748b' }}>Required columns: <code style={{ color:`rgb(${accentRgb})` }}>{cfg.headers.join(', ')}</code></p>
              </div>

              {/* Step 2 — Upload File */}
              <div style={S.section}>
                <div style={S.stepHdr}>STEP 2 — UPLOAD FILE</div>
                <div
                  style={S.dropZone(isDragOver)}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {fileName ? (
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
                      <span style={{ ...pill(accentRgb), padding:'5px 14px', fontSize:'0.78rem' }}>
                        📄 {fileName}
                        <button onClick={(e) => { e.stopPropagation(); setParsedData([]); setFileName(''); }} style={{ background:'none', border:'none', color:`rgb(${accentRgb})`, cursor:'pointer', marginLeft:4, fontSize:'0.9rem' }}>×</button>
                      </span>
                    </div>
                  ) : (
                    <>
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={`rgba(${accentRgb},0.5)`} strokeWidth="1.5" style={{ display:'block', margin:'0 auto 10px' }}><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>
                      <p style={{ color:'#94a3b8', fontSize:'0.82rem', margin:'0 0 4px' }}>Drag & Drop your completed audit template here</p>
                      <p style={{ color:'#475569', fontSize:'0.72rem', margin:0 }}>or click to browse · Supports <strong style={{ color:`rgb(${accentRgb})` }}>.xlsx, .csv, .xls</strong></p>
                    </>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls,.json" onChange={handleFileUpload} style={{ display:'none' }} />
              </div>

              {/* Step 3 — Preview */}
              {parsedData.length > 0 && (
                <div style={S.section}>
                  <div style={S.stepHdr}>STEP 3 — PREVIEW ({parsedData.length} ROWS DETECTED)</div>
                  <div style={{ overflowX:'auto', borderRadius:8, border:'1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ maxHeight:200, overflowY:'auto' }}>
                      <table style={{ width:'100%', borderCollapse:'collapse', minWidth:500 }}>
                        <thead style={{ position:'sticky', top:0, zIndex:1 }}>
                          <tr>{cfg.headers.map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
                        </thead>
                        <tbody>
                          {parsedData.slice(0,15).map((row, i) => (
                            <tr key={i} style={{ background: i % 2 === 0 ? 'rgba(0,0,0,0.15)' : 'transparent' }}>
                              {cfg.headers.map(h => <td key={h} style={S.td} title={String(row[h] ?? '')}>{String(row[h] ?? '').slice(0,60)}</td>)}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {parsedData.length > 15 && (
                      <div style={{ padding:'6px 12px', textAlign:'center', fontSize:'0.7rem', color:'#475569', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
                        + {parsedData.length - 15} more rows not shown
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4 — Status / Progress */}
              {uploadStatus !== 'idle' && (
                <div style={{ borderRadius:10, overflow:'hidden', border:`1px solid ${uploadStatus === 'success' ? `rgba(${accentRgb},0.35)` : uploadStatus === 'error' ? 'rgba(239,68,68,0.3)' : `rgba(${accentRgb},0.25)`}` }}>
                  {uploadStatus === 'uploading' && (
                    <div style={{ padding:'14px 16px', background:`rgba(${accentRgb},0.08)` }}>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={`rgb(${accentRgb})`} strokeWidth="2.5" style={{ animation:'auditSpin 1s linear infinite', flexShrink:0 }}><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
                          <span style={{ fontSize:'0.78rem', fontWeight:600, color:`rgb(${accentRgb})` }}>{uploadMsg || 'Writing records to database…'}</span>
                        </div>
                        <span style={{ fontSize:'0.75rem', fontWeight:800, color:`rgb(${accentRgb})`, fontVariantNumeric:'tabular-nums' }}>{uploadProgress}%</span>
                      </div>
                      <div style={{ height:6, borderRadius:4, background:`rgba(${accentRgb},0.12)`, overflow:'hidden' }}>
                        <div style={{
                          height:'100%',
                          borderRadius:4,
                          width:`${uploadProgress}%`,
                          background:`linear-gradient(90deg,rgb(${accentRgb}),rgba(${accentRgb},0.6),rgb(${accentRgb}))`,
                          transition:'width 0.4s ease-out',
                          boxShadow:`0 0 8px rgba(${accentRgb},0.5)`
                        }} />
                      </div>
                    </div>
                  )}
                  {uploadStatus === 'success' && (
                    <div style={{ padding:'14px 16px', background:`rgba(${accentRgb},0.07)`, display:'flex', alignItems:'center', gap:10 }}>
                      <span style={{ fontSize:'1.2rem' }}>✅</span>
                      <span style={{ fontSize:'0.8rem', fontWeight:600, color:`rgb(${accentRgb})` }}>{uploadMsg}</span>
                    </div>
                  )}
                  {uploadStatus === 'error' && (
                    <div style={{ padding:'14px 16px', background:'rgba(239,68,68,0.08)', display:'flex', alignItems:'center', gap:10 }}>
                      <span style={{ fontSize:'1.2rem' }}>❌</span>
                      <span style={{ fontSize:'0.8rem', fontWeight:600, color:'#f87171' }}>Upload failed. Check your file format matches the template and retry.</span>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* ── Footer ── */}
            <div style={S.footer}>
              <div>
                {parsedData.length > 0 && (
                  <span style={pill(accentRgb)}>{parsedData.length} record{parsedData.length !== 1 ? 's' : ''} ready to import</span>
                )}
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={closeModal} style={S.cancelBtn}>Cancel</button>
                <button onClick={commitIngest} disabled={!isReady} style={S.importBtn(isReady)}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Import to Database
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
