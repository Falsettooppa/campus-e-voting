import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserProfile } from '../../services/authService';
import { getAllElections } from '../../services/electionService';

const badgeStyles = {
  upcoming: 'bg-amber-50 text-amber-700 border-amber-200',
  active: 'bg-green-50 text-green-700 border-green-200',
  closed: 'bg-gray-100 text-gray-700 border-gray-200'
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const userRes = await getUserProfile();
        setUser(userRes.data);

        const electionsRes = await getAllElections();
        setElections(Array.isArray(electionsRes) ? electionsRes : []);
      } catch (err) {
        console.error(err);
        alert('Failed to load admin dashboard');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const stats = useMemo(() => {
    const total = elections.length;
    const upcoming = elections.filter(e => e.status === 'upcoming').length;
    const active = elections.filter(e => e.status === 'active').length;
    const closed = elections.filter(e => e.status === 'closed').length;
    return { total, upcoming, active, closed };
  }, [elections]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-600">Loading admin dashboard…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return <p>Unable to load profile.</p>;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              {user.fullName} <span className="text-gray-500">({user.role})</span>
            </p>
          </div>

          <button
            onClick={() => navigate('/admin/create-election')}
            className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
          >
            Create Election
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.total}</p>
          </div>

          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Upcoming</p>
            <p className="mt-1 text-2xl font-semibold text-amber-600">{stats.upcoming}</p>
          </div>

          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Active</p>
            <p className="mt-1 text-2xl font-semibold text-green-600">{stats.active}</p>
          </div>

          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Closed</p>
            <p className="mt-1 text-2xl font-semibold text-gray-700">{stats.closed}</p>
          </div>
        </div>

        {/* Elections */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Recent Elections</h2>
              <p className="mt-1 text-sm text-gray-600">Manage elections and view results when closed.</p>
            </div>
            <span className="rounded-full border bg-gray-50 px-3 py-1 text-xs text-gray-700">
              Showing: {Math.min(elections.length, 8)}
            </span>
          </div>

          <div className="mt-5">
            {elections.length === 0 ? (
              <div className="rounded-xl border bg-slate-50 p-4">
                <p className="text-sm text-gray-700">No elections yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {elections.slice(0, 8).map((e) => {
                  const status = e.status || 'upcoming';
                  const badge = badgeStyles[status] || badgeStyles.upcoming;

                  return (
                    <div
                      key={e._id}
                      className="flex flex-col gap-3 rounded-xl border p-4 hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{e.title}</p>
                        <span className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${badge}`}>
                          {status}
                        </span>
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Link
                          to={`/elections/${e._id}`}
                          className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 text-center"
                        >
                          Manage
                        </Link>

                        {status === 'closed' && (
                          <Link
                            to={`/elections/${e._id}/results`}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50 text-center"
                          >
                            Results
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
