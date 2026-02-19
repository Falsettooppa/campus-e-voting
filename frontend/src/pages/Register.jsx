// import React, { useState } from 'react';
// import { register } from '../services/authService';

// function Register() {
//   const [form, setForm] = useState({
//     fullName: '',
//     email: '',
//     password: ''
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');

//     try {
//       await register(form);
//       setMessage('Registration successful!');
//       setForm({ fullName: '', email: '', password: '' });
//     } catch (err) {
//       setMessage(err.response?.data?.message || 'Registration failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="register-page">
//       <h2>Register</h2>
//       {message && <p>{message}</p>}
//       <form onSubmit={handleSubmit}>
//         <label>
//           Full Name:
//           <input
//             name="fullName"
//             type="text"
//             value={form.fullName}
//             onChange={handleChange}
//             required
//           />
//         </label>

//         <label>
//           Email:
//           <input
//             name="email"
//             type="email"
//             value={form.email}
//             onChange={handleChange}
//             required
//           />
//         </label>

//         <label>
//           Password:
//           <input
//             name="password"
//             type="password"
//             value={form.password}
//             onChange={handleChange}
//             required
//           />
//         </label>

//         <button type="submit" disabled={loading}>
//           {loading ? 'Registering...' : 'Register'}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default Register;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { register } from '../services/authService';

function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [ok, setOk] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setOk(false);

    try {
      await register(form);
      setOk(true);
      setMessage('Registration successful. You can now login.');
      setForm({ fullName: '', email: '', password: '' });
    } catch (err) {
      setOk(false);
      setMessage(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">Create account</h1>
          <p className="mt-1 text-sm text-gray-600">
            Register to participate in campus elections.
          </p>

          {message ? (
            <div
              className={`mt-4 rounded-lg border px-3 py-2 text-sm ${
                ok
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-red-200 bg-red-50 text-red-700'
              }`}
            >
              {message}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Full name</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
                name="fullName"
                type="text"
                placeholder="e.g., Gabriel Adesoye"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
                name="email"
                type="email"
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
                name="password"
                type="password"
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
              {loading ? 'Creating…' : 'Register'}
            </button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;

