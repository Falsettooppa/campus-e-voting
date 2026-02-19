import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
  getElectionById,
  vote,
  updateElectionStatus,
  getMyVoteStatus,
  getVotersForElection
} from '../services/electionService';

import { getUserProfile } from '../services/authService';

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
        // election
        await fetchElection();

        // vote status (privacy-safe)
        const voteStatus = await getMyVoteStatus(id);
        setHasVoted(!!voteStatus.hasVoted);
        setVotedAt(voteStatus.votedAt || null);

        // user role
        const userRes = await getUserProfile();
        const role = userRes.data?.role;

        const admin = role === 'admin' || role === 'superadmin';
        setIsAdmin(admin);

        // admin voter list
        if (admin) {
          await fetchVoters();
        }
      } catch (err) {
        console.error('Init error:', err);
        alert(err.response?.data?.message || 'Failed to load election/user info');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id]);

  const changeStatus = async (newStatus) => {
    try {
      await updateElectionStatus(id, newStatus);
      await fetchElection();
      // if admin, refresh voter list too (optional)
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

      // refresh election + vote status + (optional) voter list
      await fetchElection();

      const voteStatus = await getMyVoteStatus(id);
      setHasVoted(!!voteStatus.hasVoted);
      setVotedAt(voteStatus.votedAt || null);

      if (isAdmin) await fetchVoters();
    } catch (err) {
      alert(err.response?.data?.message || 'Voting failed');
    } finally {
      setVotingId(null);
    }
  };

  if (loading) return <p>Loading election...</p>;
  if (!election) return <p>Election not found.</p>;

  const votingOpen = election.status === 'active';

  return (
    <div style={{ padding: 16 }}>
      <button onClick={() => navigate(-1)}>Back</button>

      <h2 style={{ marginTop: 12 }}>{election.title}</h2>
      {election.description ? <p>{election.description}</p> : null}

      <p><strong>Status:</strong> {election.status}</p>

      {/* ✅ Admin-only status controls */}
      {isAdmin && (
        <div style={{ marginBottom: 12 }}>
          <button onClick={() => changeStatus('upcoming')}>Upcoming</button>{' '}
          <button onClick={() => changeStatus('active')}>Activate</button>{' '}
          <button onClick={() => changeStatus('closed')}>Close</button>
        </div>
      )}

      {!votingOpen ? (
        <p style={{ marginTop: 8 }}>
          Voting is not allowed right now because this election is <strong>{election.status}</strong>.
        </p>
      ) : null}

      {hasVoted && (
        <p style={{ marginTop: 8 }}>
          ✅ You have already voted in this election.
          {votedAt ? ` (Voted at: ${new Date(votedAt).toLocaleString()})` : ''}
        </p>
      )}

      <hr style={{ margin: '16px 0' }} />

      <h3>Candidates</h3>

      {!election.candidates || election.candidates.length === 0 ? (
        <p>No candidates found.</p>
      ) : (
        <ul>
          {election.candidates.map((c) => (
            <li key={c._id} style={{ marginBottom: 12 }}>
              <strong>{c.name}</strong>
              <div>Votes: {c.votes}</div>

              <button
                onClick={() => handleVote(c._id)}
                disabled={!votingOpen || hasVoted || votingId === c._id}
                style={{ marginTop: 6 }}
              >
                {!votingOpen ? 'Voting Closed' : (votingId === c._id ? 'Voting...' : 'Vote')}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* ✅ Admin audit list (once, not per candidate) */}
      {isAdmin && (
        <div style={{ marginTop: 20 }}>
          <hr style={{ margin: '16px 0' }} />
          <h3>Voter Audit List</h3>

          <p><strong>Total votes cast:</strong> {totalVotes}</p>

          <button onClick={fetchVoters} disabled={loadingVoters}>
            {loadingVoters ? 'Refreshing...' : 'Refresh Voter List'}
          </button>

          {voters.length === 0 ? (
            <p style={{ marginTop: 10 }}>No votes have been cast yet.</p>
          ) : (
            <ul style={{ marginTop: 10 }}>
              {voters.map((v, idx) => (
                <li key={v.voterId || idx} style={{ marginBottom: 10 }}>
                  <div><strong>{v.fullName || 'Unknown User'}</strong></div>
                  <div>{v.email || '-'}</div>
                  <div>
                    <small>
                      Voted at: {v.votedAt ? new Date(v.votedAt).toLocaleString() : '-'}
                    </small>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ElectionDetails;
