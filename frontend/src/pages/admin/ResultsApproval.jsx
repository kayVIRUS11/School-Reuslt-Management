import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle } from 'lucide-react';

export default function AdminResultsApproval() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/api/admin/results/pending')
      .then(r => setResults(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/api/admin/results/${id}/approve`);
      toast.success('Result approved');
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/api/admin/results/${id}/reject`);
      toast.success('Result rejected');
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error');
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Results Approval</h2>
        <p className="text-gray-500 mt-1">Review and approve submitted results</p>
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
                <th className="px-6 py-3 text-left">CA1</th>
                <th className="px-6 py-3 text-left">CA2</th>
                <th className="px-6 py-3 text-left">Exam</th>
                <th className="px-6 py-3 text-left">Total</th>
                <th className="px-6 py-3 text-left">Grade</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {results.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{r.student_name}</td>
                  <td className="px-6 py-4">{r.subject_name}</td>
                  <td className="px-6 py-4">{r.class_name}</td>
                  <td className="px-6 py-4">{r.term_name}</td>
                  <td className="px-6 py-4">{r.ca1 ?? '-'}</td>
                  <td className="px-6 py-4">{r.ca2 ?? '-'}</td>
                  <td className="px-6 py-4">{r.exam ?? '-'}</td>
                  <td className="px-6 py-4 font-semibold">{r.total ?? '-'}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-indigo-600">{r.grade ?? '-'}</span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => handleApprove(r.id)} className="flex items-center gap-1 text-green-600 hover:text-green-800 border border-green-300 px-2 py-1 rounded text-xs">
                      <CheckCircle size={14} /> Approve
                    </button>
                    <button onClick={() => handleReject(r.id)} className="flex items-center gap-1 text-red-500 hover:text-red-700 border border-red-300 px-2 py-1 rounded text-xs">
                      <XCircle size={14} /> Reject
                    </button>
                  </td>
                </tr>
              ))}
              {results.length === 0 && <tr><td colSpan={10} className="px-6 py-8 text-center text-gray-400">No pending results</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
