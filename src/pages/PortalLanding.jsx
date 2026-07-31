import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Landmark, ArrowRight, Lock, Building2, CheckCircle2 } from 'lucide-react';

const PortalLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_50%_0%,#0f172a_0%,#090d16_100%)] text-slate-50 font-sans flex flex-col justify-between relative overflow-x-hidden overflow-y-auto">
      {/* Background Glow Overlay */}
      <div className="absolute -top-[150px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,rgba(16,185,129,0.08)_50%,transparent_70%)] pointer-events-none blur-[50px]" />

      {/* Header Bar */}
      <header className="px-12 py-6 flex items-center justify-between border-b border-white/10 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-[42px] h-[42px] rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center shadow-[0_4px_12px_rgba(16,185,129,0.3)]">
            <Building2 size={24} className="text-white" />
          </div>
          <div>
            <h2 className="m-0 text-[1.15rem] font-extrabold tracking-tight">
              ZENITH PENSION CUSTODIAN
            </h2>
            <p className="m-0 text-xs text-slate-400 font-medium">
              RiskINTEGRA™ Institutional Governance Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-400">
          <ShieldCheck size={16} className="text-emerald-500" />
          <span>PENCOM Regulated · PRA 2014 Compliant</span>
        </div>
      </header>

      {/* Main Hero & Department Cards */}
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-8 py-16 flex flex-col items-center justify-center z-10">
        <div className="text-center max-w-[720px] mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-sm font-semibold mb-5">
            <Lock size={14} />
            <span>Select Authorized Operational Portal</span>
          </div>

          <h1 className="text-4xl md:text-[2.5rem] font-extrabold leading-tight mb-4 tracking-tight bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent">
            Institutional Governance & Assurance System
          </h1>

          <p className="text-base text-slate-400 m-0 leading-relaxed">
            Access your department’s dedicated risk intelligence or audit management portal.
          </p>
        </div>

        {/* Two Department Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[900px]">
          {/* Card 1: Risk Management (ERM) */}
          <div 
            onClick={() => { window.location.href = 'https://zpc.riskintegra-erm.nayandjoerisktechconsulting.com/'; }}
            className="group bg-gradient-to-br from-slate-800/70 to-slate-900/80 border border-blue-500/25 rounded-[20px] p-10 cursor-pointer transition-all duration-300 ease-out flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.3)] relative overflow-hidden hover:-translate-y-1.5 hover:border-blue-500/60 hover:shadow-[0_20px_40px_rgba(59,130,246,0.25)]"
          >
            <div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 flex items-center justify-center mb-6 text-blue-400">
                <ShieldCheck size={30} />
              </div>

              <h3 className="text-2xl font-extrabold mb-2 text-white">
                Risk Management
              </h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Enterprise Risk Management (ERM), Loss Ledgers, Key Risk Indicators (KRIs), BowTie Analysis, and Capital Allocation.
              </p>

              <div className="flex flex-col gap-2 mb-8">
                {['KRI Monitoring & Alert Engine', 'Loss Ledger & Event Tracking', 'Capital Allocation & Stress Testing'].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 size={14} className="text-blue-500" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10 text-blue-400 font-bold text-sm">
              <span>Launch ERM Portal</span>
              <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Internal Audit */}
          <div 
            onClick={() => { navigate('/login?dept=audit'); }}
            className="group bg-gradient-to-br from-slate-800/70 to-slate-900/80 border border-emerald-500/25 rounded-[20px] p-10 cursor-pointer transition-all duration-300 ease-out flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.3)] relative overflow-hidden hover:-translate-y-1.5 hover:border-emerald-500/60 hover:shadow-[0_20px_40px_rgba(16,185,129,0.25)]"
          >
            <div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 flex items-center justify-center mb-6 text-emerald-400">
                <Landmark size={30} />
              </div>

              <h3 className="text-2xl font-extrabold mb-2 text-white">
                Internal Audit
              </h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                Risk-Based Annual Audit Plan, Audit Universe, 10×10 Escalation Matrix, Working Papers, and PENCOM Compliance.
              </p>

              <div className="flex flex-col gap-2 mb-8">
                {['Risk-Weighted Annual Audit Plan', '10×10 Escalation Matrix & Findings', 'WORM-Compliant Audit Trail'].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10 text-emerald-400 font-bold text-sm">
              <span>Launch Audit Portal</span>
              <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-12 py-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-500 z-10">
        <div>© 2026 Zenith Pension Custodian (ZPC) Limited. All Rights Reserved.</div>
        <div>RiskINTEGRA Enterprise Platform · Powered by Nay&JoeRiskAndTechConsulting</div>
      </footer>
    </div>
  );
};

export default PortalLanding;
