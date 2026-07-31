import React, { useState, useContext, useEffect } from 'react';
import { AuditContext } from '../context/AuditContext';
import { ForceChangePassword } from './ForceChangePassword';

const LoginScreen = () => {
  const { login, clientProfile, addToast, triggerPasswordReset, completePasswordReset } = useContext(AuditContext);
  
  // Login Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [challengeEmail, setChallengeEmail] = useState(null);

  // Forgot Password Wizard States
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1 = request code, 2 = submit code & new pass
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newResetPassword, setNewResetPassword] = useState('');
  const [confirmNewResetPassword, setConfirmNewResetPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem('zpc_inactivity_logged_out') === 'true') {
      if (addToast) {
        addToast('⚠️ Session timed out due to 30 minutes of inactivity.', 'warning');
      }
      sessionStorage.removeItem('zpc_inactivity_logged_out');
    }
  }, [addToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    if (result.challenge === 'NEW_PASSWORD_REQUIRED') {
      setChallengeEmail(email);
      setIsLoading(false);
      return;
    }
    if (!result.success) {
      setError(result.error);
    }
    setIsLoading(false);
  };

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setResetError('');
    setIsLoading(true);
    const res = await triggerPasswordReset(resetEmail);
    if (res.success) {
      setResetStep(2);
      setResetSuccess(`Verification code sent successfully to ${resetEmail}.`);
    } else {
      setResetError(res.error);
    }
    setIsLoading(false);
  };

  const handleConfirmReset = async (e) => {
    e.preventDefault();
    setResetError('');
    if (newResetPassword !== confirmNewResetPassword) {
      setResetError("Passwords do not match.");
      return;
    }
    if (newResetPassword.length < 8) {
      setResetError("New password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    const res = await completePasswordReset(resetEmail, resetCode, newResetPassword);
    if (res.success) {
      if (addToast) {
        addToast('🔐 Password updated successfully! You can now log in.', 'success');
      }
      setIsResetMode(false);
      setResetStep(1);
      setPassword('');
      setResetError('');
      setResetSuccess('');
    } else {
      setResetError(res.error);
    }
    setIsLoading(false);
  };

  if (challengeEmail) {
    return <ForceChangePassword email={challengeEmail} onComplete={() => setChallengeEmail(null)} />;
  }

  return (
    <div className="flex-1 min-h-[calc(100vh-40px)] flex items-center justify-center bg-[radial-gradient(circle_at_50%_0%,#3f0d16_0%,#0a0f1d_100%)] font-sans p-4">
      <div className="w-full max-w-[430px] p-10 border-t-4 border-brand-red shadow-[0_20px_40px_rgba(0,0,0,0.5)] text-center bg-slate-900/85 rounded-xl border border-white/10">
        <div className="mb-8">
          <h1 className="text-white text-[1.8rem] font-extrabold m-0 mb-2 tracking-tight">
            Risk<span className="text-brand-red">INTEGRA</span> Audit™
          </h1>
          <p className="text-slate-400 text-[0.85rem] m-0 font-semibold">
            {clientProfile || 'Zenith Pension Custodian Limited (ZPC)'}
          </p>
        </div>

        {/* FORGOT PASSWORD FLOW */}
        {isResetMode ? (
          <div>
            <h3 className="text-white text-[1.1rem] font-bold m-0 mb-4">
              🔑 Reset Account Password
            </h3>

            {resetError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-md mb-6 text-[0.82rem] text-left">
                {resetError}
              </div>
            )}
            {resetSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-md mb-6 text-[0.82rem] text-left">
                {resetSuccess}
              </div>
            )}

            {resetStep === 1 ? (
              <form onSubmit={handleRequestCode} className="flex flex-col gap-5 text-left">
                <div>
                  <label className="block text-slate-400 text-sm mb-1.5 font-medium">Corporate Email / username</label>
                  <input 
                    type="email" 
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    required
                    className="w-full px-4 py-3 bg-black/25 border border-white/10 rounded-md text-white text-[0.9rem] outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all box-border"
                  />
                </div>
                <button type="submit" disabled={isLoading} className="w-full p-[0.85rem] font-semibold bg-gradient-to-br from-brand-red to-brand-redHov text-white border-none rounded-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 hover:opacity-90 transition-opacity">
                  {isLoading ? 'Sending code...' : 'Request Verification Code'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleConfirmReset} className="flex flex-col gap-5 text-left">
                <div>
                  <label className="block text-slate-400 text-sm mb-1.5 font-medium">Verification Code</label>
                  <input 
                    type="text" 
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    required
                    className="w-full px-4 py-3 bg-black/25 border border-white/10 rounded-md text-white text-[0.9rem] outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all box-border"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-1.5 font-medium">New Password</label>
                  <div className="relative">
                    <input 
                      type={showResetPassword ? "text" : "password"} 
                      value={newResetPassword}
                      onChange={(e) => setNewResetPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      required
                      className="w-full pl-4 pr-10 py-3 bg-black/25 border border-white/10 rounded-md text-white text-[0.9rem] outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all box-border"
                    />
                    <button type="button" onClick={() => setShowResetPassword(!showResetPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-white/40 cursor-pointer hover:text-white/70">
                      {showResetPassword ? '👁' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-1.5 font-medium">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={confirmNewResetPassword}
                    onChange={(e) => setConfirmNewResetPassword(e.target.value)}
                    placeholder="Confirm password"
                    required
                    className="w-full px-4 py-3 bg-black/25 border border-white/10 rounded-md text-white text-[0.9rem] outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all box-border"
                  />
                </div>
                <button type="submit" disabled={isLoading} className="w-full p-[0.85rem] font-semibold bg-gradient-to-br from-brand-emerald to-emerald-600 text-white border-none rounded-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 hover:opacity-90 transition-opacity">
                  {isLoading ? 'Updating password...' : 'Complete Reset & Login'}
                </button>
              </form>
            )}

            <button type="button" onClick={() => { setIsResetMode(false); setResetError(''); setResetSuccess(''); }} className="bg-transparent border-none text-blue-400 text-sm cursor-pointer mt-5 hover:underline decoration-blue-400/50">
              Back to Secure Login
            </button>
          </div>
        ) : (
          /* STANDARD LOGIN FLOW */
          <div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/35 text-red-400 p-3 rounded-md mb-6 text-sm text-left">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col gap-5 text-left">
              <div>
                <label className="block text-slate-400 text-sm mb-1.5 font-medium">Corporate Email / RBAC Role</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter corporate email"
                  required
                  autoComplete="off"
                  className="w-full px-4 py-3 bg-black/25 border border-white/10 rounded-md text-white text-[0.9rem] outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all box-border"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-slate-400 text-sm font-medium">Password</label>
                  <button type="button" onClick={() => { setIsResetMode(true); setResetEmail(email); }} className="bg-transparent border-none text-blue-400 text-[0.78rem] cursor-pointer p-0 hover:underline decoration-blue-400/50">
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                    className="w-full pl-4 pr-10 py-3 bg-black/25 border border-white/10 rounded-md text-white text-[0.9rem] outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all box-border"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-white/40 cursor-pointer hover:text-white/70">
                    {showPassword ? '👁' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full p-[0.85rem] mt-2 text-[0.95rem] font-semibold bg-gradient-to-br from-brand-red to-brand-redHov text-white border-none rounded-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 hover:opacity-90 transition-opacity shadow-[0_4px_15px_rgba(200,30,30,0.4)]"
              >
                {isLoading ? 'Authenticating...' : 'Secure Login'}
              </button>
            </form>

            <div className="mt-5 text-center border-t border-white/10 pt-4">
              <a 
                href="https://zpc-portal.nayandjoerisktechconsulting.com/"
                className="inline-flex items-center gap-1.5 text-slate-400 text-[0.82rem] no-underline hover:text-slate-100 transition-colors"
              >
                ← Return to App Selector Portal
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;
