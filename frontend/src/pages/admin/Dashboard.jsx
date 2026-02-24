import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import StatCard from '../../components/StatCard';
import { getAdminStats } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    getAdminStats().then(res => setStats(res.data)).catch(() => {});
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
      <p className="text-gray-500 mb-8">Welcome back, {user?.first_name}!</p>
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Students" value={stats.total_students} color="indigo" />
          <StatCard title="Total Staff" value={stats.total_staff} color="blue" />
          <StatCard title="Pending Results" value={stats.pending_results} color="yellow" />
          <StatCard title="Total Classes" value={stats.total_classes} color="green" />
        </div>
      )}
    </Layout>
  );
}
