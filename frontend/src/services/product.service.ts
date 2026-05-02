import { supabase } from '../core/supabaseClient';
import { Product, CreateProductPayload } from '../features/shop/types';

export const productService = {
  /**
   * Lấy toàn bộ danh sách sản phẩm
   */
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Fetch failed: ${error.message}`);
    return data || [];
  },

  /**
   * Thêm sản phẩm mới
   */
  async create(payload: CreateProductPayload): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(`Create failed: ${error.message}`);
    return data;
  },

  /**
   * Cập nhật sản phẩm
   */
  async update(id: string, updates: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Update failed: ${error.message}`);
    return data;
  },

  /**
   * Xóa sản phẩm
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Delete failed: ${error.message}`);
  },

  /**
   * Upload hình ảnh
   */
  async uploadImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}_${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file);

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return publicUrl;
  }
};
