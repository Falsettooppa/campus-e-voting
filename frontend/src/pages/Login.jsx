// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { login } from '../services/authService';

// function Login() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     email: '',
//     password: ''
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await login(form); // Call service
//       alert('Login successful');
//       navigate('/dashboard');
//     } catch (err) {
//       alert(err.response?.data?.message || 'Login failed');
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
  


//       <form onSubmit={handleSubmit}>
//         <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
//         <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// }

// export default Login;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await login(form);
      navigate('/dashboard'); // keep consistent with your router
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">Login</h1>
          <p className="mt-1 text-sm text-gray-600">
            Access your dashboard and vote securely.
          </p>

          {message ? (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {message}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
                type="email"
                name="email"
                placeholder="you@student.edu"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Login'}
            </button>

            <p className="text-center text-sm text-gray-600">
              New here?{' '}
              <Link to="/register" className="font-semibold text-blue-600 hover:underline">
                Create an account
              </Link>
            </p>
          </form>
          <p className="mt-4 text-sm text-gray-600">
  Forgot your password?{' '}
  <a href="/forgot-password" className="font-semibold text-blue-700 hover:underline">
    Reset here
  </a>
</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
