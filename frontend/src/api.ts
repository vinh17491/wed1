import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname.startsWith('/admin') || window.location.pathname === '/feedback') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Public APIs
export const profileApi = {
  get: () => api.get('/profile'),
  update: (data: any) => api.put('/profile', data),
};

export const skillsApi = {
  getAll: () => api.get('/skills'),
  create: (data: any) => api.post('/skills', data),
  update: (id: number, data: any) => api.put(`/skills/${id}`, data),
  delete: (id: number) => api.delete(`/skills/${id}`),
};

export const projectsApi = {
  getAll: () => api.get('/projects'),
  create: (data: any) => api.post('/projects', data),
  update: (id: number, data: any) => api.put(`/projects/${id}`, data),
  delete: (id: number) => api.delete(`/projects/${id}`),
};

export const experienceApi = {
  getAll: () => api.get('/experience'),
  create: (data: any) => api.post('/experience', data),
  update: (id: number, data: any) => api.put(`/experience/${id}`, data),
  delete: (id: number) => api.delete(`/experience/${id}`),
};

export const authApi = {
  login: (data: any) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  googleLogin: (idToken: string) => api.post('/auth/google-login', { idToken }),
};

export const chatApi = {
  send: (message: string, language: string) => api.post('/chat', { message, language }),
};

export const feedbackApi = {
  submit: (data: { rating: number; category: string; message: string }) => api.post('/feedback', data),
  getAll: (params?: any) => api.get('/feedback/admin', { params }),
  updateStatus: (id: number, status: string) => api.patch(`/feedback/admin/${id}/status`, status, { headers: { 'Content-Type': 'application/json' } }),
  delete: (id: number) => api.delete(`/feedback/admin/${id}`),
};

export const analyticsApi = {
  track: (page: string, deviceType: string) =>
    api.post('/analytics/track', { page, duration: 0, deviceType }),
  getSummary: () => api.get('/analytics/summary'),
  getLogs: (page: number, pageSize: number) =>
    api.get('/analytics/logs', { params: { page, pageSize } }),
};

export const adminApi = {
  getLogs: (page: number, pageSize: number) =>
    api.get('/admin/logs', { params: { page, pageSize } }),
  backup: () => api.post('/admin/backup'),
};

export default api;
