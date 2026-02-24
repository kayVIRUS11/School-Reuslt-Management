import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { getMyAssignments } from '../../services/api';

export default function MyAssignments() {
  const [assignments, setAssignments] = useState([]);
  useEffect(() => { getMyAssignments().then(r => setAssignments(r.data)); }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Assignments</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr>{['Subject', 'Code', 'Class', 'Session'].map(h => <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-600">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-100">
            {assignments.map(a => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{a.subject_name}</td>
                <td className="px-4 py-3 text-sm font-mono">{a.subject_code}</td>
                <td className="px-4 py-3 text-sm">{a.class_name}</td>
                <td className="px-4 py-3 text-sm">{a.session_name}</td>
              </tr>
            ))}
            {assignments.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No assignments yet</td></tr>}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
