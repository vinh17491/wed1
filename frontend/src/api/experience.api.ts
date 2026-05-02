import api from '../services/api.service';

export const experienceApi = {
  getAll: () => api.get('/experience'),
  create: (data: any) => api.post('/experience', data),
  update: (id: number, data: any) => api.put(`/experience/${id}`, data),
  delete: (id: number) => api.delete(`/experience/${id}`),
};
