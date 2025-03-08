
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };
  
  return (
    <div 
      className="product-card group cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="relative overflow-hidden aspect-square">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
        {product.featured && (
          <div className="absolute top-2 right-2 bg-brand-500 text-white px-2 py-1 text-xs rounded-full">
            Featured
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold line-clamp-1">{product.name}</h3>
        {product.arabicName && (
          <h4 className="text-sm text-gray-600 arabic mb-1">{product.arabicName}</h4>
        )}
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
          
          <Button 
            size="sm" 
            onClick={handleAddToCart} 
            className="transition-transform hover:scale-105"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
