import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import { Users, UserSquare2, Clock, School } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    api.get('/api/admin/stats').then(res => setStats(res.data)).catch(() => {});
  }, []);

  const cards = [
    { label: 'Total Students', value: stats.total_students ?? 0, icon: <Users size={24} />, color: 'bg-blue-500' },
    { label: 'Total Staff', value: stats.total_staff ?? 0, icon: <UserSquare2 size={24} />, color: 'bg-green-500' },
    { label: 'Pending Approvals', value: stats.pending_results ?? 0, icon: <Clock size={24} />, color: 'bg-yellow-500' },
    { label: 'Total Classes', value: stats.total_classes ?? 0, icon: <School size={24} />, color: 'bg-purple-500' },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-500 mt-1">Welcome to the School Result Management System</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(card => (
          <div key={card.label} className="bg-white rounded-xl shadow p-6">
            <div className={`inline-flex p-3 rounded-lg text-white mb-4 ${card.color}`}>
              {card.icon}
            </div>
            <div className="text-3xl font-bold text-gray-800">{card.value}</div>
            <div className="text-gray-500 text-sm mt-1">{card.label}</div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
