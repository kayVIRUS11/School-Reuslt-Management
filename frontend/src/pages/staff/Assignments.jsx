import { useEffect, useState } from 'react';
import StaffLayout from '../../components/StaffLayout';
import api from '../../services/api';

export default function StaffAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/staff/assignments')
      .then(r => setAssignments(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <StaffLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Assignments</h2>
        <p className="text-gray-500 mt-1">Subjects assigned to you</p>
      </div>
      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left">Subject</th>
                <th className="px-6 py-3 text-left">Class</th>
                <th className="px-6 py-3 text-left">Session</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {assignments.map(a => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{a.subject_name}</td>
                  <td className="px-6 py-4">{a.class_name}</td>
                  <td className="px-6 py-4">{a.session_name}</td>
                </tr>
              ))}
              {assignments.length === 0 && <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-400">No assignments found</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </StaffLayout>
  );
}
