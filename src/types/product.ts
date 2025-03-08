
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
}

export interface Category {
  id: string;
  name: string;
  arabicName?: string;
  description?: string;
  imageUrl?: string;
}
