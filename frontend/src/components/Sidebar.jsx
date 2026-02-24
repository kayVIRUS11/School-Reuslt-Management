import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: '🏠' },
  { to: '/admin/students', label: 'Students', icon: '👨‍🎓' },
  { to: '/admin/staff', label: 'Staff', icon: '👨‍🏫' },
  { to: '/admin/classes', label: 'Classes', icon: '🏫' },
  { to: '/admin/subjects', label: 'Subjects', icon: '📚' },
  { to: '/admin/sessions', label: 'Sessions & Terms', icon: '📅' },
  { to: '/admin/assignments', label: 'Assign Subjects', icon: '📋' },
  { to: '/admin/results/pending', label: 'Pending Approval', icon: '⏳' },
  { to: '/admin/results', label: 'All Results', icon: '📊' },
];

const staffLinks = [
  { to: '/staff', label: 'Dashboard', icon: '🏠' },
  { to: '/staff/assignments', label: 'My Assignments', icon: '📋' },
  { to: '/staff/results/enter', label: 'Enter Results', icon: '✏️' },
  { to: '/staff/results', label: 'My Results', icon: '📊' },
];

const studentLinks = [
  { to: '/student', label: 'Dashboard', icon: '🏠' },
  { to: '/student/results', label: 'My Results', icon: '📊' },
  { to: '/student/profile', label: 'My Profile', icon: '👤' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const links = user?.role === 'admin' ? adminLinks : user?.role === 'staff' ? staffLinks : studentLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-screen w-64 bg-indigo-900 text-white flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-indigo-700">
        <h1 className="text-xl font-bold">🎓 SchoolResult</h1>
        <p className="text-sm text-indigo-300 mt-1 capitalize">{user?.role} Portal</p>
      </div>
      <div className="p-4 border-b border-indigo-700">
        <p className="text-sm font-medium">{user?.first_name} {user?.last_name}</p>
        <p className="text-xs text-indigo-400">{user?.username}</p>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              location.pathname === link.to
                ? 'bg-indigo-700 text-white'
                : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
            }`}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-indigo-700">
        <button
          onClick={handleLogout}
          className="w-full px-3 py-2 text-sm text-indigo-200 hover:text-white hover:bg-indigo-800 rounded-lg transition-colors text-left"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
