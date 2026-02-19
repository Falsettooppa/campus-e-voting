import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from '../../services/authService';
import { getAllElections } from '../../services/electionService';

const AdminDashboard = () => {
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
        alert('Failed to load admin dashboard');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  if (loading) return <p>Loading admin dashboard...</p>;
  if (!user) return <p>Unable to load profile.</p>;

  const total = elections.length;
  const upcoming = elections.filter(e => e.status === 'upcoming').length;
  const active = elections.filter(e => e.status === 'active').length;
  const closed = elections.filter(e => e.status === 'closed').length;

  return (
    <div style={{ padding: 16 }}>
      <h2>Admin Dashboard</h2>
      <p><strong>{user.fullName}</strong> ({user.role})</p>

      <div style={{ marginTop: 12 }}>
        <button onClick={() => navigate('/admin/create-election')}>Create Election</button>
      </div>

      <hr style={{ margin: '16px 0' }} />

      <h3>Overview</h3>
      <ul>
        <li>Total Elections: {total}</li>
        <li>Upcoming: {upcoming}</li>
        <li>Active: {active}</li>
        <li>Closed: {closed}</li>
      </ul>

      <hr style={{ margin: '16px 0' }} />

      <h3>Recent Elections</h3>
      {elections.length === 0 ? (
        <p>No elections yet.</p>
      ) : (
        <ul>
          {elections.slice(0, 8).map((e) => (
            <li key={e._id} style={{ marginBottom: 10 }}>
              <strong>{e.title}</strong> — <small>{e.status}</small>
              <div>
                <button onClick={() => navigate(`/elections/${e._id}`)}>Manage</button>
                {' '}
                {e.status === 'closed' && (
                  <button onClick={() => navigate(`/elections/${e._id}/results`)}>Results</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminDashboard;
