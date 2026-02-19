import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getElectionById, vote } from '../services/electionService';

const ElectionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState(null);

  const fetchElection = async () => {
    const data = await getElectionById(id);
    setElection(data);
  };

  useEffect(() => {
    const init = async () => {
      try {
        await fetchElection();
      } catch (err) {
        console.error('Failed to load election:', err);
        alert(err.response?.data?.message || 'Failed to load election');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id]);

  const handleVote = async (candidateId) => {
    try {
      setVotingId(candidateId);
      await vote(id, candidateId);
      alert('Vote submitted successfully');
      await fetchElection(); // refresh to show updated votes
    } catch (err) {
      alert(err.response?.data?.message || 'Voting failed');
    } finally {
      setVotingId(null);
    }
  };

  if (loading) return <p>Loading election...</p>;
  if (!election) return <p>Election not found.</p>;

  return (
    <div style={{ padding: 16 }}>
      <button onClick={() => navigate(-1)}>Back</button>

      <h2 style={{ marginTop: 12 }}>{election.title}</h2>
      {election.description ? <p>{election.description}</p> : null}
      <p><strong>Status:</strong> {election.status}</p>

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
                disabled={votingId === c._id}
                style={{ marginTop: 6 }}
              >
                {votingId === c._id ? 'Voting...' : 'Vote'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ElectionDetails;
