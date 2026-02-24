import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Modal from '../../components/Modal';
import { getSessions, createSession, updateSession, deleteSession, getTerms, createTerm, updateTerm, deleteTerm } from '../../services/api';
import toast from 'react-hot-toast';

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [terms, setTerms] = useState([]);
  const [sessionModal, setSessionModal] = useState(false);
  const [termModal, setTermModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [editingTerm, setEditingTerm] = useState(null);
  const [sessionForm, setSessionForm] = useState({ name: '', is_current: false });
  const [termForm, setTermForm] = useState({ name: '', session_id: '', is_current: false });

  const load = () => {
    getSessions().then(r => setSessions(r.data));
    getTerms().then(r => setTerms(r.data));
  };
  useEffect(() => { load(); }, []);

  const handleSessionSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSession) { await updateSession(editingSession.id, sessionForm); toast.success('Session updated'); }
      else { await createSession(sessionForm); toast.success('Session created'); }
      setSessionModal(false); load();
    } catch (err) { toast.error(err.response?.data?.error || 'Error'); }
  };

  const handleTermSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTerm) { await updateTerm(editingTerm.id, termForm); toast.success('Term updated'); }
      else { await createTerm(termForm); toast.success('Term created'); }
      setTermModal(false); load();
    } catch (err) { toast.error(err.response?.data?.error || 'Error'); }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Sessions & Terms</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Academic Sessions</h2>
            <button onClick={() => { setEditingSession(null); setSessionForm({ name: '', is_current: false }); setSessionModal(true); }} className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-indigo-700">+ Add</button>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50"><tr>{['Name', 'Current', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-600">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-gray-100">
                {sessions.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{s.name}</td>
                    <td className="px-4 py-3">{s.is_current && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">Current</span>}</td>
                    <td className="px-4 py-3 text-sm flex gap-2">
                      <button onClick={() => { setEditingSession(s); setSessionForm({ name: s.name, is_current: s.is_current }); setSessionModal(true); }} className="text-indigo-600 hover:underline">Edit</button>
                      <button onClick={async () => { if (!confirm('Delete?')) return; try { await deleteSession(s.id); toast.success('Deleted'); load(); } catch { toast.error('Error'); } }} className="text-red-500 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
                {sessions.length === 0 && <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-400">No sessions</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Terms</h2>
            <button onClick={() => { setEditingTerm(null); setTermForm({ name: '', session_id: sessions[0]?.id || '', is_current: false }); setTermModal(true); }} className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-indigo-700">+ Add</button>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50"><tr>{['Term', 'Session', 'Current', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-600">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-gray-100">
                {terms.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{t.name}</td>
                    <td className="px-4 py-3 text-sm">{t.session_name}</td>
                    <td className="px-4 py-3">{t.is_current && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">Current</span>}</td>
                    <td className="px-4 py-3 text-sm flex gap-2">
                      <button onClick={() => { setEditingTerm(t); setTermForm({ name: t.name, session_id: t.session_id, is_current: t.is_current }); setTermModal(true); }} className="text-indigo-600 hover:underline">Edit</button>
                      <button onClick={async () => { if (!confirm('Delete?')) return; try { await deleteTerm(t.id); toast.success('Deleted'); load(); } catch { toast.error('Error'); } }} className="text-red-500 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
                {terms.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No terms</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal isOpen={sessionModal} onClose={() => setSessionModal(false)} title={editingSession ? 'Edit Session' : 'Add Session'}>
        <form onSubmit={handleSessionSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Session Name *</label><input value={sessionForm.name} onChange={e => setSessionForm({...sessionForm, name: e.target.value})} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. 2025/2026" /></div>
          <div className="flex items-center gap-2"><input type="checkbox" id="sc" checked={sessionForm.is_current} onChange={e => setSessionForm({...sessionForm, is_current: e.target.checked})} /><label htmlFor="sc" className="text-sm text-gray-700">Set as current session</label></div>
          <div className="flex gap-3 justify-end pt-2"><button type="button" onClick={() => setSessionModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button><button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save</button></div>
        </form>
      </Modal>

      <Modal isOpen={termModal} onClose={() => setTermModal(false)} title={editingTerm ? 'Edit Term' : 'Add Term'}>
        <form onSubmit={handleTermSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Term Name *</label><input value={termForm.name} onChange={e => setTermForm({...termForm, name: e.target.value})} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. First Term" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Session *</label><select value={termForm.session_id} onChange={e => setTermForm({...termForm, session_id: e.target.value})} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">{sessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
          <div className="flex items-center gap-2"><input type="checkbox" id="tc" checked={termForm.is_current} onChange={e => setTermForm({...termForm, is_current: e.target.checked})} /><label htmlFor="tc" className="text-sm text-gray-700">Set as current term</label></div>
          <div className="flex gap-3 justify-end pt-2"><button type="button" onClick={() => setTermModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button><button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save</button></div>
        </form>
      </Modal>
    </Layout>
  );
}
