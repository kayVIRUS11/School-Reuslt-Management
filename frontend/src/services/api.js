import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// Admin - Students
export const getStudents = () => api.get('/admin/students');
export const createStudent = (data) => api.post('/admin/students', data);
export const updateStudent = (id, data) => api.put(`/admin/students/${id}`, data);
export const deleteStudent = (id) => api.delete(`/admin/students/${id}`);

// Admin - Staff
export const getStaff = () => api.get('/admin/staff');
export const createStaff = (data) => api.post('/admin/staff', data);
export const updateStaff = (id, data) => api.put(`/admin/staff/${id}`, data);
export const deleteStaff = (id) => api.delete(`/admin/staff/${id}`);

// Admin - Classes
export const getClasses = () => api.get('/admin/classes');
export const createClass = (data) => api.post('/admin/classes', data);
export const updateClass = (id, data) => api.put(`/admin/classes/${id}`, data);
export const deleteClass = (id) => api.delete(`/admin/classes/${id}`);

// Admin - Subjects
export const getSubjects = () => api.get('/admin/subjects');
export const createSubject = (data) => api.post('/admin/subjects', data);
export const updateSubject = (id, data) => api.put(`/admin/subjects/${id}`, data);
export const deleteSubject = (id) => api.delete(`/admin/subjects/${id}`);

// Admin - Sessions
export const getSessions = () => api.get('/admin/sessions');
export const createSession = (data) => api.post('/admin/sessions', data);
export const updateSession = (id, data) => api.put(`/admin/sessions/${id}`, data);
export const deleteSession = (id) => api.delete(`/admin/sessions/${id}`);

// Admin - Terms
export const getTerms = () => api.get('/admin/terms');
export const createTerm = (data) => api.post('/admin/terms', data);
export const updateTerm = (id, data) => api.put(`/admin/terms/${id}`, data);
export const deleteTerm = (id) => api.delete(`/admin/terms/${id}`);

// Admin - Assignments
export const getAssignments = () => api.get('/admin/assignments');
export const assignSubject = (data) => api.post('/admin/assign-subject', data);
export const deleteAssignment = (id) => api.delete(`/admin/assignments/${id}`);

// Admin - Results
export const getPendingResults = () => api.get('/admin/results/pending');
export const approveResult = (id) => api.post(`/admin/results/approve/${id}`);
export const rejectResult = (id) => api.post(`/admin/results/reject/${id}`);
export const getAllResults = (params) => api.get('/admin/results', { params });
export const getAdminStats = () => api.get('/admin/stats');

// Staff
export const getMyAssignments = () => api.get('/staff/my-assignments');
export const getClassStudents = (classId) => api.get(`/staff/classes/${classId}/students`);
export const enterResults = (data) => api.post('/staff/results', data);
export const updateResult = (id, data) => api.put(`/staff/results/${id}`, data);
export const submitResults = (data) => api.post('/staff/results/submit', data);
export const getStaffResults = (params) => api.get('/staff/results', { params });
export const getStaffStats = () => api.get('/staff/stats');

// Student
export const getStudentProfile = () => api.get('/student/profile');
export const getStudentResults = (params) => api.get('/student/results', { params });

export default api;
