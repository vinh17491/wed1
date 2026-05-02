import api from '../services/api.service';

export const feedbackApi = {
  submit: (data: any) => 
    api.post('/feedback', data),

  fetchAll: (params?: any) => 
    api.get('/feedback/admin', { params }),

  updateStatus: (id: number, status: string) => 
    api.patch(`/feedback/admin/${id}/status`, status, { 
      headers: { 'Content-Type': 'application/json' } 
    }),

  delete: (id: number) => 
    api.delete(`/feedback/admin/${id}`),
};
