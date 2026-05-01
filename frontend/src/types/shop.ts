export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  gallery: string[];
  price: number;
  category: string;
  rating: number; // 1-5
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedOptions?: string[];
  note?: string;
}

export interface Coupon {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
}
