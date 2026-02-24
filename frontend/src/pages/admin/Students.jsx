import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Modal from '../../components/Modal';
import { getStudents, createStudent, updateStudent, deleteStudent, getClasses, resetStudentPassword } from '../../services/api';
import toast from 'react-hot-toast';

const EMPTY_FORM = { reg_number: '', first_name: '', last_name: '', class_id: '', guardian_name: '', guardian_phone: '' };

export default function Students() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [passwordModal, setPasswordModal] = useState(false);

  const load = () => {
    getStudents().then(r => setStudents(r.data));
    getClasses().then(r => setClasses(r.data));
  };

  useEffect(() => { load(); }, []);

  const filtered = students.filter(s =>
    `${s.first_name} ${s.last_name} ${s.reg_number}`.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setModal(true); };
  const openEdit = (s) => { setEditing(s); setForm({ reg_number: s.reg_number, first_name: s.first_name, last_name: s.last_name, class_id: s.class_id || '', guardian_name: s.guardian_name || '', guardian_phone: s.guardian_phone || '' }); setModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateStudent(editing.id, form);
        toast.success('Student updated');
        setModal(false);
        load();
      } else {
        const r = await createStudent(form);
        setGeneratedPassword(r.data.generated_password);
        setPasswordModal(true);
        setModal(false);
        load();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error saving student');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this student?')) return;
    try {
      await deleteStudent(id);
      toast.success('Student deleted');
      load();
    } catch (err) {
      toast.error('Error deleting student');
    }
  };

  const handleResetPassword = async (id) => {
    try {
      const res = await resetStudentPassword(id);
      setGeneratedPassword(res.data.generated_password);
      setPasswordModal(true);
    } catch (err) {
      toast.error('Error resetting password');
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Students</h1>
        <button onClick={openCreate} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">+ Add Student</button>
      </div>
      <div className="mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..." className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {['Reg Number', 'Name', 'Class', 'Guardian', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(s => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-mono">{s.reg_number}</td>
                <td className="px-4 py-3 text-sm">{s.first_name} {s.last_name}</td>
                <td className="px-4 py-3 text-sm">{s.class_name || '—'}</td>
                <td className="px-4 py-3 text-sm">{s.guardian_name || '—'}</td>
                <td className="px-4 py-3 text-sm flex gap-2">
                  <button onClick={() => openEdit(s)} className="text-indigo-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:underline">Delete</button>
                  <button onClick={() => handleResetPassword(s.id)} className="text-yellow-600 hover:underline">Reset Password</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No students found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Student' : 'Add Student'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!editing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number *</label>
              <input value={form.reg_number} onChange={e => setForm({...form, reg_number: e.target.value})} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select value={form.class_id} onChange={e => setForm({...form, class_id: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Select class</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Name</label>
            <input value={form.guardian_name} onChange={e => setForm({...form, guardian_name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Phone</label>
            <input value={form.guardian_phone} onChange={e => setForm({...form, guardian_phone: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={passwordModal} onClose={() => setPasswordModal(false)} title="Generated Password">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Share this password with the user. It will not be shown again.</p>
          <div className="bg-gray-100 rounded-lg p-4 font-mono text-lg text-center font-bold text-gray-800">{generatedPassword}</div>
          <div className="flex justify-end">
            <button onClick={() => setPasswordModal(false)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Done</button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}

