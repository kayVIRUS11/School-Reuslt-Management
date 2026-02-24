import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { getMyAssignments, getClassStudents, getTerms, enterResults, submitResults } from '../../services/api';
import toast from 'react-hot-toast';

function calcGrade(total) {
  if (total >= 70) return { grade: 'A', remark: 'Excellent' };
  if (total >= 60) return { grade: 'B', remark: 'Very Good' };
  if (total >= 50) return { grade: 'C', remark: 'Good' };
  if (total >= 45) return { grade: 'D', remark: 'Fair' };
  if (total >= 40) return { grade: 'E', remark: 'Pass' };
  return { grade: 'F', remark: 'Fail' };
}

export default function EnterResults() {
  const [assignments, setAssignments] = useState([]);
  const [terms, setTerms] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [currentTerm, setCurrentTerm] = useState(null);
  const [students, setStudents] = useState([]);
  const [scores, setScores] = useState({});
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    getMyAssignments().then(r => setAssignments(r.data));
    getTerms().then(r => { setTerms(r.data); const cur = r.data.find(t => t.is_current); if (cur) setCurrentTerm(cur); });
  }, []);

  const assignment = assignments.find(a => String(a.id) === selectedAssignment);

  useEffect(() => {
    if (assignment) {
      getClassStudents(assignment.class_id).then(r => {
        setStudents(r.data);
        const init = {};
        r.data.forEach(s => { init[s.id] = { ca1: '', ca2: '', ca3: '', exam: '' }; });
        setScores(init);
        setSavedIds([]);
      });
    }
  }, [selectedAssignment]);

  const update = (studentId, field, value) => {
    setScores(prev => ({ ...prev, [studentId]: { ...prev[studentId], [field]: value } }));
  };

  const getTotal = (s) => {
    const v = scores[s.id] || {};
    return (parseFloat(v.ca1) || 0) + (parseFloat(v.ca2) || 0) + (parseFloat(v.ca3) || 0) + (parseFloat(v.exam) || 0);
  };

  const handleSave = async () => {
    if (!assignment || !currentTerm) { toast.error('Select assignment and ensure a current term is set'); return; }
    const resultsData = students.map(s => ({
      student_id: s.id,
      subject_id: assignment.subject_id,
      class_id: assignment.class_id,
      session_id: currentTerm.session_id,
      term_id: currentTerm.id,
      ca1: parseFloat(scores[s.id]?.ca1) || 0,
      ca2: parseFloat(scores[s.id]?.ca2) || 0,
      ca3: parseFloat(scores[s.id]?.ca3) || 0,
      exam: parseFloat(scores[s.id]?.exam) || 0,
    }));
    try {
      const res = await enterResults({ results: resultsData });
      setSavedIds(res.data.map(r => r.id));
      toast.success('Results saved as draft');
    } catch (err) { toast.error(err.response?.data?.error || 'Error saving results'); }
  };

  const handleSubmit = async () => {
    if (savedIds.length === 0) { toast.error('Save results first'); return; }
    try {
      await submitResults({ result_ids: savedIds });
      toast.success('Results submitted for approval');
      setSavedIds([]);
    } catch (err) { toast.error('Error submitting'); }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Enter Results</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Assignment</label>
            <select value={selectedAssignment} onChange={e => setSelectedAssignment(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Choose subject & class</option>
              {assignments.map(a => <option key={a.id} value={a.id}>{a.subject_name} — {a.class_name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Term</label>
            {currentTerm
              ? <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">{currentTerm.name} ({currentTerm.session_name})</p>
              : <p className="px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">No current term set</p>
            }
          </div>
        </div>
      </div>

      {students.length > 0 && (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto mb-4">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Student</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Reg No.</th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600">CA1 (10)</th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600">CA2 (10)</th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600">CA3 (10)</th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600">Exam (70)</th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600">Total</th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600">Grade</th>
                  <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600">Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map(s => {
                  const total = getTotal(s);
                  const { grade, remark } = calcGrade(total);
                  return (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm">{s.first_name} {s.last_name}</td>
                      <td className="px-4 py-2 text-sm font-mono">{s.reg_number}</td>
                      {['ca1','ca2','ca3','exam'].map(f => (
                        <td key={f} className="px-2 py-2">
                          <input
                            type="number"
                            min="0"
                            max={f === 'exam' ? 70 : 10}
                            step="0.5"
                            value={scores[s.id]?.[f] ?? ''}
                            onChange={e => update(s.id, f, e.target.value)}
                            className="w-16 border border-gray-300 rounded px-2 py-1 text-center text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </td>
                      ))}
                      <td className="px-4 py-2 text-center font-bold text-sm">{total.toFixed(1)}</td>
                      <td className="px-4 py-2 text-center"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${grade === 'A' ? 'bg-green-100 text-green-700' : grade === 'F' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{grade}</span></td>
                      <td className="px-4 py-2 text-center text-xs text-gray-600">{remark}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={handleSave} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save Draft</button>
            <button onClick={handleSubmit} disabled={savedIds.length === 0} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">Submit for Approval</button>
          </div>
        </>
      )}
    </Layout>
  );
}
