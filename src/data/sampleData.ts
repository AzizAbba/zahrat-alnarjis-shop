
import { Product, Category } from '@/types/product';

export const sampleCategories: Category[] = [
  {
    id: '1',
    name: 'Floor Cleaners',
    arabicName: 'منظفات الأرضيات',
    imageUrl: 'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: '2',
    name: 'Glass Cleaners',
    arabicName: 'منظفات الزجاج',
    imageUrl: 'https://images.pexels.com/photos/5218014/pexels-photo-5218014.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: '3',
    name: 'Kitchen Cleaners',
    arabicName: 'منظفات المطبخ',
    imageUrl: 'https://images.pexels.com/photos/4108721/pexels-photo-4108721.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: '4',
    name: 'Bathroom Cleaners',
    arabicName: 'منظفات الحمام',
    imageUrl: 'https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: '5',
    name: 'Laundry Products',
    arabicName: 'منتجات الغسيل',
    imageUrl: 'https://images.pexels.com/photos/5591581/pexels-photo-5591581.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  }
];

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Multi-Surface Floor Cleaner',
    arabicName: 'منظف أرضيات متعدد الأسطح',
    description: 'Cleans and shines multiple floor surfaces including tile, wood, and laminate.',
    price: 15.99,
    imageUrl: 'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryId: '1',
    stock: 50,
    featured: true
  },
  {
    id: '2',
    name: 'Streak-Free Glass Cleaner',
    arabicName: 'منظف زجاج بدون خطوط',
    description: 'Leaves glass surfaces sparkling clean without streaks or residue.',
    price: 8.99,
    imageUrl: 'https://images.pexels.com/photos/5218014/pexels-photo-5218014.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryId: '2',
    stock: 75,
    featured: true
  },
  {
    id: '3',
    name: 'Kitchen Degreaser',
    arabicName: 'مزيل الدهون للمطبخ',
    description: 'Powerful formula cuts through tough grease and food residue on kitchen surfaces.',
    price: 12.49,
    imageUrl: 'https://images.pexels.com/photos/4108721/pexels-photo-4108721.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryId: '3',
    stock: 40,
    featured: false
  },
  {
    id: '4',
    name: 'Bathroom Tile Cleaner',
    arabicName: 'منظف بلاط الحمام',
    description: 'Removes soap scum, mildew, and hard water stains from bathroom tiles and fixtures.',
    price: 10.99,
    imageUrl: 'https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryId: '4',
    stock: 60,
    featured: false
  },
  {
    id: '5',
    name: 'Lavender Laundry Detergent',
    arabicName: 'منظف الغسيل برائحة الخزامى',
    description: 'Gentle yet effective laundry detergent with a fresh lavender scent.',
    price: 18.99,
    imageUrl: 'https://images.pexels.com/photos/5591581/pexels-photo-5591581.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryId: '5',
    stock: 30,
    featured: true
  },
  {
    id: '6',
    name: 'Hardwood Floor Polish',
    arabicName: 'ملمع أرضيات خشبية',
    description: 'Restores shine to hardwood floors while providing protection against scratches.',
    price: 16.99,
    imageUrl: 'https://images.pexels.com/photos/4108724/pexels-photo-4108724.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryId: '1',
    stock: 25,
    featured: false
  },
  {
    id: '7',
    name: 'Stainless Steel Cleaner',
    arabicName: 'منظف الفولاذ المقاوم للصدأ',
    description: 'Specially formulated to clean and polish stainless steel appliances and surfaces.',
    price: 9.99,
    imageUrl: 'https://images.pexels.com/photos/5217932/pexels-photo-5217932.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryId: '3',
    stock: 45,
    featured: false
  },
  {
    id: '8',
    name: 'Toilet Bowl Cleaner',
    arabicName: 'منظف المرحاض',
    description: 'Removes tough stains and eliminates odors from toilet bowls.',
    price: 7.49,
    imageUrl: 'https://images.pexels.com/photos/4239094/pexels-photo-4239094.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryId: '4',
    stock: 70,
    featured: false
  }
];

// Export the categories array explicitly to fix import issues
export const categories = sampleCategories;
