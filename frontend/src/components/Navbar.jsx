import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout, getUserProfile } from '../services/authService';

const Navbar = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!isAuthenticated()) { setRole(null); return; }
      try {
        const res = await getUserProfile();
        setRole(res.data?.role || 'voter');
      } catch { setRole('voter'); }
    };
    init();
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout(); setRole(null); setMenuOpen(false); navigate('/login');
  };

  const isAdmin = role === 'admin' || role === 'superadmin';

  return (
    <>
      <header className={`sticky top-0 z-50 bg-white border-b border-slate-200 transition-shadow duration-200 ${scrolled ? 'shadow-sm' : ''}`}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
              <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-slate-900">Campus E-Voting</div>
              <div className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Secure Platform</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {isAuthenticated() ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 no-underline transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z"/></svg>
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link to="/admin/create-election" className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-violet-700 bg-violet-50 hover:bg-violet-100 no-underline transition-colors">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
                    Create Election
                  </Link>
                )}
                <div className="w-px h-5 bg-slate-200 mx-1" />
                <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16 13v-2H7V8l-5 4 5 4v-3z"/><path d="M20 3h-9a2 2 0 00-2 2v4h2V5h9v14h-9v-4H9v4a2 2 0 002 2h9a2 2 0 002-2V5a2 2 0 00-2-2z"/></svg>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 no-underline transition-colors">
                  Login
                </Link>
                <Link to="/register" className="flex items-center gap-1 px-4 py-2 rounded-md bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 no-underline transition-colors shadow-sm">
                  Register
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="sm:hidden p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {menuOpen
              ? <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
              : <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
            }
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden border-t border-slate-100 bg-white px-4 py-3 flex flex-col gap-1">
            {isAuthenticated() ? (
              <>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 no-underline">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z"/></svg>
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link to="/admin/create-election" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium text-violet-700 hover:bg-violet-50 no-underline">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                    Create Election
                  </Link>
                )}
                <div className="h-px bg-slate-100 my-1" />
                <button onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 w-full text-left">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16 13v-2H7V8l-5 4 5 4v-3z"/></svg>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}
                  className="px-3 py-2.5 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 no-underline">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}
                  className="px-3 py-2.5 rounded-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 no-underline text-center">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;