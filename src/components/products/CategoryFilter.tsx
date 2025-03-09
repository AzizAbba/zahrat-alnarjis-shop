
import React from 'react';
import { Category } from '@/types/product';
import { useProducts } from '@/contexts/ProductContext';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  selectedCategory, 
  onSelectCategory 
}) => {
  const { categories } = useProducts();
  
  return (
    <div className="bg-card rounded-lg shadow-sm p-4 mb-6 border border-narcissus-100">
      <h2 className="text-lg font-semibold mb-3 arabic text-narcissus-800">التصنيفات</h2>
      
      <ul className="space-y-2">
        <li>
          <button 
            onClick={() => onSelectCategory(null)}
            className={`w-full text-right px-3 py-2 rounded-md transition-colors ${
              selectedCategory === null 
                ? 'bg-narcissus-100 text-narcissus-800 font-medium shadow-sm' 
                : 'hover:bg-gray-100'
            }`}
          >
            <span className="arabic">جميع المنتجات</span>
          </button>
        </li>
        
        {categories.map(category => (
          <li key={category.id}>
            <button 
              onClick={() => onSelectCategory(category.id)}
              className={`w-full text-right px-3 py-2 rounded-md transition-colors ${
                selectedCategory === category.id 
                  ? 'bg-narcissus-100 text-narcissus-800 font-medium shadow-sm' 
                  : 'hover:bg-gray-100'
              }`}
            >
              {category.arabicName ? (
                <span className="arabic">{category.arabicName}</span>
              ) : (
                <span className="ltr">{category.name}</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryFilter;
