import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Modal from '../../components/Modal';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ reg_number: '', first_name: '', last_name: '', class_id: '', guardian_name: '', guardian_phone: '', password: '' });

  const load = () => {
    api.get('/api/admin/students').then(r => setStudents(r.data));
    api.get('/api/admin/classes').then(r => setClasses(r.data));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ reg_number: '', first_name: '', last_name: '', class_id: '', guardian_name: '', guardian_phone: '', password: '' }); setIsOpen(true); };
  const openEdit = (s) => { setEditing(s); setForm({ reg_number: s.reg_number, first_name: s.first_name, last_name: s.last_name, class_id: s.class_id || '', guardian_name: s.guardian_name || '', guardian_phone: s.guardian_phone || '', password: '' }); setIsOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/api/admin/students/${editing.id}`, form);
        toast.success('Student updated');
      } else {
        await api.post('/api/admin/students', form);
        toast.success('Student created');
      }
      setIsOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this student?')) return;
    try {
      await api.delete(`/api/admin/students/${id}`);
      toast.success('Student deleted');
      load();
    } catch {
      toast.error('Error deleting student');
    }
  };

  const filtered = students.filter(s =>
    `${s.first_name} ${s.last_name} ${s.reg_number}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Students</h2>
        <button onClick={openAdd} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          <Plus size={18} /> Add Student
        </button>
      </div>
      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-3 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..." className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">Reg Number</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Class</th>
              <th className="px-6 py-3 text-left">Guardian</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(s => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-mono">{s.reg_number}</td>
                <td className="px-6 py-4">{s.first_name} {s.last_name}</td>
                <td className="px-6 py-4">{s.class_name || '-'}</td>
                <td className="px-6 py-4">{s.guardian_name || '-'}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button onClick={() => openEdit(s)} className="text-indigo-600 hover:text-indigo-800"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No students found</td></tr>}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editing ? 'Edit Student' : 'Add Student'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!editing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number *</label>
              <input value={form.reg_number} onChange={e => setForm({...form, reg_number: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select value={form.class_id} onChange={e => setForm({...form, class_id: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Select class</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Name</label>
            <input value={form.guardian_name} onChange={e => setForm({...form, guardian_name: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Phone</label>
            <input value={form.guardian_phone} onChange={e => setForm({...form, guardian_phone: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password {editing ? '(leave blank to keep)' : '*'}</label>
            <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" required={!editing} />
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
