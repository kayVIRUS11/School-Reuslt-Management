import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Modal from '../../components/Modal';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, ChevronDown, ChevronRight } from 'lucide-react';

export default function AdminSessions() {
  const [sessions, setSessions] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [sessionModal, setSessionModal] = useState(false);
  const [termModal, setTermModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionForm, setSessionForm] = useState({ name: '', start_date: '', end_date: '' });
  const [termForm, setTermForm] = useState({ name: '', start_date: '', end_date: '' });

  const load = () => { api.get('/api/admin/sessions').then(r => setSessions(r.data)); };
  useEffect(() => { load(); }, []);

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/admin/sessions', sessionForm);
      toast.success('Session created');
      setSessionModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error');
    }
  };

  const handleCreateTerm = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/admin/sessions/${selectedSession}/terms`, termForm);
      toast.success('Term created');
      setTermModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error');
    }
  };

  const setCurrentSession = async (id) => {
    try {
      await api.put(`/api/admin/sessions/${id}/set-current`);
      toast.success('Current session updated');
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error');
    }
  };

  const setCurrentTerm = async (sessionId, termId) => {
    try {
      await api.put(`/api/admin/sessions/${sessionId}/terms/${termId}/set-current`);
      toast.success('Current term updated');
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error');
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Sessions & Terms</h2>
        <button onClick={() => { setSessionForm({ name: '', start_date: '', end_date: '' }); setSessionModal(true); }} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          <Plus size={18} /> Add Session
        </button>
      </div>
      <div className="space-y-4">
        {sessions.map(session => (
          <div key={session.id} className="bg-white rounded-xl shadow">
            <div
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => setExpanded(prev => ({...prev, [session.id]: !prev[session.id]}))}
            >
              <div className="flex items-center gap-3">
                {expanded[session.id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                <span className="font-semibold text-gray-800">{session.name}</span>
                {session.is_current && <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">Current</span>}
              </div>
              <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                {!session.is_current && (
                  <button onClick={() => setCurrentSession(session.id)} className="text-xs text-indigo-600 hover:text-indigo-800 border border-indigo-300 px-2 py-1 rounded">
                    Set Current
                  </button>
                )}
                <button
                  onClick={() => { setSelectedSession(session.id); setTermForm({ name: '', start_date: '', end_date: '' }); setTermModal(true); }}
                  className="flex items-center gap-1 text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                >
                  <Plus size={14} /> Add Term
                </button>
              </div>
            </div>
            {expanded[session.id] && (
              <div className="border-t px-4 pb-4">
                {session.terms && session.terms.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {session.terms.map(term => (
                      <div key={term.id} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-700">{term.name}</span>
                          {term.is_current && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">Current</span>}
                        </div>
                        {!term.is_current && (
                          <button onClick={() => setCurrentTerm(session.id, term.id)} className="text-xs text-indigo-600 hover:text-indigo-800 border border-indigo-300 px-2 py-1 rounded">
                            Set Current
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm mt-3">No terms yet</p>
                )}
              </div>
            )}
          </div>
        ))}
        {sessions.length === 0 && (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">No sessions found</div>
        )}
      </div>

      <Modal isOpen={sessionModal} onClose={() => setSessionModal(false)} title="Add Session">
        <form onSubmit={handleCreateSession} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Session Name *</label>
            <input value={sessionForm.name} onChange={e => setSessionForm({...sessionForm, name: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" required placeholder="e.g. 2024/2025" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input type="date" value={sessionForm.start_date} onChange={e => setSessionForm({...sessionForm, start_date: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input type="date" value={sessionForm.end_date} onChange={e => setSessionForm({...sessionForm, end_date: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Create</button>
            <button type="button" onClick={() => setSessionModal(false)} className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={termModal} onClose={() => setTermModal(false)} title="Add Term">
        <form onSubmit={handleCreateTerm} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Term Name *</label>
            <input value={termForm.name} onChange={e => setTermForm({...termForm, name: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" required placeholder="e.g. First Term" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input type="date" value={termForm.start_date} onChange={e => setTermForm({...termForm, start_date: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input type="date" value={termForm.end_date} onChange={e => setTermForm({...termForm, end_date: e.target.value})} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Create</button>
            <button type="button" onClick={() => setTermModal(false)} className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
