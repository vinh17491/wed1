import { authApi } from '../api/auth.api';

export const authService = {
  /**
   * Đăng ký người dùng mới
   */
  async signUp(email: string, password: string) {
    const { data, error } = await authApi.signUp(email, password);
    if (error) throw error;
    return data;
  },

  /**
   * Đăng nhập
   */
  async signIn(email: string, password: string) {
    const { data, error } = await authApi.signIn(email, password);
    if (error) throw error;
    return data;
  },

  /**
   * Đăng xuất
   */
  async signOut() {
    const { error } = await authApi.signOut();
    if (error) throw error;
  },

  /**
   * Lấy phiên làm việc hiện tại
   */
  async getSession() {
    const { data: { session }, error } = await authApi.getSession();
    if (error) throw error;
    return session;
  }
};
