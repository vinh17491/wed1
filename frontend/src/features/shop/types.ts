export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category: string;
  created_at?: string;
}

export interface ShopFilters {
  search: string;
  category: string;
  priceRange: [number, number];
}

export type CreateProductPayload = Omit<Product, 'id' | 'created_at'>;
