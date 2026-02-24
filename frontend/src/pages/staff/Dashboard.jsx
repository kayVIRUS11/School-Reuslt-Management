import { useEffect, useState } from 'react';
import StaffLayout from '../../components/StaffLayout';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ClipboardList, FileText } from 'lucide-react';

export default function StaffDashboard() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    api.get('/api/staff/assignments').then(r => setAssignments(r.data)).catch(() => {});
  }, []);

  return (
    <StaffLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Welcome, {user?.first_name}!</h2>
        <p className="text-gray-500 mt-1">Staff Portal</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="inline-flex p-3 rounded-lg text-white mb-4 bg-indigo-500">
            <ClipboardList size={24} />
          </div>
          <div className="text-3xl font-bold text-gray-800">{assignments.length}</div>
          <div className="text-gray-500 text-sm mt-1">My Assignments</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <div className="inline-flex p-3 rounded-lg text-white mb-4 bg-green-500">
            <FileText size={24} />
          </div>
          <div className="text-3xl font-bold text-gray-800">-</div>
          <div className="text-gray-500 text-sm mt-1">Results Submitted</div>
        </div>
      </div>
      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">My Current Assignments</h3>
        {assignments.length > 0 ? (
          <div className="space-y-3">
            {assignments.slice(0, 5).map(a => (
              <div key={a.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-800">{a.subject_name}</span>
                  <span className="text-gray-500 text-sm ml-2">— {a.class_name}</span>
                </div>
                <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{a.session_name}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No assignments yet</p>
        )}
      </div>
    </StaffLayout>
  );
}
