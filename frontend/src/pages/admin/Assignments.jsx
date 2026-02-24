import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Modal from '../../components/Modal';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ staff_id: '', subject_id: '', class_id: '', session_id: '' });

  const load = () => {
    api.get('/api/admin/assignments').then(r => setAssignments(r.data));
    api.get('/api/admin/staff').then(r => setStaff(r.data));
    api.get('/api/admin/subjects').then(r => setSubjects(r.data));
    api.get('/api/admin/classes').then(r => setClasses(r.data));
    api.get('/api/admin/sessions').then(r => setSessions(r.data));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/admin/assignments', form);
      toast.success('Assignment created');
      setIsOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this assignment?')) return;
    try {
      await api.delete(`/api/admin/assignments/${id}`);
      toast.success('Assignment deleted');
      load();
    } catch {
      toast.error('Error deleting assignment');
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Staff Assignments</h2>
        <button onClick={() => { setForm({ staff_id: '', subject_id: '', class_id: '', session_id: '' }); setIsOpen(true); }} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          <Plus size={18} /> Add Assignment
        </button>
      </div>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">Staff</th>
              <th className="px-6 py-3 text-left">Subject</th>
              <th className="px-6 py-3 text-left">Class</th>
              <th className="px-6 py-3 text-left">Session</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {assignments.map(a => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{a.staff_name}</td>
                <td className="px-6 py-4">{a.subject_name}</td>
                <td className="px-6 py-4">{a.class_name}</td>
                <td className="px-6 py-4">{a.session_name}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(a.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {assignments.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No assignments found</td></tr>}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Assignment">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Staff *</label>
            <select value={form.staff_id} onChange={e => setForm({...form, staff_id: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
              <option value="">Select staff</option>
              {staff.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
            <select value={form.subject_id} onChange={e => setForm({...form, subject_id: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
              <option value="">Select subject</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
            <select value={form.class_id} onChange={e => setForm({...form, class_id: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
              <option value="">Select class</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Session *</label>
            <select value={form.session_id} onChange={e => setForm({...form, session_id: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
              <option value="">Select session</option>
              {sessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Create</button>
            <button type="button" onClick={() => setIsOpen(false)} className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
