import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import Students from './pages/admin/Students';
import StaffPage from './pages/admin/StaffPage';
import Classes from './pages/admin/Classes';
import Subjects from './pages/admin/Subjects';
import Sessions from './pages/admin/Sessions';
import Assignments from './pages/admin/Assignments';
import PendingResults from './pages/admin/PendingResults';
import AllResults from './pages/admin/AllResults';
import ClassSubjects from './pages/admin/ClassSubjects';
import StaffDashboard from './pages/staff/Dashboard';
import MyAssignments from './pages/staff/MyAssignments';
import EnterResults from './pages/staff/EnterResults';
import MyResults from './pages/staff/MyResults';
import StaffChangePassword from './pages/staff/ChangePassword';
import StudentDashboard from './pages/student/Dashboard';
import StudentResults from './pages/student/MyResults';
import StudentProfile from './pages/student/Profile';
import StudentChangePassword from './pages/student/ChangePassword';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-indigo-600 text-xl">Loading...</div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={`/${user.role}`} replace /> : <Login />} />
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/students" element={<ProtectedRoute allowedRoles={['admin']}><Students /></ProtectedRoute>} />
      <Route path="/admin/staff" element={<ProtectedRoute allowedRoles={['admin']}><StaffPage /></ProtectedRoute>} />
      <Route path="/admin/classes" element={<ProtectedRoute allowedRoles={['admin']}><Classes /></ProtectedRoute>} />
      <Route path="/admin/subjects" element={<ProtectedRoute allowedRoles={['admin']}><Subjects /></ProtectedRoute>} />
      <Route path="/admin/sessions" element={<ProtectedRoute allowedRoles={['admin']}><Sessions /></ProtectedRoute>} />
      <Route path="/admin/assignments" element={<ProtectedRoute allowedRoles={['admin']}><Assignments /></ProtectedRoute>} />
      <Route path="/admin/results/pending" element={<ProtectedRoute allowedRoles={['admin']}><PendingResults /></ProtectedRoute>} />
      <Route path="/admin/results" element={<ProtectedRoute allowedRoles={['admin']}><AllResults /></ProtectedRoute>} />
      <Route path="/admin/class-subjects" element={<ProtectedRoute allowedRoles={['admin']}><ClassSubjects /></ProtectedRoute>} />
      <Route path="/staff" element={<ProtectedRoute allowedRoles={['staff']}><StaffDashboard /></ProtectedRoute>} />
      <Route path="/staff/assignments" element={<ProtectedRoute allowedRoles={['staff']}><MyAssignments /></ProtectedRoute>} />
      <Route path="/staff/results/enter" element={<ProtectedRoute allowedRoles={['staff']}><EnterResults /></ProtectedRoute>} />
      <Route path="/staff/results" element={<ProtectedRoute allowedRoles={['staff']}><MyResults /></ProtectedRoute>} />
      <Route path="/staff/change-password" element={<ProtectedRoute allowedRoles={['staff']}><StaffChangePassword /></ProtectedRoute>} />
      <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/results" element={<ProtectedRoute allowedRoles={['student']}><StudentResults /></ProtectedRoute>} />
      <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['student']}><StudentProfile /></ProtectedRoute>} />
      <Route path="/student/change-password" element={<ProtectedRoute allowedRoles={['student']}><StudentChangePassword /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/login" replace />} />
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
