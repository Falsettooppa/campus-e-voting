import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import {
  getElectionById,
  vote,
  updateElectionStatus,
  getMyVoteStatus,
  getVotersForElection
} from '../services/electionService';

import { getUserProfile } from '../services/authService';

const badgeStyles = {
  upcoming: 'bg-amber-50 text-amber-700 border-amber-200',
  active: 'bg-green-50 text-green-700 border-green-200',
  closed: 'bg-gray-100 text-gray-700 border-gray-200'
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

  const fetchElection = async () => {
    const data = await getElectionById(id);
    setElection(data);
    return data;
  };

  const fetchVoters = async () => {
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
  };

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

        if (admin) {
          await fetchVoters();
        }
      } catch (err) {
        console.error('Init error:', err);
        alert(err.response?.data?.message || 'Failed to load election');
      } finally {
        setLoading(false);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const status = election?.status || 'upcoming';
  const statusBadge = badgeStyles[status] || badgeStyles.upcoming;
  const votingOpen = status === 'active';

  const candidateCount = useMemo(() => {
    return Array.isArray(election?.candidates) ? election.candidates.length : 0;
  }, [election]);

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
      alert('Vote submitted successfully');

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

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-600">Loading election…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-700">Election not found.</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 rounded-lg border bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Top bar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-fit rounded-lg border bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            ← Back
          </button>

          {status === 'closed' && (
            <Link
              to={`/elections/${id}/results`}
              className="w-fit rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              View Results
            </Link>
          )}
        </div>

        {/* Header card */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{election.title}</h1>
              {election.description ? (
                <p className="mt-2 text-sm text-gray-600">{election.description}</p>
              ) : (
                <p className="mt-2 text-sm text-gray-500">No description provided.</p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusBadge}`}>
                  {status}
                </span>
                <span className="inline-flex rounded-full border bg-gray-50 px-2.5 py-1 text-xs text-gray-700">
                  Candidates: {candidateCount}
                </span>
              </div>
            </div>

            {/* Admin Status Controls */}
            {isAdmin && (
              <div className="rounded-xl border bg-slate-50 p-3">
                <p className="text-xs font-semibold text-gray-700">Admin Controls</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => changeStatus('upcoming')}
                    className="rounded-lg border bg-white px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50"
                  >
                    Upcoming
                  </button>
                  <button
                    onClick={() => changeStatus('active')}
                    className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => changeStatus('closed')}
                    className="rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-black"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Voter status info */}
          {!votingOpen && (
            <div className="mt-4 rounded-xl border bg-amber-50 p-3 text-sm text-amber-900">
              Voting is not allowed right now because this election is{' '}
              <span className="font-semibold">{status}</span>.
            </div>
          )}

          {hasVoted && (
            <div className="mt-4 rounded-xl border bg-green-50 p-3 text-sm text-green-800">
              ✅ You have already voted in this election
              {votedAt ? (
                <span className="text-green-700">
                  {' '}
                  (Voted at: {new Date(votedAt).toLocaleString()})
                </span>
              ) : null}
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Candidates */}
          <section className="lg:col-span-2">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Candidates</h2>
              <p className="mt-1 text-sm text-gray-600">
                Cast your vote when the election is active.
              </p>

              <div className="mt-5">
                {!Array.isArray(election.candidates) || election.candidates.length === 0 ? (
                  <div className="rounded-xl border bg-slate-50 p-4">
                    <p className="text-sm text-gray-700">No candidates found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {election.candidates.map((c) => (
                      <div key={c._id} className="rounded-xl border p-4 hover:shadow-sm transition">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                            <p className="mt-1 text-xs text-gray-500">Votes: {c.votes}</p>
                          </div>

                          <button
                            onClick={() => handleVote(c._id)}
                            disabled={!votingOpen || hasVoted || votingId === c._id}
                            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {!votingOpen
                              ? 'Closed'
                              : hasVoted
                              ? 'Voted'
                              : votingId === c._id
                              ? 'Voting…'
                              : 'Vote'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Admin audit panel */}
          <aside className="lg:col-span-1">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Election Info</h2>
              <div className="mt-3 space-y-3 text-sm text-gray-700">
                <div className="rounded-xl border bg-slate-50 p-3">
                  <p className="font-semibold text-gray-900">Voting rule</p>
                  <p className="mt-1 text-gray-600">
                    One voter can cast only one vote per election.
                  </p>
                </div>

                <div className="rounded-xl border bg-slate-50 p-3">
                  <p className="font-semibold text-gray-900">Status</p>
                  <p className="mt-1 text-gray-600">
                    Current: <span className="font-medium">{status}</span>
                  </p>
                </div>
              </div>

              {isAdmin && (
                <div className="mt-6">
                  <hr className="my-4" />

                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-900">Voter Audit</h3>
                    <button
                      onClick={fetchVoters}
                      disabled={loadingVoters}
                      className="rounded-lg border bg-white px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-60"
                    >
                      {loadingVoters ? 'Refreshing…' : 'Refresh'}
                    </button>
                  </div>

                  <p className="mt-2 text-sm text-gray-700">
                    Total votes cast: <span className="font-semibold">{totalVotes}</span>
                  </p>

                  <div className="mt-3">
                    {voters.length === 0 ? (
                      <div className="rounded-xl border bg-slate-50 p-3">
                        <p className="text-sm text-gray-700">No votes have been cast yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {voters.map((v, idx) => (
                          <div key={v.voterId || idx} className="rounded-xl border p-3">
                            <p className="text-sm font-semibold text-gray-900">
                              {v.fullName || 'Unknown User'}
                            </p>
                            <p className="text-xs text-gray-600">{v.email || '-'}</p>
                            <p className="mt-1 text-xs text-gray-500">
                              Voted at: {v.votedAt ? new Date(v.votedAt).toLocaleString() : '-'}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ElectionDetails;

