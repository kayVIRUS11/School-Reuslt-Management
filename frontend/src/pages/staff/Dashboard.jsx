import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import StatCard from '../../components/StatCard';
import { getStaffStats } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function StaffDashboard() {
  const [stats, setStats] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    getStaffStats().then(r => setStats(r.data)).catch(() => {});
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Staff Dashboard</h1>
      <p className="text-gray-500 mb-8">Welcome, {user?.first_name} {user?.last_name}</p>
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="My Assignments" value={stats.assignments} color="indigo" />
          <StatCard title="Draft Results" value={stats.draft_results} color="yellow" />
          <StatCard title="Submitted" value={stats.submitted_results} color="blue" />
          <StatCard title="Approved" value={stats.approved_results} color="green" />
        </div>
      )}
    </Layout>
  );
}
