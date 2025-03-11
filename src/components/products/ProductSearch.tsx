
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ProductSearchProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ onSearch, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };
  
  return (
    <form onSubmit={handleSubmit} className="relative mb-6">
      <Input
        type="text"
        placeholder="ابحث عن المنتجات..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pr-10 text-right"
      />
      <Button 
        type="submit" 
        variant="ghost" 
        size="icon"
        className="absolute left-0 top-0"
      >
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default ProductSearch;
