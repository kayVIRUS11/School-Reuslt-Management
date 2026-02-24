import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';

export default function StudentDashboard() {
  const { user } = useAuth();
  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Student Dashboard</h1>
      <p className="text-gray-500 mb-8">Welcome, {user?.first_name} {user?.last_name}!</p>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center max-w-lg">
        <div className="text-5xl mb-4">🎓</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">School Result Management System</h2>
        <p className="text-gray-500">View your academic results from the sidebar navigation.</p>
      </div>
    </Layout>
  );
}
