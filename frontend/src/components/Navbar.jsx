import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout, getUserProfile } from '../services/authService';

const Navbar = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      if (!isAuthenticated()) return;

      try {
        const res = await getUserProfile();
        const role = res.data?.role;
        setIsAdmin(role === 'admin' || role === 'superadmin');
      } catch {
        setIsAdmin(false);
      }
    };

    checkRole();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ padding: 12, borderBottom: '1px solid #ddd' }}>
      <ul style={{ display: 'flex', gap: 12, listStyle: 'none' }}>
        <li><Link to="/">Home</Link></li>

        {isAdmin && (
          <li>
            <Link to="/admin/create-election">Create Election</Link>
          </li>
        )}

        {!isAuthenticated() ? (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        ) : (
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
