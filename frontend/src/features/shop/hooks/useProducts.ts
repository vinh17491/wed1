import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService, Product } from '../../../services/productService';

/**
 * Hook lấy danh sách sản phẩm với Caching
 */
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: productService.getProducts,
  });
};

/**
 * Hook xử lý các thay đổi dữ liệu (CRUD)
 */
export const useProductMutations = () => {
  const queryClient = useQueryClient();

  // Thêm sản phẩm (Bao gồm upload ảnh)
  const addMutation = useMutation({
    mutationFn: async (formData: any) => {
      let imageUrl = 'https://via.placeholder.com/600';
      if (formData.imageFile) {
        imageUrl = await productService.uploadImage(formData.imageFile);
      }
      return productService.createProduct({
        ...formData,
        image_url: imageUrl
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  // Cập nhật sản phẩm
  const updateMutation = useMutation({
    mutationFn: async (updatedData: any) => {
      let imageUrl = updatedData.image_url;
      if (updatedData.imageFile) {
        imageUrl = await productService.uploadImage(updatedData.imageFile);
      }
      return productService.updateProduct(updatedData.id, {
        ...updatedData,
        image_url: imageUrl
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  // Xóa sản phẩm
  const deleteMutation = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  return {
    addMutation,
    updateMutation,
    deleteMutation
  };
};
