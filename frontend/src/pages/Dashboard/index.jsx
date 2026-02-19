import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getUserProfile } from '../../services/authService';
import AdminDashboard from './AdminDashboard';
import VoterDashboard from './VoterDashboard';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await getUserProfile();
        setRole(res.data?.role || 'voter');
      } catch {
        setRole(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (!role) return <Navigate to="/login" replace />;

  if (role === 'admin' || role === 'superadmin') return <AdminDashboard />;
  return <VoterDashboard />;
};

export default Dashboard;
