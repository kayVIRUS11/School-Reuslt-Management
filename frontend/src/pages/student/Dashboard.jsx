import { useEffect, useState } from 'react';
import StudentLayout from '../../components/StudentLayout';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FileText, User } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get('/api/student/profile').then(r => setProfile(r.data)).catch(() => {});
  }, []);

  return (
    <StudentLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Welcome, {user?.first_name}!</h2>
        <p className="text-gray-500 mt-1">Student Portal</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="inline-flex p-3 rounded-lg text-white mb-4 bg-indigo-500">
            <User size={24} />
          </div>
          <div className="text-lg font-semibold text-gray-800">{profile?.class_name || '-'}</div>
          <div className="text-gray-500 text-sm mt-1">Current Class</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <div className="inline-flex p-3 rounded-lg text-white mb-4 bg-green-500">
            <FileText size={24} />
          </div>
          <div className="text-lg font-semibold text-gray-800">{profile?.reg_number || '-'}</div>
          <div className="text-gray-500 text-sm mt-1">Registration Number</div>
        </div>
      </div>
      {profile && (
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">My Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Full Name</p>
              <p className="font-medium">{profile.first_name} {profile.last_name}</p>
            </div>
            <div>
              <p className="text-gray-500">Guardian</p>
              <p className="font-medium">{profile.guardian_name || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500">Guardian Phone</p>
              <p className="font-medium">{profile.guardian_phone || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500">Class</p>
              <p className="font-medium">{profile.class_name || '-'}</p>
            </div>
          </div>
        </div>
      )}
    </StudentLayout>
  );
}
