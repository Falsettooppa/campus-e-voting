// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { isAuthenticated, logout, getUserProfile } from '../services/authService';

// const Navbar = () => {
//   const navigate = useNavigate();
//   const [isAdmin, setIsAdmin] = useState(false);

//   useEffect(() => {
//     const checkRole = async () => {
//       if (!isAuthenticated()) return;

//       try {
//         const res = await getUserProfile();
//         const role = res.data?.role;
//         setIsAdmin(role === 'admin' || role === 'superadmin');
//       } catch {
//         setIsAdmin(false);
//       }
//     };

//     checkRole();
//   }, []);

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <nav style={{ padding: 12, borderBottom: '1px solid #ddd' }}>
//       <ul style={{ display: 'flex', gap: 12, listStyle: 'none' }}>
//         <li><Link to="/">Home</Link></li>

//         {isAdmin && (
//           <li>
//             <Link to="/admin/create-election">Create Election</Link>
//           </li>
//         )}

//         {!isAuthenticated() ? (
//           <>
//             <li><Link to="/login">Login</Link></li>
//             <li><Link to="/register">Register</Link></li>
//             <li><Link to="/dashboard">Dashboard</Link></li>

//           </>
//         ) : (
//           <li>
//             <button onClick={handleLogout}>Logout</button>
//           </li>
//         )}
//       </ul>
//     </nav>
//   );
// };

// export default Navbar;
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout, getUserProfile } from '../services/authService';

const Navbar = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (!isAuthenticated()) {
        setRole(null);
        return;
      }
      try {
        const res = await getUserProfile();
        setRole(res.data?.role || 'voter');
      } catch (e) {
        setRole('voter');
      }
    };

    init();
  }, []);

  const handleLogout = () => {
    logout();
    setRole(null);
    navigate('/login');
  };

  const isAdmin = role === 'admin' || role === 'superadmin';

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-blue-600"></div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-gray-900">Campus E-Voting</div>
            <div className="text-xs text-gray-500">Secure voting platform</div>
          </div>
        </Link>

        {/* Links */}
        <nav className="flex items-center gap-2">
          {isAuthenticated() ? (
            <>
              <Link
                to="/dashboard"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Dashboard
              </Link>

              {isAdmin && (
                <Link
                  to="/admin/create-election"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Create Election
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

