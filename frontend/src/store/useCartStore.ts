import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '../types/shop';

interface CartState {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      addToCart: (item) => set((state) => {
        const existingItem = state.cartItems.find(i => i.productId === item.productId);
        if (existingItem) {
          return {
            cartItems: state.cartItems.map(i => 
              i.productId === item.productId 
                ? { ...i, quantity: i.quantity + item.quantity } 
                : i
            )
          };
        }
        return { cartItems: [...state.cartItems, item] };
      }),
      removeFromCart: (id) => set((state) => ({
        cartItems: state.cartItems.filter(i => i.id !== id)
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        cartItems: state.cartItems.map(i => 
          i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
        )
      })),
      clearCart: () => set({ cartItems: [] }),
      getCartTotal: () => {
        const { cartItems } = get();
        return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      }
    }),
    {
      name: 'shop-cart-storage',
    }
  )
);
