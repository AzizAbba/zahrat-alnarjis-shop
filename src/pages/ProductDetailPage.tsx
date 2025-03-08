
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useProducts } from '@/contexts/ProductContext';
import { useCart } from '@/contexts/CartContext';
import ProductCard from '@/components/products/ProductCard';

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { products, categories } = useProducts();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  // Find the product by ID
  const product = products.find(p => p.id === productId);
  
  // If product not found, redirect to products page
  if (!product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">
            The product you are looking for does not exist or has been removed.
          </p>
          <Button onClick={() => navigate('/products')}>
            View All Products
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  // Find the product's category
  const category = categories.find(c => c.id === product.categoryId);
  
  // Find related products (same category, excluding current product)
  const relatedProducts = products
    .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);
  
  // Quantity selector state
  const [quantity, setQuantity] = useState(1);
  
  // Increase quantity
  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };
  
  // Decrease quantity
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  // Add to cart handler
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb navigation */}
        <div className="flex items-center mb-8 text-sm">
          <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to="/products" className="text-gray-500 hover:text-gray-700">Products</Link>
          {category && (
            <>
              <span className="mx-2 text-gray-400">/</span>
              <Link 
                to={`/products?category=${category.id}`} 
                className="text-gray-500 hover:text-gray-700"
              >
                {category.name}
              </Link>
            </>
          )}
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>
        
        {/* Back button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        {/* Product detail */}
        <div className="grid md:grid-cols-2 gap-10 mb-12">
          {/* Product image */}
          <div className="bg-white rounded-lg overflow-hidden shadow-lg">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-auto object-cover"
            />
          </div>
          
          {/* Product info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            {product.arabicName && (
              <h2 className="text-xl text-gray-600 mb-4 arabic">{product.arabicName}</h2>
            )}
            
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-brand-600">${product.price.toFixed(2)}</span>
              
              <div className="ml-4 py-1 px-3 bg-gray-100 rounded-full text-sm text-gray-700">
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </div>
            </div>
            
            <div className="border-t border-b py-4 my-6">
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            {category && (
              <div className="mb-6">
                <span className="text-gray-500">Category: </span>
                <Link 
                  to={`/products?category=${category.id}`}
                  className="text-brand-600 hover:underline"
                >
                  {category.name}
                </Link>
              </div>
            )}
            
            {/* Quantity selector */}
            <div className="flex items-center mb-6">
              <span className="text-gray-700 mr-4">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="h-10 px-3"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                
                <span className="w-12 text-center">{quantity}</span>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                  className="h-10 px-3"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Add to cart button */}
            <Button 
              size="lg" 
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="w-full md:w-auto"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>
        
        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="border-t pt-12">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ProductDetailPage;
