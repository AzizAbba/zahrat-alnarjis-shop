
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
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h2 className="text-lg font-semibold mb-3">Categories</h2>
      
      <ul className="space-y-2">
        <li>
          <button 
            onClick={() => onSelectCategory(null)}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
              selectedCategory === null ? 'bg-brand-100 text-brand-700 font-medium' : 'hover:bg-gray-100'
            }`}
          >
            All Products
          </button>
        </li>
        
        {categories.map(category => (
          <li key={category.id}>
            <button 
              onClick={() => onSelectCategory(category.id)}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                selectedCategory === category.id ? 'bg-brand-100 text-brand-700 font-medium' : 'hover:bg-gray-100'
              }`}
            >
              <span className="ltr">{category.name}</span>
              {category.arabicName && (
                <span className="block text-sm text-gray-500 arabic">{category.arabicName}</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryFilter;
