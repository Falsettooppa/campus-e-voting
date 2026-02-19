import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getElectionById } from '../services/electionService';

const ElectionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchElection = async () => {
      try {
        const data = await getElectionById(id);
        setElection(data);
      } catch (err) {
        console.error('Failed to load election:', err);
        alert(err.response?.data?.message || 'Failed to load election');
      } finally {
        setLoading(false);
      }
    };

    fetchElection();
  }, [id]);

  if (loading) return <p>Loading election...</p>;
  if (!election) return <p>Election not found.</p>;

  const candidates = Array.isArray(election.candidates) ? election.candidates : [];

  return (
    <div style={{ padding: 16 }}>
      <button onClick={() => navigate(-1)}>Back</button>

      <h2 style={{ marginTop: 12 }}>{election.title}</h2>
      {election.description ? <p>{election.description}</p> : null}
      {election.status ? <p><strong>Status:</strong> {election.status}</p> : null}

      <hr style={{ margin: '16px 0' }} />

      <h3>Candidates</h3>

      {candidates.length === 0 ? (
        <p>No candidates found for this election.</p>
      ) : (
        <ul>
          {candidates.map((c, idx) => (
            <li key={c._id || idx} style={{ marginBottom: 10 }}>
              <strong>{c.name || c.fullName || `Candidate ${idx + 1}`}</strong>
              {c.position ? <div>Position: {c.position}</div> : null}
              {/* Voting comes next once backend vote endpoint is confirmed */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ElectionDetails;
