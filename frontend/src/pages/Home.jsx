import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../services/authService';
import { getAllElections } from '../services/electionService';

const Home = () => {
  const [user, setUser] = useState(null);
  const [elections, setElections] = useState([]);
  const [loadingElections, setLoadingElections] = useState(true);

  useEffect(() => {
    const fetchUserAndElections = async () => {
      try {
        // Fetch user
        const userRes = await getUserProfile();
        setUser(userRes.data);

        // Fetch elections
        const electionsRes = await getAllElections();
        setElections(Array.isArray(electionsRes) ? electionsRes : []);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoadingElections(false);
      }
    };

    fetchUserAndElections();
  }, []);

  if (!user) return <p>Loading user data...</p>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Welcome, {user.fullName}</h2>
      <p>Email: {user.email}</p>

      <hr style={{ margin: '16px 0' }} />

      <h3>Available Elections</h3>

      {loadingElections ? (
        <p>Loading elections...</p>
      ) : elections.length === 0 ? (
        <p>No elections available yet.</p>
      ) : (
        <ul>
          {elections.map((election) => (
            <li key={election._id} style={{ marginBottom: 10 }}>
              <strong>{election.title}</strong>
              {election.description ? <div>{election.description}</div> : null}
              {election.status ? <small>Status: {election.status}</small> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
