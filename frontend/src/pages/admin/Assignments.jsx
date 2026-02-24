import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Modal from '../../components/Modal';
import { getAssignments, assignSubject, deleteAssignment, getStaff, getSubjects, getClasses, getSessions } from '../../services/api';
import toast from 'react-hot-toast';

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ staff_id: '', subject_id: '', class_id: '', session_id: '' });

  const load = () => {
    getAssignments().then(r => setAssignments(r.data));
    getStaff().then(r => setStaff(r.data));
    getSubjects().then(r => setSubjects(r.data));
    getClasses().then(r => setClasses(r.data));
    getSessions().then(r => setSessions(r.data));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await assignSubject(form);
      toast.success('Subject assigned');
      setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.error || 'Error assigning subject'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this assignment?')) return;
    try { await deleteAssignment(id); toast.success('Assignment removed'); load(); }
    catch { toast.error('Error'); }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Subject Assignments</h1>
        <button onClick={() => { setForm({ staff_id: '', subject_id: '', class_id: '', session_id: '' }); setModal(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">+ Assign Subject</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr>{['Staff', 'Subject', 'Class', 'Session', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-600">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-100">
            {assignments.map(a => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{a.staff_name} <span className="text-gray-400 text-xs">({a.staff_id_number})</span></td>
                <td className="px-4 py-3 text-sm">{a.subject_name}</td>
                <td className="px-4 py-3 text-sm">{a.class_name}</td>
                <td className="px-4 py-3 text-sm">{a.session_name}</td>
                <td className="px-4 py-3 text-sm"><button onClick={() => handleDelete(a.id)} className="text-red-500 hover:underline">Remove</button></td>
              </tr>
            ))}
            {assignments.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No assignments</td></tr>}
          </tbody>
        </table>
      </div>
      <Modal isOpen={modal} onClose={() => setModal(false)} title="Assign Subject to Staff">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Staff *</label><select value={form.staff_id} onChange={e => setForm({...form, staff_id: e.target.value})} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"><option value="">Select staff</option>{staff.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.staff_id_number})</option>)}</select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label><select value={form.subject_id} onChange={e => setForm({...form, subject_id: e.target.value})} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"><option value="">Select subject</option>{subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Class *</label><select value={form.class_id} onChange={e => setForm({...form, class_id: e.target.value})} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"><option value="">Select class</option>{classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Session *</label><select value={form.session_id} onChange={e => setForm({...form, session_id: e.target.value})} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"><option value="">Select session</option>{sessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
          <div className="flex gap-3 justify-end pt-2"><button type="button" onClick={() => setModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button><button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Assign</button></div>
        </form>
      </Modal>
    </Layout>
  );
}
