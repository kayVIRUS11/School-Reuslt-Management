import { useEffect, useState } from 'react';
import StaffLayout from '../../components/StaffLayout';
import api from '../../services/api';

const STATUS_COLORS = {
  approved: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  rejected: 'bg-red-100 text-red-700',
  draft: 'bg-gray-100 text-gray-600',
  submitted: 'bg-blue-100 text-blue-700',
};

export default function StaffMyResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/staff/results')
      .then(r => setResults(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <StaffLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Results</h2>
        <p className="text-gray-500 mt-1">Results you have entered</p>
      </div>
      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left">Student</th>
                <th className="px-6 py-3 text-left">Subject</th>
                <th className="px-6 py-3 text-left">Class</th>
                <th className="px-6 py-3 text-left">Term</th>
                <th className="px-6 py-3 text-left">Total</th>
                <th className="px-6 py-3 text-left">Grade</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {results.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{r.student_name}</td>
                  <td className="px-6 py-4">{r.subject_name}</td>
                  <td className="px-6 py-4">{r.class_name}</td>
                  <td className="px-6 py-4">{r.term_name}</td>
                  <td className="px-6 py-4 font-semibold">{r.total ?? '-'}</td>
                  <td className="px-6 py-4 font-semibold text-indigo-600">{r.grade ?? '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[r.status] || 'bg-gray-100 text-gray-600'}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
              {results.length === 0 && <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">No results found</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </StaffLayout>
  );
}
