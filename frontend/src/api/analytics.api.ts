import api from '../services/api.service';

export const analyticsApi = {
  track: (data: { page: string; deviceType: string; duration?: number }) =>
    api.post('/analytics/track', data),

  getSummary: () => 
    api.get('/analytics/summary'),

  getLogs: (page: number, pageSize: number, config?: any) =>
    api.get('/analytics/logs', { params: { page, pageSize }, ...config }),
};
