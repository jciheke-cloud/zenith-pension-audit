import React, { useState } from 'react';
import { BookOpen, ShieldCheck, Layers, Users, Key, ExternalLink, Search, CheckCircle2, ChevronRight, HelpCircle, FileText, Share2, Wrench } from 'lucide-react';

const UserGuidePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    { id: 'overview', label: '📖 Executive Overview', icon: BookOpen },
    { id: 'rbac', label: '🔐 Roles & RBAC Security', icon: Key },
    { id: 'modules', label: '📊 14 Audit Modules', icon: Layers },
    { id: 'tools_guide', label: '🛠️ Interactive Tools Guide', icon: Wrench },
    { id: 'compliance', label: '⚖️ PENCOM & CBN Regs', icon: ShieldCheck },
    { id: 'switcher_guide', label: '🔀 Switching Between Apps', icon: ExternalLink },
    { id: 'faq', label: '❓ Troubleshooting & FAQs', icon: HelpCircle }
  ];

  const modulesList = [
    { 
      name: '1. Executive Dashboard', 
      desc: 'Real-time overview of Total Assets Under Custody (e.g. ₦18.45T), PFC Statutory Capital Adequacy against Section 63 PRA 2014, and live finding severities.',
      tools: ['Multi-currency valuation switch (NGN/USD/EUR/GBP)', 'Interactive department risk charts', 'Live finding severity metrics']
    },
    { 
      name: '2. Master Data Foundation', 
      desc: 'Central audit universe cataloging all custodial departments, historical audit frequencies, and inherent risk ratings.',
      tools: ['Risk rating filter engine', 'Custody department audit catalog', 'Historical frequency tracking']
    },
    { 
      name: '3. Annual Audit Planning', 
      desc: 'Q1-Q4 engagement scheduler. Dynamically adjusts audit timing when custodial loss events or high risk scores emerge.',
      tools: ['Q1-Q4 engagement scheduler', 'Interactive audit project adder', 'Dynamic frequency re-balancer']
    },
    { 
      name: '4. Risk-Based Planning Engine', 
      desc: 'Quantitative priority matrix calculating audit priority using: Impact × Likelihood × Control Deficit factor.',
      tools: ['Quantitative scoring calculator (Impact × Likelihood × Control)', 'Interactive 1-5 slider adjusters', 'Automated audit priority ranker']
    },
    { 
      name: '5. Audit Engagements', 
      desc: 'Operational lifecycle for specific audit projects from Planning through Fieldwork, Review, and Final Sign-Off.',
      tools: ['Engagement status workflow tracker', 'Budgeted vs. actual audit hour logger', 'Team lead & auditor assignment panel']
    },
    { 
      name: '6. Audit Programs Library', 
      desc: 'Standardized testing procedures and test steps across Settlement, Reconciliation, and IT Custodial areas.',
      tools: ['Test procedure checklist (Pass/Fail/N.A.)', 'Direct exception linking tool', 'Step-by-step audit testing scripts']
    },
    { 
      name: '7. Working Papers & Evidence', 
      desc: 'Digital binder where auditors attach cryptographic proof, bank reconciliation statements, and peer review sign-offs.',
      tools: ['Digital evidence vault attachment', 'Multi-tier RBAC sign-off (Auditor ➔ Lead ➔ CAE)', 'Reconciliation snapshot verifier']
    },
    { 
      name: '8. Findings & 10×10 Matrix', 
      desc: 'Comprehensive log of internal control deficiencies categorized by Critical, High, Medium, and Low ratings.',
      tools: ['Interactive severity filter (Critical/High/Med/Low)', 'Root cause analysis logger', 'Remediation date & owner assignment engine']
    },
    { 
      name: '9. Action Tracker (CAPs)', 
      desc: 'Post-audit monitoring tool to track management remediation dates and verify corrective action closures.',
      tools: ['Corrective Action Plan (CAP) closure verifier', 'Progress update request tool', 'Overdue remediation alert indicator']
    },
    { 
      name: '10. Internal Controls Assessment', 
      desc: 'COSO-aligned catalog mapping custodial controls (such as dual-authorization and SWIFT confirmation) to specific risks.',
      tools: ['COSO internal control domain mapper', 'Dual-authorization verification checklist', 'Risk-to-control gap analyzer']
    },
    { 
      name: '11. Compliance & Regulatory', 
      desc: 'Dedicated tracking for PENCOM Guidelines, Section 63 PRA 2014 statutory capital, and CBN money market rules.',
      tools: ['Section 63 PRA capital adequacy evaluator', 'PENCOM compliance verification engine', 'CBN FX & money market checklist']
    },
    { 
      name: '12. Fraud & Continuous Auditing', 
      desc: 'Automated monitoring rules flagging after-hours settlement spikes, duplicate references, or unusual reconciliatory items.',
      tools: ['24/7 automated rule monitoring rules (CA-01, CA-02, CA-03)', 'After-hours settlement anomaly detector', 'Duplicate SWIFT reference flagger']
    },
    { 
      name: '13. Reports & Committee Portal', 
      desc: 'One-click generator for Board Audit & Risk Committee (BARC) presentation decks and quarterly sign-off sheets.',
      tools: ['One-click BARC executive deck generator', 'Quarterly exception heatmap builder', 'Printable executive sign-off exporter']
    },
    { 
      name: '14. ERM Sync Bridge™', 
      desc: 'Live data bridge pulling updated KRIs and Loss Ledgers from the companion RiskINTEGRA ERM Suite.',
      tools: ['Bi-directional ERM data synchronization', 'Live KRI & Loss Ledger ingestion', 'Automated off-cycle audit trigger']
    }
  ];

  const filteredModules = modulesList.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.tools && m.tools.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
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

          {/* TAB 2: RBAC & ROLE VIEWS */}
          {activeTab === 'rbac' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fda4af', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', marginTop: 0 }}>
                🔐 Role Divisions & Tailored View Architecture (RBAC)
              </h2>
              <p style={{ lineHeight: 1.7, fontSize: '0.92rem', color: '#CBD5E1', marginBottom: '1.5rem' }}>
                To maintain strict institutional governance, independence, and operational relevance, <strong>RiskINTEGRA Internal Audit Management™</strong> enforces role-separated UI views across 7 distinct user tiers. When an executive or staff member logs in (or switches roles via the live Topbar switcher), the sidebar navigation, dashboard KPIs, and module actions automatically reconfigure to their exact authority level:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div style={{ borderLeft: '4px solid #C81E1E', background: 'rgba(200, 30, 30, 0.08)', padding: '1.25rem', borderRadius: '0 0.75rem 0.75rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'white' }}>1. Chief Audit Executive (CAE)</span>
                    <span style={{ background: '#C81E1E', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>🛡️ TIER 1 — EXECUTIVE AUTHORITY</span>
                  </div>
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#E2E8F0', lineHeight: 1.6 }}>
                    <strong>Corresponding View & Navigation:</strong> Unrestricted visibility across all 14 audit modules and Master Data administration.<br />
                    <strong>Key Capabilities:</strong> Final approval of the Annual Audit Plan, sign-off on completed Working Papers, generation of official Board Audit & Risk Committee (BARC) decks, master universe rating overrides, and full bi-directional synchronization with the ERM suite.
                  </p>
                </div>

                <div style={{ borderLeft: '4px solid #3B82F6', background: 'rgba(59, 130, 246, 0.08)', padding: '1.25rem', borderRadius: '0 0.75rem 0.75rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'white' }}>2. Audit Manager</span>
                    <span style={{ background: '#2563EB', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>🎯 TIER 2 — MANAGEMENT OVERSIGHT</span>
                  </div>
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#E2E8F0', lineHeight: 1.6 }}>
                    <strong>Corresponding View & Navigation:</strong> Full visibility across planning, execution, remediation, and reporting modules (excluding Master Data structural changes).<br />
                    <strong>Key Capabilities:</strong> Engagement resource allocation, audit team assignment, review and quality scoring of field working papers, adjudication of draft audit findings, and tracking of Corrective Action Plans (CAPs).
                  </p>
                </div>

                <div style={{ borderLeft: '4px solid #10B981', background: 'rgba(16, 185, 129, 0.08)', padding: '1.25rem', borderRadius: '0 0.75rem 0.75rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'white' }}>3. Senior Auditor (Field Lead)</span>
                    <span style={{ background: '#059669', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>📋 TIER 3 — FIELDWORK EXECUTION</span>
                  </div>
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#E2E8F0', lineHeight: 1.6 }}>
                    <strong>Corresponding View & Navigation:</strong> Focused on Fieldwork Execution (`Engagements`, `Audit Programs`, `Working Papers & Evidence`), `Findings & 10×10 Matrix`, `Internal Controls`, and `Fraud Continuous Auditing`.<br />
                    <strong>Key Capabilities:</strong> Executing audit program test steps (`Tested - Pass / Exception`), attaching cryptographic evidence binders, raising initial finding observations, and logging sampling results.
                  </p>
                </div>

                <div style={{ borderLeft: '4px solid #F59E0B', background: 'rgba(245, 158, 11, 0.08)', padding: '1.25rem', borderRadius: '0 0.75rem 0.75rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'white' }}>4. Quality Assurance Reviewer (QA)</span>
                    <span style={{ background: '#D97706', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>🔍 TIER 4 — METHODOLOGY & QA</span>
                  </div>
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#E2E8F0', lineHeight: 1.6 }}>
                    <strong>Corresponding View & Navigation:</strong> Isolates `Working Papers & Evidence`, `Audit Engagements`, `Internal Controls Assessment`, and `Findings & 10×10 Matrix`. Hides planning setup engines.<br />
                    <strong>Key Capabilities:</strong> Independent validation of evidence chains, compliance checks against IIA / PENCOM audit methodology standards, and peer review sign-offs before CAE presentation.
                  </p>
                </div>

                <div style={{ borderLeft: '4px solid #A855F7', background: 'rgba(168, 85, 247, 0.08)', padding: '1.25rem', borderRadius: '0 0.75rem 0.75rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'white' }}>5. Process Owner (Auditee Department Head)</span>
                    <span style={{ background: '#9333EA', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>🏢 TIER 5 — REMEDIATION & RESPONSE</span>
                  </div>
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#E2E8F0', lineHeight: 1.6 }}>
                    <strong>Corresponding View & Navigation:</strong> Highly tailored auditee view isolating only `Action Tracker (CAPs)`, `Findings & 10×10 Matrix`, `Internal Controls Assessment`, and the `User Guide`. Hides internal audit fieldwork, audit programs, and working papers.<br />
                    <strong>Key Capabilities:</strong> Reviewing audit findings assigned to their department (`Settlements`, `Custody Operations`, `PFC Accounting`), submitting management responses, uploading CAP closure proofs, and completing control self-assessments.
                  </p>
                </div>

                <div style={{ borderLeft: '4px solid #0EA5E9', background: 'rgba(14, 165, 233, 0.08)', padding: '1.25rem', borderRadius: '0 0.75rem 0.75rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'white' }}>6. Risk & Compliance Manager (ERM)</span>
                    <span style={{ background: '#0284C7', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>🌐 TIER 6 — ECOSYSTEM LINKAGE</span>
                  </div>
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#E2E8F0', lineHeight: 1.6 }}>
                    <strong>Corresponding View & Navigation:</strong> Streamlined to `Risk-Based Planning Engine`, `ERM Sync Bridge™`, `Compliance & Regulatory`, `Fraud Continuous Auditing`, and `Findings`. Hides tactical working paper creation.<br />
                    <strong>Key Capabilities:</strong> Pushing live KRI threshold breaches and loss ledgers into the Audit suite, aligning residual risk scores, and monitoring PENCOM statutory capital compliance.
                  </p>
                </div>

                <div style={{ borderLeft: '4px solid #F43F5E', background: 'rgba(244, 63, 94, 0.08)', padding: '1.25rem', borderRadius: '0 0.75rem 0.75rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'white' }}>7. Board Audit Committee Member (BARC)</span>
                    <span style={{ background: '#E11D48', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>🏛️ TIER 7 — BOARD OVERSIGHT (READ-ONLY)</span>
                  </div>
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#E2E8F0', lineHeight: 1.6 }}>
                    <strong>Corresponding View & Navigation:</strong> Dedicated Executive Read-Only Portal presenting `Executive Dashboard`, `Annual Audit Planning`, `Findings & 10×10 Matrix`, `Reports & Committee Portal`, and `ERM Sync Bridge™`. Operational testing steps and draft workpapers are hidden.<br />
                    <strong>Key Capabilities:</strong> High-level oversight of institutional risk exposure, review of quarterly BARC executive summary decks, evaluation of repeat finding patterns across audit cycles, and formal governance sign-off.
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredModules.map((mod, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '0.85rem',
                    padding: '1.25rem',
                    transition: 'border-color 0.2s'
                  }}>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'white', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={18} color="#fda4af" />
                      <span>{mod.name}</span>
                    </div>
                    <p style={{ margin: '0 0 0.85rem 0', fontSize: '0.88rem', color: '#CBD5E1', lineHeight: 1.6 }}>
                      {mod.desc}
                    </p>
                    {mod.tools && mod.tools.length > 0 && (
                      <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.6rem', padding: '0.75rem 0.9rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fda4af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Wrench size={13} />
                          <span>Interactive Tools & Capabilities Available:</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                          {mod.tools.map((t, tidx) => (
                            <span key={tidx} style={{ background: 'rgba(200, 30, 30, 0.15)', border: '1px solid rgba(200, 30, 30, 0.35)', color: '#FECACA', fontSize: '0.78rem', padding: '0.25rem 0.65rem', borderRadius: '4px', fontWeight: 600 }}>
                              ✓ {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3.5: INTERACTIVE TOOLS & CAPABILITIES GUIDE */}
          {activeTab === 'tools_guide' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fda4af', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', marginTop: 0 }}>
                🛠️ Interactive Tools & Analytical Engines Guide
              </h2>
              <p style={{ lineHeight: 1.7, fontSize: '0.94rem', color: '#CBD5E1' }}>
                RiskINTEGRA Internal Audit™ provides active analytical engines and real-time utilities designed to automate audit fieldwork, risk prioritization, and executive decision-making. Here is a comprehensive guide to every tool available across the application:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem', marginTop: '1.5rem' }}>
                
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.85rem', padding: '1.3rem' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ background: '#C81E1E', color: 'white', padding: '0.3rem', borderRadius: '6px', display: 'inline-flex' }}><Wrench size={18} /></span>
                    <span>1. Quantitative Risk-Based Priority Matrix Engine (Module 4)</span>
                  </div>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6 }}>
                    An automated mathematical scoring tool that dynamically calculates and ranks auditable units from highest risk (`CRITICAL`) to lowest risk (`LOW`) without subjective guesswork.
                  </p>
                  <div style={{ background: '#090D16', border: '1px solid #1E293B', padding: '0.85rem', borderRadius: '0.6rem', fontSize: '0.82rem', color: '#E2E8F0', fontFamily: 'monospace' }}>
                    Algorithm: Priority Score = (Impact × Likelihood) × (1 + (5 - Control Score)/5)
                  </div>
                  <div style={{ marginTop: '0.75rem', fontSize: '0.84rem', color: '#CBD5E1' }}>
                    <strong>How to use:</strong> Adjust the interactive 1-5 sliders for Impact, Likelihood, and Control Deficit on any custodial department and click <strong>Calculate Priority</strong>. The system instantly recalculates priority rankings!
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.85rem', padding: '1.3rem' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ background: '#2563EB', color: 'white', padding: '0.3rem', borderRadius: '6px', display: 'inline-flex' }}><Wrench size={18} /></span>
                    <span>2. Multi-Currency Valuation & Live CBN Ticker Tool (Topbar)</span>
                  </div>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6 }}>
                    A real-time currency conversion tool integrated directly into the utility Topbar for executive reporting to international parent companies and regulatory bodies.
                  </p>
                  <div style={{ fontSize: '0.84rem', color: '#CBD5E1' }}>
                    <strong>How to use:</strong> Click the <strong>`💱 NGN`</strong> button at any time. Every financial chart, Total Assets Under Custody figure (`₦18.45T`), and PFC capital requirement instantly converts into <strong>USD ($)</strong>, <strong>EUR (€)</strong>, or <strong>GBP (£)</strong> using the live CBN exchange rates displayed on the ticker!
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.85rem', padding: '1.3rem' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ background: '#059669', color: 'white', padding: '0.3rem', borderRadius: '6px', display: 'inline-flex' }}><Wrench size={18} /></span>
                    <span>3. Findings & 10×10 Risk Matrix Adjudicator (Module 8)</span>
                  </div>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6 }}>
                    An interactive finding management tool that classifies internal control failures across a 10×10 severity matrix and assigns corrective ownership.
                  </p>
                  <div style={{ fontSize: '0.84rem', color: '#CBD5E1' }}>
                    <strong>How to use:</strong> Click any finding card to open the Root Cause Analyzer (`Systemic Control Failure`, `Manual Oversight`, `IT Cyber Gap`). Use the interactive buttons to change severity between <em>Critical</em>, <em>High</em>, <em>Medium</em>, and <em>Low</em>, and set the Agreed Implementation Date.
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.85rem', padding: '1.3rem' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ background: '#D97706', color: 'white', padding: '0.3rem', borderRadius: '6px', display: 'inline-flex' }}><Wrench size={18} /></span>
                    <span>4. Post-Audit Corrective Action Tracker (CAP Engine - Module 9)</span>
                  </div>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6 }}>
                    A post-audit monitoring tool that prevents forgotten audit findings by tracking management remediation commitments and verifying closure.
                  </p>
                  <div style={{ fontSize: '0.84rem', color: '#CBD5E1' }}>
                    <strong>How to use:</strong> Filter CAPs by status (`Open`, `In Progress`, `Overdue`, `Verified Closed`). Click <strong>Request Update</strong> to send an alert to the responsible departmental head, or click <strong>Verify Closure</strong> once field auditors have re-tested the control!
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.85rem', padding: '1.3rem' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ background: '#7C3AED', color: 'white', padding: '0.3rem', borderRadius: '6px', display: 'inline-flex' }}><Wrench size={18} /></span>
                    <span>5. Cryptographic Working Papers Vault & Sign-Off Tool (Module 7)</span>
                  </div>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6 }}>
                    A digital evidence binder allowing field auditors to attach reconciliation proofs and initiate multi-tier electronic approvals.
                  </p>
                  <div style={{ fontSize: '0.84rem', color: '#CBD5E1' }}>
                    <strong>How to use:</strong> Click <strong>Attach Evidence</strong> on any working paper to upload bank reconciliation snapshots (e.g. `RSA Fund IV SWIFT Reconciliation`). Once documented, initiate the 3-Tier Electronic Sign-Off (`Auditor ➔ Team Lead ➔ Chief Audit Executive`).
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.85rem', padding: '1.3rem' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ background: '#DB2777', color: 'white', padding: '0.3rem', borderRadius: '6px', display: 'inline-flex' }}><Wrench size={18} /></span>
                    <span>6. One-Click BARC Executive Deck Generator (Module 13)</span>
                  </div>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6 }}>
                    An automated presentation tool that eliminates hours of manual PowerPoint preparation before Board Audit & Risk Committee meetings.
                  </p>
                  <div style={{ fontSize: '0.84rem', color: '#CBD5E1' }}>
                    <strong>How to use:</strong> Select your reporting quarter (`Q1`, `Q2`, `Q3`, or `Q4`) and click <strong>Generate BARC Presentation Deck</strong>. The tool compiles audit completion percentages, exception heatmaps, and Section 63 statutory sign-offs into a presentation-ready executive deck!
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.85rem', padding: '1.3rem' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ background: '#475569', color: 'white', padding: '0.3rem', borderRadius: '6px', display: 'inline-flex' }}><Wrench size={18} /></span>
                    <span>7. Automated Continuous Auditing & Fraud Sentinel (Module 12)</span>
                  </div>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6 }}>
                    A 24/7 automated monitoring engine running real-time custodial rule checks to detect operational anomalies or fraudulent instructions.
                  </p>
                  <div style={{ fontSize: '0.84rem', color: '#CBD5E1' }}>
                    <strong>Active Rules Monitored:</strong><br />
                    • <strong>Rule CA-01:</strong> Flags after-hours settlement spikes above ₦5 Billion.<br />
                    • <strong>Rule CA-02:</strong> Flags duplicate SWIFT payment reference numbers within 48 hours.<br />
                    • <strong>Rule CA-03:</strong> Flags contribution reconciliation variances exceeding 0.05% tolerance.
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.85rem', padding: '1.3rem' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ background: '#10B981', color: 'white', padding: '0.3rem', borderRadius: '6px', display: 'inline-flex' }}><Wrench size={18} /></span>
                    <span>8. Enterprise Templates & Bulk CSV Ingestion Hub (ErmSyncPage - Module 14)</span>
                  </div>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6 }}>
                    A comprehensive data onboarding engine that eliminates tedious manual data entry by enabling one-click download of institutional CSV/Excel templates and batch ingestion of hundreds of audit items.
                  </p>
                  <div style={{ fontSize: '0.84rem', color: '#CBD5E1' }}>
                    <strong>Available Templates:</strong><br />
                    • <strong>Audit Findings Matrix Template (`.csv`):</strong> Formatted 10×10 observations with criteria, likelihood, impact, and root cause fields.<br />
                    • <strong>Auditable Universe Template (`.csv`):</strong> Master Data structure mapping process names, business units, frequency, and risk scores.<br />
                    • <strong>Annual Audit Plans Template (`.csv`):</strong> Engagement schedules with budgeted hours, timelines, and team lead assignments.<br />
                    <strong>How to use:</strong> Click <strong>`📦 Templates & Bulk CSV Upload`</strong> from the top bar of Master Data, Findings, or Audit Plan pages. Download your template, populate your spreadsheet, and paste/drag into the Batch Ingestion Engine to instantly load records into application state!
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.85rem', padding: '1.3rem' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ background: '#E11D48', color: 'white', padding: '0.3rem', borderRadius: '6px', display: 'inline-flex' }}><Wrench size={18} /></span>
                    <span>9. Purge Mock Data & Live ERM Sync Bridge (Module 14)</span>
                  </div>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6 }}>
                    Two dedicated operational lifecycle utilities that transition the app from demonstration mode (`Mock Data`) to live institutional execution (`Ready for User Inputs`).
                  </p>
                  <div style={{ fontSize: '0.84rem', color: '#CBD5E1' }}>
                    • <strong>🗑️ Purge Mock Data (Ready for User Input):</strong> Clears all hardcoded sample data across all 8 modules (findings, plans, universe, working papers, etc.) and initializes clean, empty structures stored directly in `localStorage` (`ZPC_AUDIT_STATE_*`).<br />
                    • <strong>🔗 Sync Data Directly From ERM:</strong> Connects bi-directionally to the <em>RiskINTEGRA ERM Suite</em> across ports or sockets (`ZPC_ERM_RISK_REGISTER`), automatically populating the Audit Universe and creating high-priority audit findings for any enterprise risk scoring ≥60!
                  </div>
                </div>

                <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: '0.85rem', padding: '1.3rem' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#60A5FA', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span>💡 Navigation Clarity & Interactive Tooltip Badging System</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#E2E8F0', lineHeight: 1.6 }}>
                    Every navigation tab and action button across all 14 modules features intuitive <strong>Count Badges (`badge-chip`)</strong> and comprehensive <strong>Hover Tooltips (`title="..."`)</strong>. Instead of confusing cramped text like `(3 Steps)` or trailing numbers `(2)`, each button displays its full phase or module title alongside a clean, structured item counter badge (`3 Test Procedures`, `8 Units`). Hovering over any button reveals a detailed tooltip explaining the exact underlying operational function!
                  </p>
                </div>

              </div>
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

          {/* TAB 6: SWITCHING BETWEEN APPS */}
          {activeTab === 'switcher_guide' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fda4af', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', marginTop: 0 }}>
                🔀 How to Switch Between RiskINTEGRA Applications
              </h2>
              <p style={{ lineHeight: 1.7, fontSize: '0.94rem', color: '#CBD5E1' }}>
                Zenith Pension Custodian (ZPC) operates two twin institutional governance platforms: the <strong>RiskINTEGRA ERM Suite</strong> and the <strong>RiskINTEGRA Internal Audit Suite</strong>. You can switch between both applications anytime without re-entering your login credentials.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.85rem', padding: '1.25rem' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#60A5FA', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#2563EB', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>1</span>
                    <span>Locate the Ecosystem App Switcher</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6 }}>
                    In the top-right utility bar of your screen (right next to the <strong>💱 Currency Selector</strong> and live CBN ticker), click the <strong>`Apps ⠿`</strong> grid icon. This opens the RiskINTEGRA ecosystem drop-down menu.
                  </p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.85rem', padding: '1.25rem' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#34D399', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#059669', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>2</span>
                    <span>Click 'Launch ERM with active role ➔'</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6 }}>
                    Select the partner application. The switcher automatically grabs your active executive profile (`cae`, `senior`, `lead`, or `auditor`), generates a secure single sign-on token (`sso_token=riskintegra_auth_bridge`), and transitions you instantly to the exact same role on the partner application!
                  </p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.85rem', padding: '1.25rem' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FBBF24', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: '#D97706', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>3</span>
                    <span>Customizing Your Target Link (Optional)</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6 }}>
                    If your partner application is hosted on a shared web link or cloud address (such as `https://zpc-erm.zenithcustodian.com`), click the small <strong>`⚙️ Set Link`</strong> button at the top-right inside the `Apps ⠿` menu, paste the URL once into the box, and click <strong>Link ✓</strong>. The app remembers this address across your sessions.
                  </p>
                </div>
              </div>
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
