
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ProductGrid from '@/components/products/ProductGrid';
import CategoryFilter from '@/components/products/CategoryFilter';
import PriceFilter from '@/components/products/PriceFilter';
import ProductSearch from '@/components/products/ProductSearch';
import { useProducts } from '@/contexts/ProductContext';
import { Product } from '@/types/product';

const ProductsPage: React.FC = () => {
  const { products } = useProducts();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get search params
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');
  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [searchQuery, setSearchQuery] = useState(searchParam || '');
  
  // Find min and max prices in products
  const minPrice = Math.floor(Math.min(...products.map(p => p.price)));
  const maxPrice = Math.ceil(Math.max(...products.map(p => p.price)));
  
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
    
    navigate({ search: params.toString() }, { replace: true });
  }, [selectedCategory, searchQuery, priceRange, navigate, minPrice, maxPrice]);
  
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
        <h1 className="text-3xl font-bold mb-8">Our Products</h1>
        
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar with filters */}
          <div className="lg:col-span-1 mb-6 lg:mb-0">
            <ProductSearch onSearch={handleSearch} initialQuery={searchQuery} />
            
            <CategoryFilter 
              selectedCategory={selectedCategory} 
              onSelectCategory={handleCategorySelect} 
            />
            
            <PriceFilter 
              minPrice={minPrice} 
              maxPrice={maxPrice} 
              priceRange={priceRange} 
              onPriceChange={handlePriceChange} 
            />
          </div>
          
          {/* Product grid */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              </p>
              
              <SortOptions products={filteredProducts} />
            </div>
            
            <ProductGrid 
              products={filteredProducts} 
              emptyMessage="No products match your filters. Try adjusting your search criteria."
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// Helper component for sort options
const SortOptions: React.FC<{ products: Product[] }> = ({ products }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sort = searchParams.get('sort') || 'default';
  
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
      <span className="text-gray-600 mr-2">Sort by:</span>
      <select 
        value={sort}
        onChange={handleSortChange}
        className="border rounded-md px-3 py-1.5 bg-white text-gray-800"
      >
        <option value="default">Default</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="name-asc">Name: A to Z</option>
        <option value="name-desc">Name: Z to A</option>
      </select>
    </div>
  );
};

export default ProductsPage;
