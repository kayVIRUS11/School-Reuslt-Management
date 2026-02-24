import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Modal from '../../components/Modal';
import { getSubjects, createSubject, updateSubject, deleteSubject } from '../../services/api';
import toast from 'react-hot-toast';

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', code: '' });

  const load = () => getSubjects().then(r => setSubjects(r.data));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ name: '', code: '' }); setModal(true); };
  const openEdit = (s) => { setEditing(s); setForm({ name: s.name, code: s.code }); setModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await updateSubject(editing.id, form); toast.success('Subject updated'); }
      else { await createSubject(form); toast.success('Subject created'); }
      setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.error || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this subject?')) return;
    try { await deleteSubject(id); toast.success('Subject deleted'); load(); }
    catch { toast.error('Error deleting subject'); }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Subjects</h1>
        <button onClick={openCreate} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">+ Add Subject</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>{['Name', 'Code', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-600">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {subjects.map(s => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{s.name}</td>
                <td className="px-4 py-3 text-sm font-mono font-medium">{s.code}</td>
                <td className="px-4 py-3 text-sm flex gap-2">
                  <button onClick={() => openEdit(s)} className="text-indigo-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {subjects.length === 0 && <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-400">No subjects found</td></tr>}
          </tbody>
        </table>
      </div>
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Subject' : 'Add Subject'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name *</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
            <input value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. MATH" />
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
