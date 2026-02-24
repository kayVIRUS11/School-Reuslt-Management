import { useEffect, useState } from 'react';
import StudentLayout from '../../components/StudentLayout';
import api from '../../services/api';
import { User } from 'lucide-react';

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/student/profile')
      .then(r => setProfile(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <StudentLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
      </div>
      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading...</div>
      ) : profile ? (
        <div className="bg-white rounded-xl shadow p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
              <User size={40} className="text-indigo-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{profile.first_name} {profile.last_name}</h3>
              <p className="text-gray-500">{profile.reg_number}</p>
              <span className="inline-block mt-1 bg-indigo-100 text-indigo-700 text-sm px-3 py-0.5 rounded-full">{profile.class_name || 'No Class'}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700 border-b pb-2">Personal Information</h4>
              <div>
                <p className="text-sm text-gray-500">First Name</p>
                <p className="font-medium text-gray-800">{profile.first_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Name</p>
                <p className="font-medium text-gray-800">{profile.last_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Registration Number</p>
                <p className="font-medium font-mono text-gray-800">{profile.reg_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Class</p>
                <p className="font-medium text-gray-800">{profile.class_name || '-'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700 border-b pb-2">Guardian Information</h4>
              <div>
                <p className="text-sm text-gray-500">Guardian Name</p>
                <p className="font-medium text-gray-800">{profile.guardian_name || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Guardian Phone</p>
                <p className="font-medium text-gray-800">{profile.guardian_phone || '-'}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">Profile not found</div>
      )}
    </StudentLayout>
  );
}
