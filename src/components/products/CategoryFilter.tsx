
import React from 'react';
import { Category } from '@/types/product';
import { useProducts } from '@/contexts/ProductContext';
import { Tag, ChevronRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-narcissus-100">
      <div className="flex items-center mb-3">
        <Tag className="h-5 w-5 text-narcissus-600 mr-2" />
        <h2 className="text-lg font-semibold arabic text-narcissus-800">التصنيفات</h2>
      </div>
      
      <ScrollArea className="h-[calc(100vh-300px)] pr-4">
        <ul className="space-y-1.5">
          <li>
            <button 
              onClick={() => onSelectCategory(null)}
              className={`w-full text-right px-3 py-2.5 rounded-md transition-all flex items-center justify-between ${
                selectedCategory === null 
                  ? 'bg-narcissus-100 text-narcissus-800 font-medium shadow-sm' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span className="arabic">جميع المنتجات</span>
              {selectedCategory === null && (
                <ChevronRight className="h-4 w-4 text-narcissus-600" />
              )}
            </button>
          </li>
          
          {categories.map(category => (
            <li key={category.id}>
              <button 
                onClick={() => onSelectCategory(category.id)}
                className={`w-full text-right px-3 py-2.5 rounded-md transition-all flex items-center justify-between ${
                  selectedCategory === category.id 
                    ? 'bg-narcissus-100 text-narcissus-800 font-medium shadow-sm' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                {category.arabicName ? (
                  <span className="arabic">{category.arabicName}</span>
                ) : (
                  <span className="ltr">{category.name}</span>
                )}
                {selectedCategory === category.id && (
                  <ChevronRight className="h-4 w-4 text-narcissus-600" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
};

export default CategoryFilter;
