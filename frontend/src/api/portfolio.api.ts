import api from '../services/api.service';

export const portfolioApi = {
  // Profile
  getProfile: () => api.get('/profile'),
  updateProfile: (data: any) => api.put('/profile', data),

  // Skills
  getSkills: () => api.get('/skills'),
  createSkill: (data: any) => api.post('/skills', data),
  updateSkill: (id: number, data: any) => api.put(`/skills/${id}`, data),
  deleteSkill: (id: number) => api.delete(`/skills/${id}`),

  // Projects
  getProjects: () => api.get('/projects'),
  createProject: (data: any) => api.post('/projects', data),
  updateProject: (id: number, data: any) => api.put(`/projects/${id}`, data),
  deleteProject: (id: number) => api.delete(`/projects/${id}`),

  // Experience
  getExperiences: () => api.get('/experience'),
  createExperience: (data: any) => api.post('/experience', data),
  updateExperience: (id: number, data: any) => api.put(`/experience/${id}`, data),
  deleteExperience: (id: number) => api.delete(`/experience/${id}`),
};
