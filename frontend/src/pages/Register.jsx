import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { register } from '../services/authService';

const strengthMeta = [
  { label: '', color: '', bar: 'bg-slate-200' },
  { label: 'Weak',   color: 'text-red-500',    bar: 'bg-red-400' },
  { label: 'Fair',   color: 'text-orange-500',  bar: 'bg-orange-400' },
  { label: 'Good',   color: 'text-yellow-600',  bar: 'bg-yellow-400' },
  { label: 'Strong', color: 'text-green-600',   bar: 'bg-green-500' },
];

function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [ok, setOk] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (name === 'password') {
      let s = 0;
      if (value.length >= 8) s++;
      if (/[A-Z]/.test(value)) s++;
      if (/[0-9]/.test(value)) s++;
      if (/[^A-Za-z0-9]/.test(value)) s++;
      setStrength(s);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMessage(''); setOk(false);
    try {
      await register(form);
      setOk(true);
      setMessage('Registration successful. You can now login.');
      setForm({ fullName: '', email: '', password: '' });
      setStrength(0);
    } catch (err) {
      setOk(false);
      setMessage(err.response?.data?.message || 'Registration failed');
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
              <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create your account</h1>
          <p className="mt-1 text-sm text-slate-500">Join and participate in campus elections</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">

          {message && (
            <div className={`mb-5 flex items-start gap-2.5 rounded-lg border px-4 py-3 text-sm ${ok ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
              <svg className={`mt-0.5 h-4 w-4 shrink-0 ${ok ? 'fill-green-500' : 'fill-red-500'}`} viewBox="0 0 24 24">
                {ok
                  ? <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  : <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                }
              </svg>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full name</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                  <svg className="h-4 w-4 fill-slate-400" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                </span>
                <input
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  name="fullName" type="text" placeholder="e.g. Gabriel Adesoye"
                  value={form.fullName} onChange={handleChange} required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                  <svg className="h-4 w-4 fill-slate-400" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                </span>
                <input
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  name="email" type="email" placeholder="you@student.edu"
                  value={form.email} onChange={handleChange} required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                  <svg className="h-4 w-4 fill-slate-400" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                </span>
                <input
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  name="password" type={showPassword ? 'text' : 'password'}
                  placeholder="min. 8 characters" value={form.password} onChange={handleChange} required
                />
                <button type="button" tabIndex={-1} onClick={() => setShowPassword(v => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors">
                  {showPassword
                    ? <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                    : <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27z"/></svg>
                  }
                </button>
              </div>

              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthMeta[strength].bar : 'bg-slate-200'}`} />
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

            <button type="submit" disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin fill-white" viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 1 10 10h-2a8 8 0 0 0-8-8V2z"/></svg>
                  Creating account…
                </>
              ) : 'Create account'}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-xs text-slate-400">Already registered?</span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>

          <Link to="/login"
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-700 no-underline transition-colors">
            Sign in to your account
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Protected by end-to-end encryption · Campus E-Voting
        </p>
      </div>
    </div>
  );
}

export default Register;