import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getElectionById, vote, updateElectionStatus,
  getMyVoteStatus, getVotersForElection
} from '../services/electionService';
import { getUserProfile } from '../services/authService';

const STATUS = {
  upcoming: { badge: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400', label: 'Upcoming' },
  active:   { badge: 'bg-green-50 text-green-700 border-green-200',  dot: 'bg-green-500',  label: 'Active', pulse: true },
  closed:   { badge: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400',  label: 'Closed' },
};

const AVATAR_COLORS = ['bg-blue-500','bg-violet-500','bg-emerald-500','bg-orange-500','bg-pink-500','bg-teal-500'];
const Avatar = ({ name }) => {
  const initials = name ? name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase() : '??';
  const bg = AVATAR_COLORS[initials.charCodeAt(0) % AVATAR_COLORS.length];
  return (
    <div className={`h-8 w-8 rounded-full ${bg} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
      {initials}
    </div>
  );
};

const ElectionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedAt, setVotedAt] = useState(null);
  const [voters, setVoters] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loadingVoters, setLoadingVoters] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);

  const fetchElection = useCallback(async () => {
    const data = await getElectionById(id);
    setElection(data);
    return data;
  }, [id]);

  const fetchVoters = useCallback(async () => {
    try {
      setLoadingVoters(true);
      const data = await getVotersForElection(id);
      setTotalVotes(data.totalVotes || 0);
      setVoters(Array.isArray(data.voters) ? data.voters : []);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to load voter list');
    } finally {
      setLoadingVoters(false);
    }
  },[id]);

useEffect(() => {
  const init = async () => {
    try {
      await fetchElection();
      const voteStatus = await getMyVoteStatus(id);
      setHasVoted(!!voteStatus?.hasVoted);
      setVotedAt(voteStatus?.votedAt || null);

      const userRes = await getUserProfile();
      const role = userRes.data?.role;
      const admin = role === 'admin' || role === 'superadmin';
      setIsAdmin(admin);

      if (admin) await fetchVoters();
    } catch (err) {
      console.error('Init error:', err);
      alert(err.response?.data?.message || 'Failed to load election');
    } finally {
      setLoading(false);
    }
  };

  init();
}, [id, fetchElection, fetchVoters]);

  const status = election?.status || 'upcoming';
  const s = STATUS[status] || STATUS.upcoming;
  const votingOpen = status === 'active';
  const candidateCount = useMemo(() =>
    Array.isArray(election?.candidates) ? election.candidates.length : 0,
    [election]);

  const totalCandidateVotes = useMemo(() =>
    Array.isArray(election?.candidates)
      ? election.candidates.reduce((sum, c) => sum + (c.votes || 0), 0)
      : 0,
    [election]);

  const changeStatus = async (newStatus) => {
    try {
      await updateElectionStatus(id, newStatus);
      await fetchElection();
      if (isAdmin) await fetchVoters();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleVote = async (candidateId) => {
    try {
      setVotingId(candidateId);
      await vote(id, candidateId);
      setVoteSuccess(true);
      const voteStatus = await getMyVoteStatus(id);
      setHasVoted(!!voteStatus?.hasVoted);
      setVotedAt(voteStatus?.votedAt || null);
      await fetchElection();
      if (isAdmin) await fetchVoters();
    } catch (err) {
      alert(err.response?.data?.message || 'Voting failed');
    } finally {
      setVotingId(null);
    }
  };

  if (loading) return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <svg className="h-7 w-7 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <p className="text-sm text-slate-500">Loading election…</p>
      </div>
    </div>
  );

  if (!election) return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <svg className="h-7 w-7 fill-slate-300" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>
        </div>
        <p className="text-base font-semibold text-slate-700">Election not found</p>
        <button onClick={() => navigate(-1)}
          className="mt-4 flex items-center gap-1.5 mx-auto px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          Go back
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">

        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <button onClick={() => navigate(-1)}
            className="flex items-center justify-center h-9 w-9 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors shadow-sm shrink-0">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          </button>
          {status === 'closed' && (
            <Link to={`/elections/${id}/results`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 no-underline transition-colors shadow-sm">
              <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
              View Results
            </Link>
          )}
        </div>

        {/* Election header card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${s.badge}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${s.dot} ${s.pulse ? 'animate-pulse' : ''}`}/>
                  {s.label}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                  <svg className="h-3 w-3 fill-slate-400" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                  {candidateCount} candidate{candidateCount !== 1 ? 's' : ''}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{election.title}</h1>
              <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
                {election.description || 'No description provided.'}
              </p>
            </div>

            {/* Admin Controls */}
            {isAdmin && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shrink-0 sm:w-56">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">Admin Controls</p>
                <div className="flex flex-col gap-2">
                  <button onClick={() => changeStatus('upcoming')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors ${status === 'upcoming' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0"/>
                    Set Upcoming
                  </button>
                  <button onClick={() => changeStatus('active')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors ${status === 'active' ? 'border-green-200 bg-green-50 text-green-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-green-50 hover:text-green-700 hover:border-green-200'}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0"/>
                    Activate Voting
                  </button>
                  <button onClick={() => changeStatus('closed')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors ${status === 'closed' ? 'border-slate-300 bg-slate-100 text-slate-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0"/>
                    Close Election
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Status banners */}
          {!votingOpen && !hasVoted && (
            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <svg className="h-4 w-4 fill-amber-500 shrink-0 mt-0.5" viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
              Voting is not open — this election is currently <span className="font-semibold ml-1">{status}</span>.
            </div>
          )}

          {voteSuccess && (
            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              <svg className="h-4 w-4 fill-green-500 shrink-0 mt-0.5" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              Your vote was submitted successfully!
            </div>
          )}

          {hasVoted && !voteSuccess && (
            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              <svg className="h-4 w-4 fill-green-500 shrink-0 mt-0.5" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              <span>
                You have already voted in this election.
                {votedAt && <span className="text-green-700 ml-1">Voted at: {new Date(votedAt).toLocaleString()}</span>}
              </span>
            </div>
          )}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Candidates */}
          <section className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Candidates</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {votingOpen && !hasVoted ? 'Select a candidate to cast your vote' : 'Vote counts shown below'}
                  </p>
                </div>
                {totalCandidateVotes > 0 && (
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                    {totalCandidateVotes} vote{totalCandidateVotes !== 1 ? 's' : ''} cast
                  </span>
                )}
              </div>

              <div className="p-6">
                {!Array.isArray(election.candidates) || election.candidates.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                      <svg className="h-6 w-6 fill-slate-300" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                    </div>
                    <p className="text-sm font-medium text-slate-600">No candidates yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {election.candidates.map((c, idx) => {
                      const pct = totalCandidateVotes > 0 ? Math.round((c.votes / totalCandidateVotes) * 100) : 0;
                      const isVoting = votingId === c._id;
                      return (
                        <div key={c._id}
                          className="rounded-xl border border-slate-200 p-4 hover:shadow-sm hover:border-slate-300 transition-all flex flex-col gap-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 shrink-0">
                                {idx + 1}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-900 truncate">{c.name}</p>
                                <p className="text-xs text-slate-400">{c.votes} vote{c.votes !== 1 ? 's' : ''}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleVote(c._id)}
                              disabled={!votingOpen || hasVoted || !!votingId}
                              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                !votingOpen || hasVoted
                                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                  : isVoting
                                  ? 'bg-blue-100 text-blue-600 cursor-wait'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              {isVoting ? (
                                <>
                                  <svg className="h-3 w-3 animate-spin fill-current" viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 1 10 10h-2a8 8 0 0 0-8-8V2z"/></svg>
                                  Voting…
                                </>
                              ) : !votingOpen ? 'Closed'
                                : hasVoted ? 'Voted'
                                : 'Vote'}
                            </button>
                          </div>

                          {/* Vote bar */}
                          {(totalCandidateVotes > 0 || status === 'closed') && (
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-slate-400">{pct}%</span>
                              </div>
                              <div className="h-1.5 w-full rounded-full bg-slate-100">
                                <div
                                  className="h-1.5 rounded-full bg-blue-500 transition-all duration-500"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          )}
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

            {/* Election info */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h2 className="text-base font-semibold text-slate-900 mb-4">Election Info</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-xs font-medium text-slate-500">Status</span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${s.badge}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`}/>
                    {s.label}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-xs font-medium text-slate-500">Candidates</span>
                  <span className="text-xs font-semibold text-slate-700">{candidateCount}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-xs font-medium text-slate-500">Votes cast</span>
                  <span className="text-xs font-semibold text-slate-700">{totalCandidateVotes}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs font-medium text-slate-500">Your vote</span>
                  <span className={`text-xs font-semibold ${hasVoted ? 'text-green-600' : 'text-slate-400'}`}>
                    {hasVoted ? 'Submitted' : 'Not voted'}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <svg className="h-4 w-4 fill-slate-400 shrink-0 mt-0.5" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                <p className="text-xs text-slate-500 leading-relaxed">Each voter may cast only one vote per election. Votes cannot be changed after submission.</p>
              </div>
            </div>

            {/* Admin voter audit */}
            {isAdmin && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">Voter Audit</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{totalVotes} vote{totalVotes !== 1 ? 's' : ''} recorded</p>
                  </div>
                  <button onClick={fetchVoters} disabled={loadingVoters}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50">
                    {loadingVoters ? (
                      <svg className="h-3 w-3 animate-spin fill-slate-500" viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 1 10 10h-2a8 8 0 0 0-8-8V2z"/></svg>
                    ) : (
                      <svg className="h-3 w-3 fill-slate-500" viewBox="0 0 24 24"><path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
                    )}
                    Refresh
                  </button>
                </div>

                <div className="p-4">
                  {voters.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                        <svg className="h-5 w-5 fill-slate-300" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                      </div>
                      <p className="text-xs font-medium text-slate-500">No votes yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-72 overflow-y-auto">
                      {voters.map((v, idx) => (
                        <div key={v.voterId || idx} className="flex items-center gap-2.5 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
                          <Avatar name={v.fullName || 'Unknown'} />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-slate-900 truncate">{v.fullName || 'Unknown User'}</p>
                            <p className="text-xs text-slate-400 truncate">{v.email || '—'}</p>
                            {v.votedAt && (
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                {new Date(v.votedAt).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ElectionDetails;