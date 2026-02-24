import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { getStudentResults } from '../../services/api';

export default function StudentResults() {
  const [data, setData] = useState({ results: [], terms: [], sessions: [] });
  const [filters, setFilters] = useState({ term_id: '', session_id: '' });

  useEffect(() => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    getStudentResults(params).then(r => setData(r.data)).catch(() => {});
  }, [filters]);

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Results</h1>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <select value={filters.session_id} onChange={e => setFilters({...filters, session_id: e.target.value})} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"><option value="">All Sessions</option>{data.sessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
        <select value={filters.term_id} onChange={e => setFilters({...filters, term_id: e.target.value})} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"><option value="">All Terms</option>{data.terms.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50"><tr>{['Subject', 'Term', 'Session', 'CA1', 'CA2', 'CA3', 'Exam', 'Total', 'Grade', 'Remark'].map(h => <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-600">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-100">
            {data.results.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium">{r.subject_name}</td>
                <td className="px-4 py-3 text-sm">{r.term_name}</td>
                <td className="px-4 py-3 text-sm">{r.session_name}</td>
                <td className="px-4 py-3 text-sm">{r.ca1}</td>
                <td className="px-4 py-3 text-sm">{r.ca2}</td>
                <td className="px-4 py-3 text-sm">{r.ca3}</td>
                <td className="px-4 py-3 text-sm">{r.exam}</td>
                <td className="px-4 py-3 text-sm font-bold">{r.total}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${r.grade === 'A' ? 'bg-green-100 text-green-700' : r.grade === 'F' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{r.grade}</span></td>
                <td className="px-4 py-3 text-sm">{r.remark}</td>
              </tr>
            ))}
            {data.results.length === 0 && <tr><td colSpan={10} className="px-4 py-8 text-center text-gray-400">No approved results yet</td></tr>}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
