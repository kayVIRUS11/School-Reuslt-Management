import { Link, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ links, title }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <aside className="w-64 bg-indigo-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-indigo-700">
        <h1 className="text-xl font-bold">🎓 School Result</h1>
        <p className="text-indigo-300 text-sm mt-1">{title}</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === link.to
                ? 'bg-indigo-700 text-white'
                : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
            }`}
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-indigo-700">
        <p className="text-indigo-300 text-xs mb-2">{user?.first_name} {user?.last_name}</p>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-indigo-200 hover:text-white w-full px-4 py-2 rounded-lg hover:bg-indigo-800 transition-colors"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
