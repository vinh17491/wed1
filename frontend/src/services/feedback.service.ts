import { feedbackApi } from '../api/feedback.api';

export interface Feedback {
  id: number;
  name: string;
  message: string;
  rating: number;
  category: string;
  status: 'Pending' | 'Processed';
  createdAt: string;
}

export const feedbackService = {
  /**
   * Gửi phản hồi
   */
  async submit(data: { rating: number; category: string; message: string }) {
    const res = await feedbackApi.submit(data);
    return res.data;
  },

  /**
   * Lấy danh sách cho admin
   */
  async getAll(params?: any): Promise<Feedback[]> {
    const res = await feedbackApi.fetchAll(params);
    return res.data.data;
  },

  /**
   * Cập nhật trạng thái
   */
  async updateStatus(id: number, status: string) {
    const res = await feedbackApi.updateStatus(id, status);
    return res.data;
  },

  /**
   * Xóa phản hồi
   */
  async delete(id: number) {
    const res = await feedbackApi.delete(id);
    return res.data;
  }
};
