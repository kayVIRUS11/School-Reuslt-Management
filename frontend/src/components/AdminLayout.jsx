import Sidebar from './Sidebar';
import { LayoutDashboard, Users, UserSquare2, BookOpen, School, Calendar, ClipboardList, CheckSquare, FileText } from 'lucide-react';

const adminLinks = [
  { to: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { to: '/admin/students', icon: <Users size={20} />, label: 'Students' },
  { to: '/admin/staff', icon: <UserSquare2 size={20} />, label: 'Staff' },
  { to: '/admin/classes', icon: <School size={20} />, label: 'Classes' },
  { to: '/admin/subjects', icon: <BookOpen size={20} />, label: 'Subjects' },
  { to: '/admin/sessions', icon: <Calendar size={20} />, label: 'Sessions & Terms' },
  { to: '/admin/assignments', icon: <ClipboardList size={20} />, label: 'Assignments' },
  { to: '/admin/results/pending', icon: <CheckSquare size={20} />, label: 'Results Approval' },
  { to: '/admin/results', icon: <FileText size={20} />, label: 'All Results' },
];

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar links={adminLinks} title="Admin Portal" />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
