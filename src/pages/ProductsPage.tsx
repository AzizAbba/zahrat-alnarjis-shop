
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
  const { getContentForPage } = useContent();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get page content
  const headerContent = getContentForPage('products', 'header');
  
  // Get search params
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');
  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');
  const sortParam = searchParams.get('sort') || 'default';
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [searchQuery, setSearchQuery] = useState(searchParam || '');
  
  // Find min and max prices in products
  const minPrice = products.length ? Math.floor(Math.min(...products.map(p => p.price))) : 0;
  const maxPrice = products.length ? Math.ceil(Math.max(...products.map(p => p.price))) : 100;
  
  // Price filter state
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPriceParam ? parseInt(minPriceParam) : minPrice,
    maxPriceParam ? parseInt(maxPriceParam) : maxPrice
  ]);
  
  // Update URL when filters change
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
  
  // Filter products based on all criteria
  const filteredProducts = products.filter(product => {
    // Category filter
    if (selectedCategory && product.categoryId !== selectedCategory) {
      return false;
    }
    
    // Search filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !product.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Price filter
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    
    return true;
  });
  
  // Sort products based on the sortParam
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
  
  // Handle category selection
  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  // Handle price change
  const handlePriceChange = (values: [number, number]) => {
    setPriceRange(values);
  };
  
  return (
    <MainLayout onSearch={handleSearch}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-red-600">
          {headerContent?.title || 'منتجاتنا'}
        </h1>
        
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar with filters */}
          <div className="w-full lg:w-1/4 mb-6 lg:mb-0 lg:pr-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border sticky top-20">
              <ProductSearch onSearch={handleSearch} initialQuery={searchQuery} />
              
              <div className="mt-4">
                <CategoryFilter 
                  selectedCategory={selectedCategory} 
                  onSelectCategory={handleCategorySelect} 
                />
              </div>
              
              <div className="mt-4">
                <PriceFilter 
                  minPrice={minPrice} 
                  maxPrice={maxPrice} 
                  priceRange={priceRange} 
                  onPriceChange={handlePriceChange} 
                />
              </div>
            </div>
          </div>
          
          {/* Product grid */}
          <div className="w-full lg:w-3/4">
            <div className="bg-white p-4 rounded-lg shadow-sm border mb-4">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">
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
      </div>
    </MainLayout>
  );
};

// Helper component for sort options
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
