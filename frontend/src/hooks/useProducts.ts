import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/product.service';

/**
 * Hook truy vấn danh sách sản phẩm
 */
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll(),
  });
};

/**
 * Hook xử lý thay đổi dữ liệu (Mutations)
 */
export const useProductMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (formData: any) => {
      let imageUrl = formData.image_url || 'https://via.placeholder.com/600';
      if (formData.imageFile) {
        imageUrl = await productService.uploadImage(formData.imageFile);
      }
      return productService.create({ ...formData, image_url: imageUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedData: any) => {
      let imageUrl = updatedData.image_url;
      if (updatedData.imageFile) {
        imageUrl = await productService.uploadImage(updatedData.imageFile);
      }
      return productService.update(updatedData.id, { ...updatedData, image_url: imageUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  return {
    createProduct: createMutation,
    updateProduct: updateMutation,
    deleteProduct: deleteMutation,
    isMutating: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending
  };
};
