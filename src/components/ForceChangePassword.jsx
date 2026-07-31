import React, { useState, useContext } from 'react';
import { AuditContext } from '../context/AuditContext';

export const ForceChangePassword = ({ email, onComplete }) => {
  const { completeNewPassword } = useContext(AuditContext);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    setError('');
    
    const res = await completeNewPassword(newPassword);
    if (res?.success) {
      onComplete(res.user);
    } else {
      setError(res?.error || "Failed to set new password. Please verify requirements.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-950 flex items-center justify-center p-6 font-sans">
      <div className="bg-slate-800/70 backdrop-blur-md border border-white/10 p-10 rounded-2xl w-full max-w-[440px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
        <div className="text-center mb-8">
          <div className="text-[2.5rem] mb-2">🔐</div>
          <h2 className="text-white text-2xl font-extrabold m-0">
            Mandatory Password Change
          </h2>
          <p className="text-slate-400 text-[0.88rem] mt-2">
            AWS Cognito requires you to update the temporary password for <strong>{email}</strong> before proceeding.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/15 border border-red-500/30 text-red-400 p-3 rounded-lg text-[0.82rem] mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-slate-300 text-[0.82rem] font-semibold mb-1.5">
              New Permanent Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters..."
                className="w-full pl-3 pr-10 py-3 rounded-lg bg-slate-900/60 border border-white/15 text-white text-[0.9rem] box-border outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-white/40 cursor-pointer hover:text-white/70"
              >
                {showPassword ? '👁' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-[0.82rem] font-semibold mb-1.5">
              Confirm Permanent Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password..."
              className="w-full px-3 py-3 rounded-lg bg-slate-900/60 border border-white/15 text-white text-[0.9rem] box-border outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 p-[0.85rem] rounded-lg border-none text-white font-bold text-[0.95rem] shadow-[0_4px_12px_rgba(16,185,129,0.3)] transition-opacity ${
              loading 
                ? 'bg-slate-600 cursor-not-allowed opacity-70' 
                : 'bg-gradient-to-br from-emerald-500 to-emerald-600 cursor-pointer hover:opacity-90'
            }`}
          >
            {loading ? 'Securing Session & Upgrading Claims...' : 'Save & Enter Portal ➔'}
          </button>
        </form>
      </div>
    </div>
  );
};
