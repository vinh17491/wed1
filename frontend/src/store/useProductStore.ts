import { create } from 'zustand';
import { Product, productService } from '../services/productService';

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'created_at'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const products = await productService.getProducts();
      set({ products, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  addProduct: async (newProductData) => {
    set({ loading: true, error: null });
    try {
      const newProduct = await productService.createProduct(newProductData);
      set((state) => ({ 
        products: [newProduct, ...state.products], 
        loading: false 
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateProduct: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const updatedProduct = await productService.updateProduct(id, updates);
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await productService.deleteProduct(id);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  getProductById: (id) => {
    return get().products.find((p) => p.id === id);
  },
}));
