import { useEffect, useState } from 'react';
import StudentLayout from '../../components/StudentLayout';
import api from '../../services/api';

const GRADE_COLORS = {
  A: 'text-green-600', B: 'text-blue-600', C: 'text-indigo-600',
  D: 'text-yellow-600', E: 'text-orange-600', F: 'text-red-600',
};

export default function StudentResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/student/results')
      .then(r => setResults(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const grouped = results.reduce((acc, r) => {
    const key = `${r.session_name} — ${r.term_name}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  return (
    <StudentLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Results</h2>
        <p className="text-gray-500 mt-1">Your academic results</p>
      </div>
      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading...</div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">No results available yet</div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([period, periodResults]) => (
            <div key={period} className="bg-white rounded-xl shadow overflow-hidden">
              <div className="bg-indigo-600 px-6 py-4">
                <h3 className="text-white font-semibold text-lg">{period}</h3>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left">Subject</th>
                    <th className="px-6 py-3 text-left">CA1</th>
                    <th className="px-6 py-3 text-left">CA2</th>
                    <th className="px-6 py-3 text-left">CA3</th>
                    <th className="px-6 py-3 text-left">Exam</th>
                    <th className="px-6 py-3 text-left">Total</th>
                    <th className="px-6 py-3 text-left">Grade</th>
                    <th className="px-6 py-3 text-left">Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {periodResults.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{r.subject_name}</td>
                      <td className="px-6 py-4">{r.ca1 ?? '-'}</td>
                      <td className="px-6 py-4">{r.ca2 ?? '-'}</td>
                      <td className="px-6 py-4">{r.ca3 ?? '-'}</td>
                      <td className="px-6 py-4">{r.exam ?? '-'}</td>
                      <td className="px-6 py-4 font-semibold">{r.total ?? '-'}</td>
                      <td className={`px-6 py-4 font-bold text-lg ${GRADE_COLORS[r.grade] || 'text-gray-600'}`}>{r.grade ?? '-'}</td>
                      <td className="px-6 py-4 text-gray-500">{r.remark ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={5} className="px-6 py-3 text-right font-semibold text-gray-600">Average Total:</td>
                    <td className="px-6 py-3 font-bold text-indigo-600">
                      {(periodResults.reduce((s, r) => s + (r.total || 0), 0) / periodResults.length).toFixed(1)}
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ))}
        </div>
      )}
    </StudentLayout>
  );
}
