import { useEffect, useState } from 'react';
import StaffLayout from '../../components/StaffLayout';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Save, Send } from 'lucide-react';

function getGrade(total) {
  if (total >= 70) return 'A';
  if (total >= 60) return 'B';
  if (total >= 50) return 'C';
  if (total >= 45) return 'D';
  if (total >= 40) return 'E';
  return 'F';
}

function getRemark(grade) {
  const remarks = { A: 'Excellent', B: 'Very Good', C: 'Good', D: 'Pass', E: 'Poor', F: 'Fail' };
  return remarks[grade] || '';
}

export default function StaffEnterResults() {
  const [assignments, setAssignments] = useState([]);
  const [terms, setTerms] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/api/staff/assignments').then(r => setAssignments(r.data));
  }, []);

  useEffect(() => {
    if (selectedAssignment) {
      const asgn = assignments.find(a => parseInt(a.id) === parseInt(selectedAssignment));
      if (asgn) {
        api.get(`/api/admin/sessions`).then(r => {
          const session = r.data.find(s => s.name === asgn.session_name);
          if (session) setTerms(session.terms || []);
        });
        loadStudents(asgn);
      }
    }
  }, [selectedAssignment]);

  const loadStudents = async (asgn) => {
    setLoading(true);
    try {
      const r = await api.get(`/api/staff/students?class_id=${asgn.class_id}`);
      setStudents(r.data);
      const initScores = {};
      r.data.forEach(s => { initScores[s.id] = { ca1: '', ca2: '', ca3: '', exam: '' }; });
      setScores(initScores);
    } catch {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (studentId, field, value) => {
    setScores(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value }
    }));
  };

  const calcTotal = (s) => {
    const ca1 = parseFloat(s.ca1) || 0;
    const ca2 = parseFloat(s.ca2) || 0;
    const ca3 = parseFloat(s.ca3) || 0;
    const exam = parseFloat(s.exam) || 0;
    return ca1 + ca2 + ca3 + exam;
  };

  const handleSave = async (submit = false) => {
    if (!selectedAssignment || !selectedTerm) {
      toast.error('Please select assignment and term');
      return;
    }
    setSaving(true);
    try {
      const payload = students.map(s => ({
        student_id: s.id,
        assignment_id: parseInt(selectedAssignment),
        term_id: parseInt(selectedTerm),
        ca1: parseFloat(scores[s.id]?.ca1) || null,
        ca2: parseFloat(scores[s.id]?.ca2) || null,
        ca3: parseFloat(scores[s.id]?.ca3) || null,
        exam: parseFloat(scores[s.id]?.exam) || null,
      }));
      await api.post('/api/staff/results', { results: payload, submit });
      toast.success(submit ? 'Results submitted for approval' : 'Results saved as draft');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error saving results');
    } finally {
      setSaving(false);
    }
  };

  return (
    <StaffLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Enter Results</h2>
      </div>
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assignment (Class + Subject)</label>
            <select value={selectedAssignment} onChange={e => setSelectedAssignment(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Select assignment</option>
              {assignments.map(a => <option key={a.id} value={a.id}>{a.subject_name} — {a.class_name} ({a.session_name})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
            <select value={selectedTerm} onChange={e => setSelectedTerm(e.target.value)} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Select term</option>
              {terms.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading students...</div>
      ) : students.length > 0 ? (
        <>
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left">Student</th>
                  <th className="px-4 py-3 text-left">CA1 (30)</th>
                  <th className="px-4 py-3 text-left">CA2 (30)</th>
                  <th className="px-4 py-3 text-left">CA3 (10)</th>
                  <th className="px-4 py-3 text-left">Exam (30)</th>
                  <th className="px-4 py-3 text-left">Total</th>
                  <th className="px-4 py-3 text-left">Grade</th>
                  <th className="px-4 py-3 text-left">Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map(student => {
                  const s = scores[student.id] || {};
                  const total = calcTotal(s);
                  const grade = total > 0 ? getGrade(total) : '-';
                  const remark = total > 0 ? getRemark(grade) : '-';
                  return (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{student.first_name} {student.last_name}</td>
                      {['ca1', 'ca2', 'ca3', 'exam'].map(field => (
                        <td key={field} className="px-4 py-2">
                          <input
                            type="number"
                            min="0"
                            max={field === 'ca3' ? 10 : 30}
                            value={s[field] || ''}
                            onChange={e => handleScoreChange(student.id, field, e.target.value)}
                            className="w-16 border rounded px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </td>
                      ))}
                      <td className="px-4 py-3 font-semibold">{total > 0 ? total : '-'}</td>
                      <td className="px-4 py-3 font-semibold text-indigo-600">{grade}</td>
                      <td className="px-4 py-3 text-gray-500">{remark}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex gap-4 mt-6">
            <button onClick={() => handleSave(false)} disabled={saving} className="flex items-center gap-2 bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50">
              <Save size={18} /> Save Draft
            </button>
            <button onClick={() => handleSave(true)} disabled={saving} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              <Send size={18} /> Submit for Approval
            </button>
          </div>
        </>
      ) : selectedAssignment ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">No students found in this class</div>
      ) : null}
    </StaffLayout>
  );
}
