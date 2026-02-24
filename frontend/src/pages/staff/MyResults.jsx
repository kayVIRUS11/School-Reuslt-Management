import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { getStaffResults, getStaffTerms, getStaffClasses, getStaffSubjects } from '../../services/api';

const STATUS_COLORS = { draft: 'bg-gray-100 text-gray-600', submitted: 'bg-yellow-100 text-yellow-700', approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700' };

export default function MyResults() {
  const [results, setResults] = useState([]);
  const [terms, setTerms] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filters, setFilters] = useState({ term_id: '', class_id: '', subject_id: '' });

  useEffect(() => {
    getStaffTerms().then(r => setTerms(r.data));
    getStaffClasses().then(r => setClasses(r.data));
    getStaffSubjects().then(r => setSubjects(r.data));
  }, []);

  useEffect(() => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    getStaffResults(params).then(r => setResults(r.data)).catch(() => {});
  }, [filters]);

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Results</h1>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <select value={filters.term_id} onChange={e => setFilters({...filters, term_id: e.target.value})} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"><option value="">All Terms</option>{terms.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
        <select value={filters.class_id} onChange={e => setFilters({...filters, class_id: e.target.value})} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"><option value="">All Classes</option>{classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <select value={filters.subject_id} onChange={e => setFilters({...filters, subject_id: e.target.value})} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"><option value="">All Subjects</option>{subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50"><tr>{['Student', 'Subject', 'Class', 'Term', 'CA1', 'CA2', 'CA3', 'Exam', 'Total', 'Grade', 'Status'].map(h => <th key={h} className="text-left px-3 py-3 text-xs font-semibold text-gray-600">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-100">
            {results.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-3 py-3 text-xs">{r.student_name}<br/><span className="text-gray-400">{r.reg_number}</span></td>
                <td className="px-3 py-3 text-xs">{r.subject_name}</td>
                <td className="px-3 py-3 text-xs">{r.class_name}</td>
                <td className="px-3 py-3 text-xs">{r.term_name}</td>
                <td className="px-3 py-3 text-xs">{r.ca1}</td>
                <td className="px-3 py-3 text-xs">{r.ca2}</td>
                <td className="px-3 py-3 text-xs">{r.ca3}</td>
                <td className="px-3 py-3 text-xs">{r.exam}</td>
                <td className="px-3 py-3 text-xs font-bold">{r.total}</td>
                <td className="px-3 py-3 text-xs">{r.grade}</td>
                <td className="px-3 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[r.status]}`}>{r.status}</span></td>
              </tr>
            ))}
            {results.length === 0 && <tr><td colSpan={11} className="px-4 py-8 text-center text-gray-400">No results yet</td></tr>}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
