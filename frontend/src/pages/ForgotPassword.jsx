import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setOk(false);
    setResetToken('');

    try {
      setLoading(true);
      const res = await forgotPassword(email);
      setOk(true);
      setMsg(res.data?.message || 'Reset token generated.');

      // For demo/project: show token if returned
      if (res.data?.resetToken) setResetToken(res.data.resetToken);
    } catch (err) {
      setOk(false);
      setMsg(err.response?.data?.message || 'Failed to generate reset token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto max-w-md px-4 py-10">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">Forgot Password</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email to generate a password reset token.
          </p>

          {msg ? (
            <div className={`mt-4 rounded-xl border px-3 py-2 text-sm ${ok ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
              {msg}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? 'Generating…' : 'Generate Reset Token'}
            </button>
          </form>

          {resetToken ? (
            <div className="mt-5 rounded-xl border bg-slate-50 p-4">
              <p className="text-xs font-semibold text-gray-700">Demo Reset Token</p>
              <p className="mt-2 break-all rounded-lg bg-white p-3 text-xs text-gray-800 border">
                {resetToken}
              </p>

              <Link
                to={`/reset-password/${resetToken}`}
                className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
              >
                Continue to Reset Password
              </Link>

              <p className="mt-2 text-xs text-gray-500">
                In production, this token would be sent by email/SMS.
              </p>
            </div>
          ) : null}

          <div className="mt-6 text-sm text-gray-700">
            <Link to="/login" className="font-semibold text-blue-700 hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;