
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    toast.success('تمت إضافة المنتج إلى السلة');
  };
  
  return (
    <div 
      className="product-card group cursor-pointer border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="relative overflow-hidden aspect-square">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        {product.featured && (
          <div className="absolute top-2 right-2 bg-yellow-300 text-red-800 px-2 py-1 text-xs font-bold rounded-full">
            مميز
          </div>
        )}
        {(product.stock <= 0) && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs rounded-full">
            غير متوفر
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold line-clamp-1 text-right">
          {product.arabicName || product.name}
        </h3>
        {product.arabicName && (
          <h4 className="text-sm text-gray-600 mb-1 ltr line-clamp-1">{product.name}</h4>
        )}
        <p className="text-gray-600 text-sm mb-2 line-clamp-2 text-right">{product.description}</p>
        
        <div className="flex items-center justify-between mt-3 gap-2">
          <span className="text-lg font-bold text-red-700">{product.price.toFixed(2)} ريال</span>
          
          <Button 
            size="sm" 
            onClick={handleAddToCart} 
            className="transition-transform hover:scale-105"
            variant={product.stock > 0 ? "yellow" : "outline"}
            disabled={product.stock <= 0}
          >
            <ShoppingCart className="h-4 w-4 ml-1" />
            <span className="arabic">{product.stock > 0 ? 'إضافة للسلة' : 'غير متوفر'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
