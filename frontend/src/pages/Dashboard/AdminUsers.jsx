import React, { useEffect, useState } from 'react';
import { getAllUsers, updateUserRole } from '../../services/userService';
import { getUserProfile } from '../../services/authService';

const ROLE_META = {
  voter:      { badge: 'bg-slate-100 text-slate-600 border-slate-200' },
  admin:      { badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  superadmin: { badge: 'bg-violet-50 text-violet-700 border-violet-200' },
};

const AVATAR_COLORS = ['bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500'];

const Avatar = ({ name }) => {
  const initials = name ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : '??';
  const bg = AVATAR_COLORS[initials.charCodeAt(0) % AVATAR_COLORS.length];
  return (
    <div className={`h-8 w-8 rounded-full ${bg} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
      {initials}
    </div>
  );
};

const AdminUsers = () => {
  const [me, setMe] = useState(null);
  const [q, setQ] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const load = async (query = '') => {
    setLoading(true);
    try {
      const [meRes, list] = await Promise.all([getUserProfile(), getAllUsers(query)]);
      setMe(meRes.data);
      setUsers(Array.isArray(list) ? list : []);
    } catch (err) { alert(err.response?.data?.message || 'Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(''); }, []);

  const isSuper = me?.role === 'superadmin';

  const handleSearch = async (e) => { e.preventDefault(); await load(q.trim()); };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setSavingId(userId);
      await updateUserRole(userId, newRole);
      await load(q.trim());
    } catch (err) { alert(err.response?.data?.message || 'Failed to update role'); }
    finally { setSavingId(null); }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Management</h1>
            <p className="mt-1 text-sm text-slate-500">Manage voter accounts and assign roles</p>
          </div>
          {me && (
            <div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm self-start sm:self-auto">
              <Avatar name={me.fullName} />
              <div>
                <p className="text-xs font-semibold text-slate-800 leading-tight">{me.fullName}</p>
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold mt-0.5 ${(ROLE_META[me.role] || ROLE_META.voter).badge}`}>
                  {me.role}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Search */}
          <div className="px-6 py-4 border-b border-slate-100">
            <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                  <svg className="h-4 w-4 fill-slate-400" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                </span>
                <input
                  value={q} onChange={e => setQ(e.target.value)}
                  placeholder="Search by name or email…"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                  Search
                </button>
                <button type="button" onClick={() => { setQ(''); load(''); }}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                  Reset
                </button>
              </div>
            </form>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                {users.length} user{users.length !== 1 ? 's' : ''}
              </span>
              {!isSuper && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                  <svg className="h-3 w-3 fill-amber-500" viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
                  Only superadmin can assign the superadmin role
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <svg className="h-7 w-7 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <p className="mt-3 text-sm text-slate-500">Loading users…</p>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <svg className="h-6 w-6 fill-slate-300" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
              </div>
              <p className="text-sm font-medium text-slate-600">No users found</p>
              <p className="text-xs text-slate-400 mt-1">Try a different search query</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">User</th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">Email</th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">Role</th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">Change Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, idx) => {
                      const rm = ROLE_META[u.role] || ROLE_META.voter;
                      return (
                        <tr key={u._id} className={`hover:bg-slate-50 transition-colors ${idx !== 0 ? 'border-t border-slate-100' : ''}`}>
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <Avatar name={u.fullName} />
                              <span className="font-semibold text-slate-900">{u.fullName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-3.5 text-slate-500">{u.email}</td>
                          <td className="px-6 py-3.5">
                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${rm.badge}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-2">
                              <select
                                defaultValue={u.role}
                                disabled={savingId === u._id || (!isSuper && u.role === 'superadmin')}
                                onChange={e => handleRoleChange(u._id, e.target.value)}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <option value="voter">voter</option>
                                <option value="admin">admin</option>
                                {isSuper && <option value="superadmin">superadmin</option>}
                              </select>
                              {savingId === u._id && (
                                <svg className="h-4 w-4 animate-spin text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                </svg>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile card list */}
              <div className="sm:hidden divide-y divide-slate-100">
                {users.map(u => {
                  const rm = ROLE_META[u.role] || ROLE_META.voter;
                  return (
                    <div key={u._id} className="px-4 py-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar name={u.fullName} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-900 truncate">{u.fullName}</p>
                          <p className="text-xs text-slate-500 truncate">{u.email}</p>
                        </div>
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold shrink-0 ${rm.badge}`}>
                          {u.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-500 shrink-0">Change role:</span>
                        <select
                          defaultValue={u.role}
                          disabled={savingId === u._id || (!isSuper && u.role === 'superadmin')}
                          onChange={e => handleRoleChange(u._id, e.target.value)}
                          className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-blue-500 disabled:opacity-50"
                        >
                          <option value="voter">voter</option>
                          <option value="admin">admin</option>
                          {isSuper && <option value="superadmin">superadmin</option>}
                        </select>
                        {savingId === u._id && (
                          <svg className="h-4 w-4 animate-spin text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Footer */}
          <div className="border-t border-slate-100 px-6 py-3">
            <p className="flex items-center gap-1.5 text-xs text-slate-400">
              <svg className="h-3.5 w-3.5 fill-slate-300" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
              Role changes are validated server-side · Admin access required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;