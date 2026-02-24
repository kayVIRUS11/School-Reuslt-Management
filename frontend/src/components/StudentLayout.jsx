import Sidebar from './Sidebar';
import { LayoutDashboard, FileText, User } from 'lucide-react';

const studentLinks = [
  { to: '/student', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { to: '/student/results', icon: <FileText size={20} />, label: 'My Results' },
  { to: '/student/profile', icon: <User size={20} />, label: 'My Profile' },
];

export default function StudentLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar links={studentLinks} title="Student Portal" />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
