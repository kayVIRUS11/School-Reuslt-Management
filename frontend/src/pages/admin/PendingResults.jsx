import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { getPendingResults, approveResult, rejectResult } from '../../services/api';
import toast from 'react-hot-toast';

export default function PendingResults() {
  const [results, setResults] = useState([]);
  const load = () => getPendingResults().then(r => setResults(r.data));
  useEffect(() => { load(); }, []);

  const handleApprove = async (id) => {
    try { await approveResult(id); toast.success('Result approved'); load(); }
    catch { toast.error('Error'); }
  };
  const handleReject = async (id) => {
    try { await rejectResult(id); toast.success('Result rejected'); load(); }
    catch { toast.error('Error'); }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Pending Results Approval</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr>{['Student', 'Subject', 'Class', 'Term', 'CA1', 'CA2', 'CA3', 'Exam', 'Total', 'Grade', 'Staff', 'Actions'].map(h => <th key={h} className="text-left px-3 py-3 text-xs font-semibold text-gray-600">{h}</th>)}</tr></thead>
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
                <td className="px-3 py-3 text-xs"><span className={`px-2 py-0.5 rounded-full font-medium ${r.grade === 'A' ? 'bg-green-100 text-green-700' : r.grade === 'F' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{r.grade}</span></td>
                <td className="px-3 py-3 text-xs">{r.staff_name}</td>
                <td className="px-3 py-3 text-xs flex gap-1">
                  <button onClick={() => handleApprove(r.id)} className="px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs">✓ Approve</button>
                  <button onClick={() => handleReject(r.id)} className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs">✗ Reject</button>
                </td>
              </tr>
            ))}
            {results.length === 0 && <tr><td colSpan={12} className="px-4 py-8 text-center text-gray-400">No pending results</td></tr>}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
