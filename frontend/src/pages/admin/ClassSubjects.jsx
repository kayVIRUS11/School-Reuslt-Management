import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { getClasses, getSubjects, getClassSubjects, addClassSubject, deleteClassSubject } from '../../services/api';
import toast from 'react-hot-toast';

export default function ClassSubjects() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [classSubjects, setClassSubjects] = useState([]);
  const [subjectToAdd, setSubjectToAdd] = useState('');

  useEffect(() => {
    getClasses().then(r => setClasses(r.data));
    getSubjects().then(r => setSubjects(r.data));
  }, []);

  useEffect(() => {
    if (selectedClass) {
      getClassSubjects(selectedClass).then(r => setClassSubjects(r.data));
    } else {
      setClassSubjects([]);
    }
  }, [selectedClass]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!subjectToAdd) { toast.error('Select a subject'); return; }
    try {
      await addClassSubject({ class_id: parseInt(selectedClass), subject_id: parseInt(subjectToAdd) });
      toast.success('Subject added to class');
      setSubjectToAdd('');
      getClassSubjects(selectedClass).then(r => setClassSubjects(r.data));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error adding subject');
    }
  };

  const handleRemove = async (id) => {
    if (!confirm('Remove this subject from class?')) return;
    try {
      await deleteClassSubject(id);
      toast.success('Subject removed');
      getClassSubjects(selectedClass).then(r => setClassSubjects(r.data));
    } catch (err) {
      toast.error('Error removing subject');
    }
  };

  const assignedSubjectIds = classSubjects.map(cs => cs.subject_id);
  const availableSubjects = subjects.filter(s => !assignedSubjectIds.includes(s.id));

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Class Subjects</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Class</label>
        <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">Choose a class</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {selectedClass && (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Assign Subject to Class</h2>
            <form onSubmit={handleAdd} className="flex gap-3">
              <select value={subjectToAdd} onChange={e => setSubjectToAdd(e.target.value)} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select subject to add</option>
                {availableSubjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
              </select>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Add Subject</button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['Subject', 'Code', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-600">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {classSubjects.map(cs => (
                  <tr key={cs.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{cs.subject_name}</td>
                    <td className="px-4 py-3 text-sm font-mono">{cs.subject_code}</td>
                    <td className="px-4 py-3 text-sm">
                      <button onClick={() => handleRemove(cs.id)} className="text-red-500 hover:underline">Remove</button>
                    </td>
                  </tr>
                ))}
                {classSubjects.length === 0 && <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-400">No subjects assigned to this class</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Layout>
  );
}
