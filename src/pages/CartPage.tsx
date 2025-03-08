
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();
  
  // If cart is empty, show empty state
  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-6" />
            <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button onClick={() => navigate('/products')}>
              Browse Products
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Cart header */}
              <div className="px-6 py-4 border-b grid grid-cols-12 text-sm font-medium text-gray-500">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              
              {/* Cart items */}
              <div className="divide-y">
                {items.map(item => (
                  <div key={item.product.id} className="px-6 py-4 grid grid-cols-12 items-center">
                    {/* Product info */}
                    <div className="col-span-6 flex items-center">
                      <div className="w-16 h-16 rounded bg-gray-100 mr-4 flex-shrink-0 overflow-hidden">
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 
                          className="font-medium text-gray-900 hover:text-brand-600 cursor-pointer"
                          onClick={() => navigate(`/product/${item.product.id}`)}
                        >
                          {item.product.name}
                        </h3>
                        {item.product.arabicName && (
                          <p className="text-sm text-gray-500 arabic">
                            {item.product.arabicName}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* Price */}
                    <div className="col-span-2 text-center">
                      ${item.product.price.toFixed(2)}
                    </div>
                    
                    {/* Quantity */}
                    <div className="col-span-2 flex justify-center">
                      <div className="flex items-center border rounded-md">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="h-8 w-8 p-0"
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Total and remove */}
                    <div className="col-span-2 text-right space-x-2 flex items-center justify-end">
                      <span className="font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Cart actions */}
              <div className="px-6 py-4 border-t flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/products')}
                >
                  Continue Shopping
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>
          
          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
                <div className="border-t pt-3 mt-3 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-lg">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              
              <Button 
                className="w-full"
                onClick={() => navigate('/checkout')}
                disabled={items.length === 0}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CartPage;
