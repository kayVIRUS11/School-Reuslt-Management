import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const adminLinks = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/students', label: 'Students' },
  { to: '/admin/staff', label: 'Staff' },
  { to: '/admin/classes', label: 'Classes' },
  { to: '/admin/subjects', label: 'Subjects' },
  { to: '/admin/sessions', label: 'Sessions & Terms' },
  { to: '/admin/assignments', label: 'Assign Subjects' },
  { to: '/admin/class-subjects', label: 'Class Subjects' },
  { to: '/admin/results/pending', label: 'Pending Approval' },
  { to: '/admin/results', label: 'All Results' },
];

const staffLinks = [
  { to: '/staff', label: 'Dashboard' },
  { to: '/staff/assignments', label: 'My Assignments' },
  { to: '/staff/results/enter', label: 'Enter Results' },
  { to: '/staff/results', label: 'My Results' },
  { to: '/staff/change-password', label: 'Change Password' },
];

const studentLinks = [
  { to: '/student', label: 'Dashboard' },
  { to: '/student/results', label: 'My Results' },
  { to: '/student/profile', label: 'My Profile' },
  { to: '/student/change-password', label: 'Change Password' },
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
        <h1 className="text-xl font-bold">SchoolResult</h1>
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
            className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
              location.pathname === link.to
                ? 'bg-indigo-700 text-white'
                : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-indigo-700">
        <button
          onClick={handleLogout}
          className="w-full px-3 py-2 text-sm text-indigo-200 hover:text-white hover:bg-indigo-800 rounded-lg transition-colors text-left"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
