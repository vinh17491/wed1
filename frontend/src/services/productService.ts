import { supabase } from './supabase';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category: string;
  created_at?: string;
}

export const productService = {
  /**
   * Lấy danh sách tất cả sản phẩm
   */
  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw new Error(`Lỗi khi lấy sản phẩm: ${error.message}`);
      return data || [];
    } catch (error) {
      console.error('productService.getProducts:', error);
      throw error;
    }
  },

  /**
   * Tạo sản phẩm mới
   */
  async createProduct(product: Omit<Product, 'id' | 'created_at'>): Promise<Product> {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

      if (error) throw new Error(`Lỗi khi tạo sản phẩm: ${error.message}`);
      return data;
    } catch (error) {
      console.error('productService.createProduct:', error);
      throw error;
    }
  },

  /**
   * Cập nhật thông tin sản phẩm
   */
  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(`Lỗi khi cập nhật sản phẩm: ${error.message}`);
      return data;
    } catch (error) {
      console.error('productService.updateProduct:', error);
      throw error;
    }
  },

  /**
   * Xóa sản phẩm
   */
  async deleteProduct(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw new Error(`Lỗi khi xóa sản phẩm: ${error.message}`);
    } catch (error) {
      console.error('productService.deleteProduct:', error);
      throw error;
    }
  },

  /**
   * Upload hình ảnh lên Supabase Storage
   */
  async uploadImage(file: File): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}_${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('productService.uploadImage:', error);
      throw new Error('Không thể upload ảnh, vui lòng thử lại.');
    }
  }
};
