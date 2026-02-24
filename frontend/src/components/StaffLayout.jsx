import Sidebar from './Sidebar';
import { LayoutDashboard, ClipboardList, PenLine, FileText } from 'lucide-react';

const staffLinks = [
  { to: '/staff', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { to: '/staff/assignments', icon: <ClipboardList size={20} />, label: 'My Assignments' },
  { to: '/staff/enter-results', icon: <PenLine size={20} />, label: 'Enter Results' },
  { to: '/staff/results', icon: <FileText size={20} />, label: 'My Results' },
];

export default function StaffLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar links={staffLinks} title="Staff Portal" />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
