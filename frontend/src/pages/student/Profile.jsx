import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { getStudentProfile } from '../../services/api';

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  useEffect(() => { getStudentProfile().then(r => setProfile(r.data)).catch(() => {}); }, []);

  if (!profile) return <Layout><div className="text-gray-500">Loading...</div></Layout>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-2xl">👤</div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{profile.first_name} {profile.last_name}</h2>
            <p className="text-gray-500 font-mono">{profile.reg_number}</p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            ['Registration Number', profile.reg_number],
            ['Class', profile.class_name || '—'],
            ['Guardian Name', profile.guardian_name || '—'],
            ['Guardian Phone', profile.guardian_phone || '—'],
          ].map(([label, value]) => (
            <div key={label} className="flex border-b border-gray-100 pb-3">
              <span className="w-40 text-sm text-gray-500">{label}</span>
              <span className="text-sm font-medium text-gray-800">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
