import axios from 'axios';

const api = axios.create({
  baseURL: '',
});

// Token initialization is handled in AuthContext.jsx
// This ensures the token is set after authentication, not at module load

export default api;
