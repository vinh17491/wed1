import { analyticsApi } from '../api/analytics.api';

export const analyticsService = {
  /**
   * Theo dõi lượt xem trang
   */
  async trackView(page: string) {
    const deviceType = /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop';
    try {
      await analyticsApi.track({ page, deviceType, duration: 0 });
    } catch (err) {
      console.warn('Analytics tracking failed', err);
    }
  },

  /**
   * Lấy tóm tắt thống kê
   */
  async getSummary() {
    const res = await analyticsApi.getSummary();
    return res.data.data;
  },

  /**
   * Lấy logs chi tiết
   */
  async getLogs(page: number, pageSize: number) {
    const res = await analyticsApi.getLogs(page, pageSize);
    return res.data.data;
  }
};
