
import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { useOrders } from '@/contexts/OrderContext';
import MainLayout from '@/components/layout/MainLayout';

const CheckoutPage = () => {
  const { cart, clearCart, totalPrice } = useCart();
  const { addOrder } = useOrders();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    address: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {
      name: formData.name ? '' : 'الاسم مطلوب',
      phone: formData.phone ? '' : 'رقم الهاتف مطلوب',
      address: formData.address ? '' : 'العنوان مطلوب'
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (cart.length === 0) {
      toast.error('السلة فارغة');
      return;
    }
    
    // Create order
    const order = {
      id: Date.now().toString(),
      items: cart,
      customerInfo: formData,
      status: 'pending',
      totalPrice: totalPrice,
      date: new Date().toISOString()
    };
    
    addOrder(order);
    clearCart();
    toast.success('تم إرسال طلبك بنجاح');
    navigate('/');
  };
  
  return (
    <MainLayout>
      <div className="container max-w-6xl py-8">
        <h1 className="text-3xl font-bold mb-8 text-center arabic">إتمام الطلب</h1>
        
        {cart.length === 0 ? (
          <div className="text-center p-8">
            <h2 className="text-xl arabic">السلة فارغة</h2>
            <Button 
              onClick={() => navigate('/products')} 
              className="mt-4"
            >
              تصفح المنتجات
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 arabic">معلومات التوصيل</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="arabic">الاسم الكامل</Label>
                    <Input
                      id="name"
                      name="name"
                      dir="rtl"
                      value={formData.name}
                      onChange={handleChange}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1 arabic">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="arabic">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      name="phone"
                      dir="rtl"
                      value={formData.phone}
                      onChange={handleChange}
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1 arabic">{errors.phone}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="address" className="arabic">عنوان التوصيل</Label>
                    <Textarea
                      id="address"
                      name="address"
                      dir="rtl"
                      value={formData.address}
                      onChange={handleChange}
                      className={errors.address ? 'border-red-500' : ''}
                      rows={3}
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1 arabic">{errors.address}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="notes" className="arabic">ملاحظات إضافية (اختياري)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      dir="rtl"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={2}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    تأكيد الطلب
                  </Button>
                </form>
              </Card>
            </div>
            
            <div>
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 arabic">ملخص الطلب</h2>
                <div className="space-y-4">
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between arabic text-sm border-b pb-2">
                        <span>{item.name} (×{item.quantity})</span>
                        <span>{(item.price * item.quantity).toFixed(2)} ريال</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between pt-2 border-t font-bold">
                    <span className="arabic">المجموع</span>
                    <span className="arabic">{totalPrice.toFixed(2)} ريال</span>
                  </div>
                  
                  <div className="bg-muted p-3 rounded text-sm arabic">
                    <p className="font-semibold">طريقة الدفع: الدفع عند الاستلام</p>
                    <p className="mt-1">سيتم التواصل معكم لتأكيد الطلب</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;
