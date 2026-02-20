import React, { useEffect, useMemo, useState } from 'react';
import { getAllUsers, updateUserRole } from '../../services/userService';
import { getUserProfile } from '../../services/authService';

const roleBadge = {
  voter: 'bg-slate-50 text-slate-700 border-slate-200',
  admin: 'bg-blue-50 text-blue-700 border-blue-200',
  superadmin: 'bg-purple-50 text-purple-700 border-purple-200'
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
      const [meRes, list] = await Promise.all([
        getUserProfile(),
        getAllUsers(query)
      ]);
      setMe(meRes.data);
      setUsers(Array.isArray(list) ? list : []);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isSuper = me?.role === 'superadmin';

  const filteredCount = users.length;

  const handleSearch = async (e) => {
    e.preventDefault();
    await load(q.trim());
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setSavingId(userId);
      await updateUserRole(userId, newRole);
      await load(q.trim());
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update role');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
              <p className="mt-1 text-sm text-gray-600">
                View registered voters and update roles (admin-only).
              </p>
            </div>

            <div className="rounded-xl border bg-slate-50 p-3 text-sm">
              <p className="text-gray-700">
                Signed in as: <span className="font-semibold">{me?.fullName || '...'}</span>
              </p>
              <p className="text-gray-600">
                Role: <span className="font-semibold">{me?.role || '...'}</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by full name or email..."
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setQ('');
                load('');
              }}
              className="rounded-lg border bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              Reset
            </button>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full border bg-gray-50 px-3 py-1 text-gray-700">
              Showing: <span className="font-semibold">{filteredCount}</span>
            </span>
            {!isSuper && (
              <span className="rounded-full border bg-amber-50 px-3 py-1 text-amber-800">
                Note: Only superadmin can assign “superadmin”.
              </span>
            )}
          </div>

          <hr className="my-6" />

          {loading ? (
            <p className="text-sm text-gray-600">Loading users…</p>
          ) : users.length === 0 ? (
            <div className="rounded-xl border bg-slate-50 p-4">
              <p className="text-sm text-gray-700">No users found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-separate border-spacing-0">
                <thead>
                  <tr className="text-left text-xs text-gray-600">
                    <th className="border-b p-3">Full Name</th>
                    <th className="border-b p-3">Email</th>
                    <th className="border-b p-3">Role</th>
                    <th className="border-b p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50">
                      <td className="border-b p-3 text-sm font-medium text-gray-900">
                        {u.fullName}
                      </td>
                      <td className="border-b p-3 text-sm text-gray-700">
                        {u.email}
                      </td>
                      <td className="border-b p-3">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${roleBadge[u.role] || roleBadge.voter}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="border-b p-3">
                        <select
                          defaultValue={u.role}
                          disabled={savingId === u._id || (!isSuper && u.role === 'superadmin')}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 disabled:opacity-60"
                        >
                          <option value="voter">voter</option>
                          <option value="admin">admin</option>
                          {isSuper ? <option value="superadmin">superadmin</option> : null}
                        </select>

                        {savingId === u._id ? (
                          <span className="ml-2 text-xs text-gray-500">Saving…</span>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="mt-3 text-xs text-gray-500">
                Security note: only admin/superadmin can access this page. Role updates are validated on the backend.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;