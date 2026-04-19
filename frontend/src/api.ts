import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
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
  login: (data: { username: string; password: string }) => api.post('/auth/login', data),
};

export const chatApi = {
  send: (message: string, language: string) => api.post('/chat', { message, language }),
};

export const feedbackApi = {
  submit: (data: { name: string; email: string; rating: number; message: string }) => api.post('/feedback', data),
  getAll: () => api.get('/feedback/admin'),
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
