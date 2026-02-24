import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Modal from '../../components/Modal';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function AdminSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', code: '' });

  const load = () => { api.get('/api/admin/subjects').then(r => setSubjects(r.data)); };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ name: '', code: '' }); setIsOpen(true); };
  const openEdit = (s) => { setEditing(s); setForm({ name: s.name, code: s.code || '' }); setIsOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/api/admin/subjects/${editing.id}`, form);
        toast.success('Subject updated');
      } else {
        await api.post('/api/admin/subjects', form);
        toast.success('Subject created');
      }
      setIsOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this subject?')) return;
    try {
      await api.delete(`/api/admin/subjects/${id}`);
      toast.success('Subject deleted');
      load();
    } catch {
      toast.error('Error deleting subject');
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Subjects</h2>
        <button onClick={openAdd} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          <Plus size={18} /> Add Subject
        </button>
      </div>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Code</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {subjects.map(s => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{s.name}</td>
                <td className="px-6 py-4 font-mono">{s.code || '-'}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button onClick={() => openEdit(s)} className="text-indigo-600 hover:text-indigo-800"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {subjects.length === 0 && <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-400">No subjects found</td></tr>}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editing ? 'Edit Subject' : 'Add Subject'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name *</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" required placeholder="e.g. Mathematics" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
            <input value={form.code} onChange={e => setForm({...form, code: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. MATH" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">{editing ? 'Update' : 'Create'}</button>
            <button type="button" onClick={() => setIsOpen(false)} className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
