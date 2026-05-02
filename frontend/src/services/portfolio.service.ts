import { portfolioApi } from '../api/portfolio.api';
import { analyticsApi } from '../api/analytics.api';

export const portfolioService = {
  // Profile
  async getProfile() {
    const res = await portfolioApi.getProfile();
    return res.data.data;
  },
  async updateProfile(data: any) {
    const res = await portfolioApi.updateProfile(data);
    return res.data;
  },

  // Skills
  async getSkills() {
    const res = await portfolioApi.getSkills();
    return res.data.data;
  },
  async createSkill(data: any) {
    const res = await portfolioApi.createSkill(data);
    return res.data;
  },
  async updateSkill(id: number, data: any) {
    const res = await portfolioApi.updateSkill(id, data);
    return res.data;
  },
  async deleteSkill(id: number) {
    const res = await portfolioApi.deleteSkill(id);
    return res.data;
  },

  // Projects
  async getProjects() {
    const res = await portfolioApi.getProjects();
    return res.data.data;
  },
  async createProject(data: any) {
    const res = await portfolioApi.createProject(data);
    return res.data;
  },
  async updateProject(id: number, data: any) {
    const res = await portfolioApi.updateProject(id, data);
    return res.data;
  },
  async deleteProject(id: number) {
    const res = await portfolioApi.deleteProject(id);
    return res.data;
  },

  // Experience
  async getExperiences() {
    const res = await portfolioApi.getExperiences();
    return res.data.data;
  },
  async createExperience(data: any) {
    const res = await portfolioApi.createExperience(data);
    return res.data;
  },
  async updateExperience(id: number, data: any) {
    const res = await portfolioApi.updateExperience(id, data);
    return res.data;
  },
  async deleteExperience(id: number) {
    const res = await portfolioApi.deleteExperience(id);
    return res.data;
  },

  // Analytics
  async trackView(page: string, deviceType: string) {
    return analyticsApi.track({ page, deviceType });
  }
};
