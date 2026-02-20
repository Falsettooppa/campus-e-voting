import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserProfile } from '../../services/authService';
import { getAllElections } from '../../services/electionService';

const STATUS = {
  upcoming: { badge: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400',   label: 'Upcoming' },
  active:   { badge: 'bg-green-50 text-green-700 border-green-200',  dot: 'bg-green-500',  label: 'Active', pulse: true },
  closed:   { badge: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400',  label: 'Closed' },
};

const StatCard = ({ label, value, valueColor, icon, bg }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
    <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-bold mt-0.5 ${valueColor}`}>{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const init = async () => {
      try {
        const [userRes, electionsRes] = await Promise.all([getUserProfile(), getAllElections()]);
        setUser(userRes.data);
        setElections(Array.isArray(electionsRes) ? electionsRes : []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    init();
  }, []);

  const stats = useMemo(() => ({
    total:    elections.length,
    upcoming: elections.filter(e => e.status === 'upcoming').length,
    active:   elections.filter(e => e.status === 'active').length,
    closed:   elections.filter(e => e.status === 'closed').length,
  }), [elections]);

  const filtered = useMemo(() =>
    filter === 'all' ? elections : elections.filter(e => e.status === filter),
    [elections, filter]);

  if (loading) return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <svg className="h-7 w-7 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <p className="text-sm text-slate-500">Loading dashboard…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">
              {user?.fullName} ·{' '}
              <span className={`font-medium ${user?.role === 'superadmin' ? 'text-violet-600' : 'text-blue-600'}`}>
                {user?.role}
              </span>
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => navigate('/admin/users')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-700 transition-colors shadow-sm">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
              Manage Users
            </button>
            <button onClick={() => navigate('/admin/create-election')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm">
              <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              New Election
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
          <StatCard label="Total" value={stats.total} valueColor="text-slate-900"
            bg="bg-slate-100"
            icon={<svg className="h-5 w-5 fill-slate-500" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/></svg>}
          />
          <StatCard label="Upcoming" value={stats.upcoming} valueColor="text-amber-600"
            bg="bg-amber-50"
            icon={<svg className="h-5 w-5 fill-amber-500" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>}
          />
          <StatCard label="Active" value={stats.active} valueColor="text-green-600"
            bg="bg-green-50"
            icon={<svg className="h-5 w-5 fill-green-500" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>}
          />
          <StatCard label="Closed" value={stats.closed} valueColor="text-slate-600"
            bg="bg-slate-100"
            icon={<svg className="h-5 w-5 fill-slate-400" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>}
          />
        </div>

        {/* Elections */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Section header */}
          <div className="px-6 py-4 border-b border-slate-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Elections</h2>
              <p className="text-xs text-slate-500 mt-0.5">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</p>
            </div>
            {/* Filter tabs */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 self-start sm:self-auto">
              {['all', 'active', 'upcoming', 'closed'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all ${filter === f ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <svg className="h-6 w-6 fill-slate-300" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/></svg>
              </div>
              <p className="text-sm font-medium text-slate-600">No elections found</p>
              <p className="text-xs text-slate-400 mt-1">Try a different filter or create one</p>
            </div>
          ) : (
            <div>
              {filtered.slice(0, 8).map((e, idx) => {
                const s = STATUS[e.status] || STATUS.upcoming;
                return (
                  <div key={e._id}
                    className={`flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50 transition-colors ${idx !== 0 ? 'border-t border-slate-100' : ''}`}>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{e.title}</p>
                      <span className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${s.badge}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${s.dot} ${s.pulse ? 'animate-pulse' : ''}`} />
                        {s.label}
                      </span>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Link to={`/elections/${e._id}`}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700 no-underline transition-colors text-center">
                        Manage
                      </Link>
                      {e.status === 'closed' && (
                        <Link to={`/elections/${e._id}/results`}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-700 no-underline transition-colors text-center">
                          Results
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {elections.length > 8 && (
            <div className="border-t border-slate-100 px-6 py-3 text-center">
              <p className="text-xs text-slate-400">Showing 8 of {elections.length} elections</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;