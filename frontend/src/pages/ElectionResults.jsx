import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getElectionResults } from '../services/electionService';

const ElectionResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadResults = async () => {
      try {
        const res = await getElectionResults(id);
        setData(res);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load results');
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [id]);

  if (loading) return <p>Loading results...</p>;
  if (error) return <p>{error}</p>;
  if (!data) return null;

  return (
    <div style={{ padding: 16 }}>
      <button onClick={() => navigate(-1)}>Back</button>

      <h2 style={{ marginTop: 12 }}>{data.election.title} — Results</h2>

      <p><strong>Total Votes:</strong> {data.totalVotes}</p>

      <hr style={{ margin: '16px 0' }} />

      <h3>Candidates</h3>

      <ul>
        {data.results.map((r) => (
          <li key={r.candidateId} style={{ marginBottom: 10 }}>
            <strong>{r.name}</strong>
            <div>Votes: {r.votes}</div>
            <div>Percentage: {r.percentage}%</div>
          </li>
        ))}
      </ul>

      <hr style={{ margin: '16px 0' }} />

      <h3>Winner{data.winners.length > 1 ? 's' : ''}</h3>

      {data.winners.length === 0 ? (
        <p>No votes cast.</p>
      ) : (
        <ul>
          {data.winners.map((w) => (
            <li key={w.candidateId}>
              🏆 <strong>{w.name}</strong> ({w.votes} votes)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ElectionResults;
