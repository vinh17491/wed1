import { productApi } from '../api/product.api';

export const productService = {
  /**
   * Lấy toàn bộ sản phẩm
   */
  async getAll() {
    const { data, error } = await productApi.fetchList();
    if (error) throw error;
    return data || [];
  },

  /**
   * Tạo sản phẩm mới
   */
  async create(productData: any) {
    const { data, error } = await productApi.create(productData);
    if (error) throw error;
    return data;
  },

  /**
   * Cập nhật sản phẩm
   */
  async update(id: string, productData: any) {
    const { data, error } = await productApi.update(id, productData);
    if (error) throw error;
    return data;
  },

  /**
   * Xóa sản phẩm
   */
  async delete(id: string) {
    const { error } = await productApi.delete(id);
    if (error) throw error;
    return true;
  },

  /**
   * Upload ảnh lên storage và trả về URL công khai
   */
  async uploadImage(file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    const { error: uploadError } = await productApi.uploadStorage(filePath, file);
    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = productApi.getPublicUrl(filePath);
    return publicUrl;
  }
};
