
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  
  const handleIncreaseQuantity = (productId: string, currentQuantity: number, stock: number) => {
    if (currentQuantity < stock) {
      updateQuantity(productId, currentQuantity + 1);
    } else {
      toast({
        title: "تم الوصول للحد الأقصى",
        description: "لا يمكن إضافة المزيد من هذا المنتج",
        variant: "destructive"
      });
    }
  };
  
  const handleDecreaseQuantity = (productId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(productId, currentQuantity - 1);
    } else {
      removeFromCart(productId);
    }
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">سلة التسوق</h1>
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="hover:bg-red-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="arabic">متابعة التسوق</span>
          </Button>
        </div>
        
        {items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border shadow-sm">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold mb-2 arabic">سلة التسوق فارغة</h2>
            <p className="text-gray-500 mb-6 arabic">لم تقم بإضافة أي منتجات إلى سلة التسوق بعد</p>
            <Button onClick={() => navigate('/products')} className="arabic">
              تصفح المنتجات
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-50 border-b">
                  <div className="grid grid-cols-4 font-medium text-gray-600">
                    <div className="col-span-2 arabic">المنتج</div>
                    <div className="hidden sm:block text-center arabic">الكمية</div>
                    <div className="text-right arabic">السعر</div>
                  </div>
                </div>
                
                <div className="divide-y">
                  {items.map(item => (
                    <div key={item.product.id} className="cart-item">
                      <div className="cart-item-details">
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.product.name} 
                          className="w-20 h-20 object-cover rounded"
                        />
                        
                        <div className="ml-4">
                          <h3 className="font-medium">{item.product.arabicName || item.product.name}</h3>
                          <p className="text-sm text-gray-500 mb-2">{item.product.price.toFixed(2)} ريال</p>
                          
                          {/* Mobile quantity controls */}
                          <div className="sm:hidden cart-quantity">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleDecreaseQuantity(item.product.id, item.quantity)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="mx-3 font-bold">{item.quantity}</span>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleIncreaseQuantity(item.product.id, item.quantity, item.product.stock)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Desktop quantity controls */}
                      <div className="hidden sm:flex cart-quantity">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleDecreaseQuantity(item.product.id, item.quantity)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="mx-3 font-bold">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleIncreaseQuantity(item.product.id, item.quantity, item.product.stock)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="flex justify-between items-center mt-3 w-full sm:w-auto">
                        <span className="font-bold sm:hidden arabic">الإجمالي:</span>
                        <div className="flex items-center gap-2">
                          <span className="cart-price">
                            {(item.product.price * item.quantity).toFixed(2)} ريال
                          </span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 bg-gray-50 flex flex-col sm:flex-row gap-3 sm:justify-between">
                  <Button 
                    variant="outline" 
                    onClick={clearCart}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span className="arabic">إفراغ السلة</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/products')}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    <span className="arabic">متابعة التسوق</span>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg border shadow-sm p-6 sticky top-20">
                <h2 className="text-xl font-bold mb-4 arabic">ملخص الطلب</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600 arabic">إجمالي المنتجات:</span>
                    <span className="font-semibold">{totalPrice.toFixed(2)} ريال</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 arabic">الشحن:</span>
                    <span className="text-green-600 arabic">مجاناً</span>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span className="arabic">المجموع:</span>
                    <span>{totalPrice.toFixed(2)} ريال</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    className="w-full"
                    onClick={() => navigate('/checkout')}
                    size="lg"
                  >
                    <span className="arabic">الدفع والتوصيل</span>
                  </Button>
                  
                  <Button 
                    variant="secondary"
                    className="w-full"
                    onClick={() => navigate('/products')}
                  >
                    <span className="arabic">إضافة المزيد من المنتجات</span>
                  </Button>
                </div>
                
                <p className="text-sm text-center text-gray-500 mt-4 arabic">
                  بالضغط على زر الدفع والتوصيل أنت توافق على 
                  <Link to="/terms" className="underline mx-1 text-red-600">
                    سياسة الاستخدام
                  </Link>
                  و
                  <Link to="/privacy" className="underline mx-1 text-red-600">
                    سياسة الخصوصية
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CartPage;
