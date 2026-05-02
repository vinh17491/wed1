import api from '../services/api.service';

export const adminApi = {
  getLogs: (page: number, pageSize: number) => 
    api.get('/analytics/logs', { params: { page, pageSize } }),
  backup: () => 
    api.post('/admin/backup'),
};
