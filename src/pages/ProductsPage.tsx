
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ProductGrid from '@/components/products/ProductGrid';
import CategoryFilter from '@/components/products/CategoryFilter';
import PriceFilter from '@/components/products/PriceFilter';
import ProductSearch from '@/components/products/ProductSearch';
import { useProducts } from '@/contexts/ProductContext';
import { useContent } from '@/components/layout/MainLayout';

const ProductsPage: React.FC = () => {
  const { products } = useProducts();
  const location = useLocation();
  const navigate = useNavigate();
  
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');
  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');
  const sortParam = searchParams.get('sort') || 'default';
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [searchQuery, setSearchQuery] = useState(searchParam || '');
  
  const minPrice = products.length ? Math.floor(Math.min(...products.map(p => p.price))) : 0;
  const maxPrice = products.length ? Math.ceil(Math.max(...products.map(p => p.price))) : 100;
  
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPriceParam ? parseInt(minPriceParam) : minPrice,
    maxPriceParam ? parseInt(maxPriceParam) : maxPrice
  ]);
  
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (selectedCategory) {
      params.set('category', selectedCategory);
    }
    
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    
    if (priceRange[0] > minPrice) {
      params.set('minPrice', priceRange[0].toString());
    }
    
    if (priceRange[1] < maxPrice) {
      params.set('maxPrice', priceRange[1].toString());
    }
    
    if (sortParam !== 'default') {
      params.set('sort', sortParam);
    }
    
    navigate({ search: params.toString() }, { replace: true });
  }, [selectedCategory, searchQuery, priceRange, navigate, minPrice, maxPrice, sortParam]);
  
  const filteredProducts = products.filter(product => {
    if (selectedCategory && product.categoryId !== selectedCategory) {
      return false;
    }
    
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !product.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    
    return true;
  });
  
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortParam) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });
  
  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handlePriceChange = (values: [number, number]) => {
    setPriceRange(values);
  };
  
  return (
    <MainLayout onSearch={handleSearch} pageName="products">
      <div className="container mx-auto px-4 py-8">
        <ProductPageContent 
          sortedProducts={sortedProducts}
          selectedCategory={selectedCategory}
          handleCategorySelect={handleCategorySelect}
          searchQuery={searchQuery}
          handleSearch={handleSearch}
          minPrice={minPrice}
          maxPrice={maxPrice}
          priceRange={priceRange}
          handlePriceChange={handlePriceChange}
          sortParam={sortParam}
        />
      </div>
    </MainLayout>
  );
};

interface ProductPageContentProps {
  sortedProducts: any[];
  selectedCategory: string | null;
  handleCategorySelect: (categoryId: string | null) => void;
  searchQuery: string;
  handleSearch: (query: string) => void;
  minPrice: number;
  maxPrice: number;
  priceRange: [number, number];
  handlePriceChange: (values: [number, number]) => void;
  sortParam: string;
}

const ProductPageContent: React.FC<ProductPageContentProps> = ({
  sortedProducts,
  selectedCategory,
  handleCategorySelect,
  searchQuery,
  handleSearch,
  minPrice,
  maxPrice,
  priceRange,
  handlePriceChange,
  sortParam
}) => {
  const { getPageContent } = useContent();
  
  const headerContent = getPageContent('products', 'header');
  
  return (
    <>
      <h1 className="text-3xl font-bold mb-8 text-red-600">
        {headerContent?.title || 'منتجاتنا'}
      </h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/4 mb-6 lg:mb-0">
          <div className="bg-white p-5 rounded-lg shadow-sm border sticky top-20">
            <div className="mb-6">
              <ProductSearch onSearch={handleSearch} initialQuery={searchQuery} />
            </div>
            
            <div className="mb-6">
              <CategoryFilter 
                selectedCategory={selectedCategory} 
                onSelectCategory={handleCategorySelect} 
              />
            </div>
            
            <div>
              <PriceFilter 
                minPrice={minPrice} 
                maxPrice={maxPrice} 
                priceRange={priceRange} 
                onPriceChange={handlePriceChange} 
              />
            </div>
          </div>
        </div>
        
        <div className="w-full lg:w-3/4">
          <div className="bg-white p-4 rounded-lg shadow-sm border mb-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-600 arabic">
                عرض {sortedProducts.length} منتج{sortedProducts.length !== 1 ? 'ات' : ''}
              </p>
              
              <SortOptions sortParam={sortParam} />
            </div>
          </div>
          
          <ProductGrid 
            products={sortedProducts} 
            emptyMessage="لا توجد منتجات تطابق معايير البحث المحددة. حاول تعديل معايير البحث."
          />
        </div>
      </div>
    </>
  );
};

const SortOptions: React.FC<{ sortParam: string }> = ({ sortParam }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(location.search);
    
    if (value === 'default') {
      params.delete('sort');
    } else {
      params.set('sort', value);
    }
    
    navigate({ search: params.toString() }, { replace: true });
  };
  
  return (
    <div className="flex items-center">
      <span className="text-gray-600 ml-2">ترتيب حسب:</span>
      <select 
        value={sortParam}
        onChange={handleSortChange}
        className="border rounded-md px-3 py-1.5 bg-white text-gray-800"
      >
        <option value="default">الافتراضي</option>
        <option value="price-low">السعر: من الأقل إلى الأعلى</option>
        <option value="price-high">السعر: من الأعلى إلى الأقل</option>
        <option value="name-asc">الاسم: أ-ي</option>
        <option value="name-desc">الاسم: ي-أ</option>
      </select>
    </div>
  );
};

export default ProductsPage;
