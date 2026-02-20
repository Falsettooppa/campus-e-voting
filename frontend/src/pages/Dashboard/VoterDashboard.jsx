import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserProfile } from '../../services/authService';
import { getAllElections } from '../../services/electionService';

const STATUS = {
  upcoming: { badge: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400', label: 'Upcoming' },
  active:   { badge: 'bg-green-50 text-green-700 border-green-200',  dot: 'bg-green-500',  label: 'Active', pulse: true },
  closed:   { badge: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400',  label: 'Closed' },
};

const AVATAR_COLORS = ['bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500'];

const Avatar = ({ name }) => {
  const initials = name ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : '??';
  const bg = AVATAR_COLORS[initials.charCodeAt(0) % AVATAR_COLORS.length];
  return (
    <div className={`h-10 w-10 rounded-full ${bg} flex items-center justify-center text-sm font-bold text-white shrink-0`}>
      {initials}
    </div>
  );
};

const VoterDashboard = () => {
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
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const stats = useMemo(() => ({
    total:    elections.length,
    active:   elections.filter(e => e.status === 'active').length,
    upcoming: elections.filter(e => e.status === 'upcoming').length,
    closed:   elections.filter(e => e.status === 'closed').length,
  }), [elections]);

  const filtered = useMemo(() =>
    filter === 'all' ? elections : elections.filter(e => e.status === filter),
    [elections, filter]);

  if (loading || !user) return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <svg className="h-7 w-7 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <p className="text-sm text-slate-500">Loading your dashboard…</p>
      </div>
    </div>
  );

  const role = user?.role || 'voter';
  const roleBadge = role === 'superadmin' ? 'bg-violet-50 text-violet-700 border-violet-200'
    : role === 'admin' ? 'bg-blue-50 text-blue-700 border-blue-200'
    : 'bg-slate-100 text-slate-600 border-slate-200';

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">

        {/* ── Header ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center gap-3">
            <Avatar name={user.fullName} />
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Welcome, {user.fullName.split(' ')[0]}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">{user.email}</p>
            </div>
          </div>
          <span className={`self-start sm:self-auto inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${roleBadge}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
            {role}
          </span>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total',    value: stats.total,    color: 'text-slate-700', bg: 'bg-slate-100',  icon: <svg className="h-5 w-5 fill-slate-400" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/></svg> },
            { label: 'Active',   value: stats.active,   color: 'text-green-600', bg: 'bg-green-50',   icon: <svg className="h-5 w-5 fill-green-400" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> },
            { label: 'Upcoming', value: stats.upcoming, color: 'text-amber-600', bg: 'bg-amber-50',   icon: <svg className="h-5 w-5 fill-amber-400" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg> },
            { label: 'Closed',   value: stats.closed,   color: 'text-slate-500', bg: 'bg-slate-100',  icon: <svg className="h-5 w-5 fill-slate-300" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg> },
          ].map(({ label, value, color, bg, icon }) => (
            <div key={label} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3 shadow-sm">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>{icon}</div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</p>
                <p className={`text-xl font-bold mt-0.5 ${color}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Elections list */}
          <section className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

              {/* Section header */}
              <div className="px-5 py-4 border-b border-slate-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Available Elections</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Cast your vote when an election is active</p>
                </div>
                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 self-start sm:self-auto">
                  {['all', 'active', 'upcoming', 'closed'].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize transition-all ${filter === f ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-5">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                      <svg className="h-6 w-6 fill-slate-300" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/></svg>
                    </div>
                    <p className="text-sm font-medium text-slate-600">No elections found</p>
                    <p className="text-xs text-slate-400 mt-1">Check back later or try a different filter</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {filtered.map(election => {
                      const s = STATUS[election.status] || STATUS.upcoming;
                      const candidateCount = Array.isArray(election.candidates) ? election.candidates.length : 0;
                      return (
                        <div key={election._id}
                          className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md hover:border-slate-300 transition-all flex flex-col gap-3">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm font-semibold text-slate-900 leading-snug">{election.title}</h3>
                            <span className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${s.badge}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${s.dot} ${s.pulse ? 'animate-pulse' : ''}`}/>
                              {s.label}
                            </span>
                          </div>

                          {election.description ? (
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{election.description}</p>
                          ) : (
                            <p className="text-xs text-slate-400 italic">No description provided.</p>
                          )}

                          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                            <span className="flex items-center gap-1 text-xs text-slate-400">
                              <svg className="h-3.5 w-3.5 fill-slate-300" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                              {candidateCount} candidate{candidateCount !== 1 ? 's' : ''}
                            </span>
                            <Link to={`/elections/${election._id}`}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold no-underline transition-colors ${
                                election.status === 'active'
                                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}>
                              {election.status === 'active' ? 'Vote Now' : 'View'}
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="lg:col-span-1 flex flex-col gap-4">

            {/* How it works */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h2 className="text-base font-semibold text-slate-900 mb-4">How it works</h2>
              <div className="space-y-4">
                {[
                  { step: '1', title: 'Find an active election', desc: 'Look for elections with an Active badge — these are open for voting right now.', color: 'bg-green-50 text-green-700 border-green-200' },
                  { step: '2', title: 'Cast your vote', desc: 'Open the election, review the candidates, and submit your vote.', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                  { step: '3', title: 'One vote per election', desc: 'Each voter may vote only once. You cannot change your vote after submission.', color: 'bg-amber-50 text-amber-700 border-amber-200' },
                ].map(({ step, title, desc, color }) => (
                  <div key={step} className="flex gap-3">
                    <div className={`h-6 w-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${color}`}>
                      {step}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status legend */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h2 className="text-base font-semibold text-slate-900 mb-3">Status guide</h2>
              <div className="space-y-2">
                {Object.entries(STATUS).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-2.5">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${val.badge}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${val.dot}`}/>
                      {val.label}
                    </span>
                    <span className="text-xs text-slate-500">
                      {key === 'upcoming' && '— not started yet'}
                      {key === 'active'   && '— voting is open'}
                      {key === 'closed'   && '— voting has ended'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
};

export default VoterDashboard;