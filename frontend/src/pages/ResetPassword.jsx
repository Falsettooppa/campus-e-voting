import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../services/authService';

const strengthMeta = [
  { label: '', color: '', bar: 'bg-slate-200' },
  { label: 'Weak',   color: 'text-red-500',   bar: 'bg-red-400' },
  { label: 'Fair',   color: 'text-orange-500', bar: 'bg-orange-400' },
  { label: 'Good',   color: 'text-yellow-600', bar: 'bg-yellow-400' },
  { label: 'Strong', color: 'text-green-600',  bar: 'bg-green-500' },
];

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState(false);
  const [strength, setStrength] = useState(0);

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    let s = 0;
    if (val.length >= 8) s++;
    if (/[A-Z]/.test(val)) s++;
    if (/[0-9]/.test(val)) s++;
    if (/[^A-Za-z0-9]/.test(val)) s++;
    setStrength(s);
  };

  const passwordsMatch = confirm.length > 0 && password === confirm;
  const passwordsMismatch = confirm.length > 0 && password !== confirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(''); setOk(false);

    if (password.length < 6) { setMsg('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setMsg('Passwords do not match.'); return; }

    try {
      setLoading(true);
      const res = await resetPassword(token, password);
      setOk(true);
      setMsg(res.data?.message || 'Password reset successful.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setOk(false);
      setMsg(err.response?.data?.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
            <svg className="h-6 w-6 fill-white" viewBox="0 0 24 24">
              <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Set new password</h1>
          <p className="mt-1 text-sm text-slate-500">Create a strong password for your account</p>
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
              {ok && <span className="ml-1 text-green-600">Redirecting to login…</span>}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* New password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                  <svg className="h-4 w-4 fill-slate-400" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="min. 6 characters"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  required
                />
                <button type="button" tabIndex={-1} onClick={() => setShowPassword(v => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors">
                  {showPassword
                    ? <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                    : <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27z"/></svg>
                  }
                </button>
              </div>

              {/* Strength meter */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthMeta[strength].bar : 'bg-slate-200'}`}/>
                    ))}
                  </div>
                  {strength > 0 && (
                    <p className={`mt-1 text-xs font-medium ${strengthMeta[strength].color}`}>
                      {strengthMeta[strength].label} password
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                  <svg className={`h-4 w-4 ${passwordsMatch ? 'fill-green-500' : passwordsMismatch ? 'fill-red-400' : 'fill-slate-400'}`} viewBox="0 0 24 24">
                    {passwordsMatch
                      ? <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      : <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                    }
                  </svg>
                </span>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Re-enter your password"
                  className={`w-full rounded-lg border bg-slate-50 py-2.5 pl-9 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:bg-white focus:ring-2 ${
                    passwordsMatch ? 'border-green-400 focus:border-green-500 focus:ring-green-500/20'
                    : passwordsMismatch ? 'border-red-300 focus:border-red-400 focus:ring-red-400/20'
                    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                  required
                />
                <button type="button" tabIndex={-1} onClick={() => setShowConfirm(v => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors">
                  {showConfirm
                    ? <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                    : <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27z"/></svg>
                  }
                </button>
              </div>
              {passwordsMismatch && (
                <p className="mt-1 text-xs font-medium text-red-500">Passwords do not match</p>
              )}
              {passwordsMatch && (
                <p className="mt-1 text-xs font-medium text-green-600">Passwords match</p>
              )}
            </div>

            <button type="submit" disabled={loading || passwordsMismatch}
              className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2">
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin fill-white" viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 1 10 10h-2a8 8 0 0 0-8-8V2z"/></svg>
                  Resetting…
                </>
              ) : 'Reset Password'}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-xs text-slate-400">Other options</span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>

          <div className="mt-4 flex gap-2">
            <Link to="/forgot-password"
              className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-blue-700 no-underline transition-colors">
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24"><path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
              New token
            </Link>
            <Link to="/login"
              className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-blue-700 no-underline transition-colors">
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
              Back to Login
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Protected by end-to-end encryption · Campus E-Voting
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;