import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from '../../services/authService';
import { getAllElections } from '../../services/electionService';

const VoterDashboard = () => {
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
        alert('Failed to load voter dashboard');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  if (loading) return <p>Loading voter dashboard...</p>;
  if (!user) return <p>Unable to load profile.</p>;

  const activeElections = elections.filter(e => e.status === 'active');
  const closedElections = elections.filter(e => e.status === 'closed');

  return (
    <div style={{ padding: 16 }}>
      <h2>Voter Dashboard</h2>
      <p><strong>Welcome, {user.fullName}</strong></p>
      <p>Email: {user.email}</p>

      <hr style={{ margin: '16px 0' }} />

      <h3>Active Elections</h3>
      {activeElections.length === 0 ? (
        <p>No active elections right now.</p>
      ) : (
        <ul>
          {activeElections.map((e) => (
            <li key={e._id} style={{ marginBottom: 10 }}>
              <strong>{e.title}</strong>
              <div>
                <button onClick={() => navigate(`/elections/${e._id}`)}>Open</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <hr style={{ margin: '16px 0' }} />

      <h3>Closed Elections (Results)</h3>
      {closedElections.length === 0 ? (
        <p>No closed elections yet.</p>
      ) : (
        <ul>
          {closedElections.map((e) => (
            <li key={e._id} style={{ marginBottom: 10 }}>
              <strong>{e.title}</strong>
              <div>
                <button onClick={() => navigate(`/elections/${e._id}/results`)}>View Results</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VoterDashboard;
