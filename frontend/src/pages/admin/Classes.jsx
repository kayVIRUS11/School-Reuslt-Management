import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Modal from '../../components/Modal';
import { getClasses, createClass, updateClass, deleteClass } from '../../services/api';
import toast from 'react-hot-toast';

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', level: '' });

  const load = () => getClasses().then(r => setClasses(r.data));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ name: '', level: '' }); setModal(true); };
  const openEdit = (c) => { setEditing(c); setForm({ name: c.name, level: c.level }); setModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await updateClass(editing.id, form); toast.success('Class updated'); }
      else { await createClass(form); toast.success('Class created'); }
      setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.error || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this class?')) return;
    try { await deleteClass(id); toast.success('Class deleted'); load(); }
    catch { toast.error('Error deleting class'); }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Classes</h1>
        <button onClick={openCreate} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">+ Add Class</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>{['Name', 'Level', 'Students', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-600">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {classes.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium">{c.name}</td>
                <td className="px-4 py-3 text-sm">{c.level}</td>
                <td className="px-4 py-3 text-sm">{c.student_count || 0}</td>
                <td className="px-4 py-3 text-sm flex gap-2">
                  <button onClick={() => openEdit(c)} className="text-indigo-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {classes.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No classes found</td></tr>}
          </tbody>
        </table>
      </div>
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Class' : 'Add Class'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class Name *</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. JSS1A" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level *</label>
            <input value={form.level} onChange={e => setForm({...form, level: e.target.value})} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. JSS1" />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save</button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
