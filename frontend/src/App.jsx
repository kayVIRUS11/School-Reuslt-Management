import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminStudents from './pages/admin/Students';
import AdminStaff from './pages/admin/StaffPage';
import AdminClasses from './pages/admin/Classes';
import AdminSubjects from './pages/admin/Subjects';
import AdminSessions from './pages/admin/Sessions';
import AdminAssignments from './pages/admin/Assignments';
import AdminResultsApproval from './pages/admin/ResultsApproval';
import AdminAllResults from './pages/admin/AllResults';
import StaffDashboard from './pages/staff/Dashboard';
import StaffAssignments from './pages/staff/Assignments';
import StaffEnterResults from './pages/staff/EnterResults';
import StaffMyResults from './pages/staff/MyResults';
import StudentDashboard from './pages/student/Dashboard';
import StudentResults from './pages/student/Results';
import StudentProfile from './pages/student/Profile';

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" />;
  return children;
}

function RoleRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'admin') return <Navigate to="/admin" />;
  if (user.role === 'staff') return <Navigate to="/staff" />;
  if (user.role === 'student') return <Navigate to="/student" />;
  return <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RoleRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/students" element={<ProtectedRoute roles={['admin']}><AdminStudents /></ProtectedRoute>} />
      <Route path="/admin/staff" element={<ProtectedRoute roles={['admin']}><AdminStaff /></ProtectedRoute>} />
      <Route path="/admin/classes" element={<ProtectedRoute roles={['admin']}><AdminClasses /></ProtectedRoute>} />
      <Route path="/admin/subjects" element={<ProtectedRoute roles={['admin']}><AdminSubjects /></ProtectedRoute>} />
      <Route path="/admin/sessions" element={<ProtectedRoute roles={['admin']}><AdminSessions /></ProtectedRoute>} />
      <Route path="/admin/assignments" element={<ProtectedRoute roles={['admin']}><AdminAssignments /></ProtectedRoute>} />
      <Route path="/admin/results/pending" element={<ProtectedRoute roles={['admin']}><AdminResultsApproval /></ProtectedRoute>} />
      <Route path="/admin/results" element={<ProtectedRoute roles={['admin']}><AdminAllResults /></ProtectedRoute>} />
      <Route path="/staff" element={<ProtectedRoute roles={['staff']}><StaffDashboard /></ProtectedRoute>} />
      <Route path="/staff/assignments" element={<ProtectedRoute roles={['staff']}><StaffAssignments /></ProtectedRoute>} />
      <Route path="/staff/enter-results" element={<ProtectedRoute roles={['staff']}><StaffEnterResults /></ProtectedRoute>} />
      <Route path="/staff/results" element={<ProtectedRoute roles={['staff']}><StaffMyResults /></ProtectedRoute>} />
      <Route path="/student" element={<ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/results" element={<ProtectedRoute roles={['student']}><StudentResults /></ProtectedRoute>} />
      <Route path="/student/profile" element={<ProtectedRoute roles={['student']}><StudentProfile /></ProtectedRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
