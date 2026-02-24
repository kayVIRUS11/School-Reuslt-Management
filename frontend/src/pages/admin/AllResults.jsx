import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

const STATUS_COLORS = {
  approved: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  rejected: 'bg-red-100 text-red-700',
  draft: 'bg-gray-100 text-gray-600',
  submitted: 'bg-blue-100 text-blue-700',
};

export default function AdminAllResults() {
  const [results, setResults] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [filters, setFilters] = useState({ class_id: '', subject_id: '', session_id: '', status: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/api/admin/classes').then(r => setClasses(r.data));
    api.get('/api/admin/subjects').then(r => setSubjects(r.data));
    api.get('/api/admin/sessions').then(r => setSessions(r.data));
    loadResults();
  }, []);

  const loadResults = (f = filters) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (f.class_id) params.append('class_id', f.class_id);
    if (f.subject_id) params.append('subject_id', f.subject_id);
    if (f.session_id) params.append('session_id', f.session_id);
    if (f.status) params.append('status', f.status);
    api.get(`/api/admin/results?${params}`)
      .then(r => setResults(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleFilterChange = (key, val) => {
    const newFilters = { ...filters, [key]: val };
    setFilters(newFilters);
    loadResults(newFilters);
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Results</h2>
      </div>
      <div className="bg-white rounded-xl shadow p-4 mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <select value={filters.class_id} onChange={e => handleFilterChange('class_id', e.target.value)} className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">All Classes</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={filters.subject_id} onChange={e => handleFilterChange('subject_id', e.target.value)} className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">All Subjects</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={filters.session_id} onChange={e => handleFilterChange('session_id', e.target.value)} className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">All Sessions</option>
          {sessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={filters.status} onChange={e => handleFilterChange('status', e.target.value)} className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="submitted">Submitted</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
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
    </AdminLayout>
  );
}
