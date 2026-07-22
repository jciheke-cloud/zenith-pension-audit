import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Landmark, ArrowRight, Lock, Building2, CheckCircle2 } from 'lucide-react';

const PortalLanding = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 0%, #0f172a 0%, #090d16 100%)',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Glow Overlay */}
      <div style={{
        position: 'absolute',
        top: '-150px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '800px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.08) 50%, transparent 70%)',
        pointerEvents: 'none',
        filter: 'blur(50px)'
      }} />

      {/* Header Bar */}
      <header style={{
        padding: '1.5rem 3rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}>
            <Building2 size={24} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              ZENITH PENSION CUSTODIAN
            </h2>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
              RiskINTEGRA™ Institutional Audit & Assurance Portal
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
          <ShieldCheck size={16} color="#10b981" />
          <span>PENCOM Regulated · PRA 2014 Section 63 Compliant</span>
        </div>
      </header>

      {/* Main Hero & Department Cards */}
      <main style={{
        flex: 1,
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '4rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', marginBottom: '3.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            color: '#6ee7b7',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '1.25rem'
          }}>
            <Lock size={14} />
            <span>Select Authorized Operational Portal</span>
          </div>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            lineHeight: 1.2,
            margin: '0 0 1rem 0',
            letterSpacing: '-0.03em',
            background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Institutional Assurance & Internal Audit Portal
          </h1>

          <p style={{ fontSize: '1rem', color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
            Select your department portal below.
          </p>
        </div>

        {/* Two Department Selection Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2rem',
          width: '100%',
          maxWidth: '900px'
        }}>
          {/* Card 1: Risk Management (ERM) */}
          <div 
            onClick={() => {
              window.location.href = 'https://zpc.riskintegra-erm.nayandjoerisktechconsulting.com/login?dept=erm';
            }}
            style={{
              background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.8))',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              borderRadius: '20px',
              padding: '2.5rem 2rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.6)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(59, 130, 246, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.25)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
            }}
          >
            <div>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.1))',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                color: '#60a5fa'
              }}>
                <ShieldCheck size={30} />
              </div>

              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#ffffff' }}>
                Risk Management
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 1.5rem 0', lineHeight: 1.5 }}>
                Enterprise Risk Management (ERM), Loss Ledgers, Key Risk Indicators (KRIs), BowTie Analysis, and Capital Allocation.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
                {['KRI Monitoring & Alert Engine', 'Loss Ledger & Event Tracking', 'Capital Allocation & Stress Testing'].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
                    <CheckCircle2 size={14} color="#3b82f6" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#60a5fa',
              fontWeight: 700,
              fontSize: '0.9rem'
            }}>
              <span>Launch ERM Portal</span>
              <ArrowRight size={18} />
            </div>
          </div>

          {/* Card 2: Internal Audit */}
          <div 
            onClick={() => navigate('/login?dept=audit')}
            style={{
              background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.8))',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '20px',
              padding: '2.5rem 2rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.6)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(16, 185, 129, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.25)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
            }}
          >
            <div>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.1))',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                color: '#34d399'
              }}>
                <Landmark size={30} />
              </div>

              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#ffffff' }}>
                Internal Audit
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 1.5rem 0', lineHeight: 1.5 }}>
                Risk-Based Annual Audit Plan, Audit Universe, 10×10 Escalation Matrix, Working Papers, and PENCOM Compliance.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
                {['Risk-Weighted Annual Audit Plan', '10×10 Escalation Matrix & Findings', 'WORM-Compliant Audit Trail'].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
                    <CheckCircle2 size={14} color="#10b981" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#34d399',
              fontWeight: 700,
              fontSize: '0.9rem'
            }}>
              <span>Launch Audit Portal</span>
              <ArrowRight size={18} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '1.5rem 3rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        color: '#64748b',
        zIndex: 10
      }}>
        <div>© 2026 Zenith Pension Custodian (ZPC) Limited. All Rights Reserved.</div>
        <div>RiskINTEGRA Enterprise Platform · Powered by Nay & Joe Risk Tech Consulting</div>
      </footer>
    </div>
  );
};

export default PortalLanding;
