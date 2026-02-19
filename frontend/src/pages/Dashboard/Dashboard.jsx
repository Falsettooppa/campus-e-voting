import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../../services/authService';
import AdminDashboard from './AdminDashboard';
import VoterDashboard from './VoterDashboard';

const Dashboard = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await getUserProfile();
        setRole(res.data?.role || 'voter');
      } catch (e) {
        setRole('voter');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-600">Loading dashboard…</p>
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = role === 'admin' || role === 'superadmin';
  return isAdmin ? <AdminDashboard /> : <VoterDashboard />;
};

export default Dashboard;
