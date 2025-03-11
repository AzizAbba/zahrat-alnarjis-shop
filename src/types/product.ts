
export interface Product {
  id: string;
  name: string;
  arabicName?: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  subcategoryId?: string;
  sizeId?: string;
  colorId?: string;
  smellId?: string;
  stock: number;
  featured?: boolean;
  createdAt?: string;
  // Kept for backward compatibility
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
  displayOrder?: number;
}

export interface Subcategory {
  id: string;
  name: string;
  arabicName?: string;
  categoryId: string; // Parent category ID
  description?: string;
  imageUrl?: string;
  displayOrder?: number;
}

export interface Size {
  id: string;
  name: string;
  arabicName?: string;
  value: string;
  displayOrder?: number;
}

export interface Color {
  id: string;
  name: string;
  arabicName?: string;
  hexCode: string;
  displayOrder?: number;
}

export interface Smell {
  id: string;
  name: string;
  arabicName?: string;
  description?: string;
  displayOrder?: number;
}

export interface DeliveryOption {
  id: string;
  name: string;
  arabicName?: string;
  price: number;
  description?: string;
  arabicDescription?: string;
  estimatedDays?: string;
  isActive: boolean;
  icon?: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  arabicName?: string;
  cities: string[];
  description?: string;
  arabicDescription?: string;
  additionalFee: number;
  isActive: boolean;
}
