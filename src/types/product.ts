
export interface Product {
  id: string;
  name: string;
  arabicName?: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  stock: number;
  featured?: boolean;
  createdAt?: string;
  // Add these properties to match AdminProductsPage.tsx usage
  category?: string;
  image?: string;
  inStock?: boolean;
}

export interface Category {
  id: string;
  name: string;
  arabicName?: string;
  description?: string;
  imageUrl?: string;
}
