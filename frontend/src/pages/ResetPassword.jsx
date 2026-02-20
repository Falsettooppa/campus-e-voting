import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../services/authService';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setOk(false);

    if (password.length < 6) {
      setMsg('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setMsg('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const res = await resetPassword(token, password);
      setOk(true);
      setMsg(res.data?.message || 'Password reset successful.');

      setTimeout(() => navigate('/login'), 800);
    } catch (err) {
      setOk(false);
      setMsg(err.response?.data?.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto max-w-md px-4 py-10">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">Reset Password</h1>
          <p className="mt-2 text-sm text-gray-600">
            Set a new password for your account.
          </p>

          {msg ? (
            <div className={`mt-4 rounded-xl border px-3 py-2 text-sm ${ok ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
              {msg}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? 'Resetting…' : 'Reset Password'}
            </button>
          </form>

          <div className="mt-6 text-sm text-gray-700 flex items-center justify-between">
            <Link to="/forgot-password" className="font-semibold text-blue-700 hover:underline">
              Generate new token
            </Link>
            <Link to="/login" className="font-semibold text-gray-800 hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;