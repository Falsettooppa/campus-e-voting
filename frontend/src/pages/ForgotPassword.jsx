import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(''); setOk(false); setResetToken('');
    try {
      setLoading(true);
      const res = await forgotPassword(email);
      setOk(true);
      setMsg(res.data?.message || 'Reset token generated.');
      if (res.data?.resetToken) setResetToken(res.data.resetToken);
    } catch (err) {
      setOk(false);
      setMsg(err.response?.data?.message || 'Failed to generate reset token.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resetToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
            <svg className="h-6 w-6 fill-white" viewBox="0 0 24 24">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Forgot password?</h1>
          <p className="mt-1 text-sm text-slate-500">Enter your email to generate a reset token</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">

          {/* Alert */}
          {msg && (
            <div className={`mb-5 flex items-start gap-2.5 rounded-lg border px-4 py-3 text-sm ${ok ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
              <svg className={`mt-0.5 h-4 w-4 shrink-0 ${ok ? 'fill-green-500' : 'fill-red-500'}`} viewBox="0 0 24 24">
                {ok
                  ? <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  : <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                }
              </svg>
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                  <svg className="h-4 w-4 fill-slate-400" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@student.edu"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin fill-white" viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 1 10 10h-2a8 8 0 0 0-8-8V2z"/></svg>
                  Generating…
                </>
              ) : 'Generate Reset Token'}
            </button>
          </form>

          {/* Demo token block */}
          {resetToken && (
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-white">
                <div className="flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 fill-amber-500" viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
                  <span className="text-xs font-semibold text-slate-700">Demo Token</span>
                </div>
                <button onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                  {copied ? (
                    <>
                      <svg className="h-3 w-3 fill-green-500" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg className="h-3 w-3 fill-slate-400" viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="px-4 py-3">
                <p className="break-all text-xs font-mono text-slate-600 leading-relaxed">{resetToken}</p>
              </div>
              <div className="px-4 pb-4">
                <Link to={`/reset-password/${resetToken}`}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black no-underline transition-colors">
                  Continue to Reset Password
                  <svg className="h-3.5 w-3.5 fill-white" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
                </Link>
                <p className="mt-2.5 text-center text-xs text-slate-400">
                  In production, this token would be sent by email
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-xs text-slate-400">Remembered it?</span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>

          <Link to="/login"
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-700 no-underline transition-colors">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
            Back to Login
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Protected by end-to-end encryption · Campus E-Voting
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;