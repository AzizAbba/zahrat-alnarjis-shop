
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
import { useProducts } from '@/contexts/ProductContext';
import MainLayout from '@/components/layout/MainLayout';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Truck, Package, Clock } from 'lucide-react';

const CheckoutPage = () => {
  const { cart, clearCart, totalPrice } = useCart();
  const { addOrder } = useOrders();
  const { deliveryOptions, deliveryZones } = useProducts();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
    deliveryOptionId: deliveryOptions.length > 0 ? deliveryOptions[0].id : '',
    deliveryZoneId: deliveryZones.length > 0 ? deliveryZones[0].id : ''
  });
  
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      address: formData.address ? '' : 'العنوان مطلوب',
      city: formData.city ? '' : 'المدينة مطلوبة'
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
    
    // Get selected delivery option
    const selectedDeliveryOption = deliveryOptions.find(option => option.id === formData.deliveryOptionId);
    const selectedDeliveryZone = deliveryZones.find(zone => zone.id === formData.deliveryZoneId);
    
    // Calculate total with delivery
    const deliveryFee = (selectedDeliveryOption?.price || 0) + (selectedDeliveryZone?.additionalFee || 0);
    const finalTotal = totalPrice + deliveryFee;
    
    // Create order
    const order = {
      id: Date.now().toString(),
      items: cart,
      customerInfo: {
        ...formData,
        deliveryOption: selectedDeliveryOption?.name || '',
        deliveryZone: selectedDeliveryZone?.name || '',
        deliveryFee
      },
      status: 'pending',
      totalPrice: finalTotal,
      subtotal: totalPrice,
      deliveryFee,
      date: new Date().toISOString()
    };
    
    addOrder(order);
    clearCart();
    toast.success('تم إرسال طلبك بنجاح');
    navigate('/');
  };

  // Get selected delivery option details
  const selectedDeliveryOption = deliveryOptions.find(option => option.id === formData.deliveryOptionId);
  const selectedDeliveryZone = deliveryZones.find(zone => zone.id === formData.deliveryZoneId);
  const deliveryFee = (selectedDeliveryOption?.price || 0) + (selectedDeliveryZone?.additionalFee || 0);
  const finalTotal = totalPrice + deliveryFee;
  
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
              <Card className="p-6 mb-6">
                <h2 className="text-xl font-bold mb-4 arabic">معلومات التوصيل</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="address" className="arabic">عنوان التوصيل</Label>
                      <Input
                        id="address"
                        name="address"
                        dir="rtl"
                        value={formData.address}
                        onChange={handleChange}
                        className={errors.address ? 'border-red-500' : ''}
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-1 arabic">{errors.address}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="city" className="arabic">المدينة</Label>
                      <Input
                        id="city"
                        name="city"
                        dir="rtl"
                        value={formData.city}
                        onChange={handleChange}
                        className={errors.city ? 'border-red-500' : ''}
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1 arabic">{errors.city}</p>}
                    </div>
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
                  
                  <div className="mt-4">
                    <Label className="text-lg font-medium arabic mb-3">اختر منطقة التوصيل</Label>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      {deliveryZones.filter(zone => zone.isActive).map((zone) => (
                        <label key={zone.id} className={`flex items-center border p-3 rounded-md cursor-pointer ${formData.deliveryZoneId === zone.id ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                          <input
                            type="radio"
                            name="deliveryZoneId"
                            value={zone.id}
                            checked={formData.deliveryZoneId === zone.id}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div className="flex-1">
                            <p className="font-medium arabic">{zone.arabicName || zone.name}</p>
                            <p className="text-sm text-muted-foreground arabic">{zone.arabicDescription || zone.description || 'المدن: ' + zone.cities.join('، ')}</p>
                            {zone.additionalFee > 0 && (
                              <p className="text-sm font-medium text-red-600 arabic mt-1">رسوم إضافية: {zone.additionalFee} ريال</p>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Label className="text-lg font-medium arabic mb-3">اختر طريقة التوصيل</Label>
                    <RadioGroup
                      value={formData.deliveryOptionId}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, deliveryOptionId: value }))}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2"
                    >
                      {deliveryOptions.filter(option => option.isActive).map((option) => (
                        <label
                          key={option.id}
                          className={`flex flex-col items-center border rounded-lg p-4 cursor-pointer transition-colors ${
                            formData.deliveryOptionId === option.id ? 'border-primary bg-primary/5' : 'border-gray-200'
                          }`}
                        >
                          <RadioGroupItem value={option.id} id={option.id} className="sr-only" />
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
                            {option.icon === 'truck' && <Truck className="h-5 w-5" />}
                            {option.icon === 'package' && <Package className="h-5 w-5" />}
                            {(!option.icon || option.icon === 'store') && <Clock className="h-5 w-5" />}
                          </div>
                          <div className="text-center">
                            <p className="font-medium arabic">{option.arabicName || option.name}</p>
                            <p className="text-sm text-muted-foreground arabic">{option.arabicDescription || option.description || ''}</p>
                            {option.estimatedDays && (
                              <p className="text-xs text-muted-foreground arabic mt-1">
                                {option.estimatedDays.includes('-') 
                                  ? `${option.estimatedDays.replace('-', '-')} أيام` 
                                  : `${option.estimatedDays} ${parseInt(option.estimatedDays) > 1 ? 'أيام' : 'يوم'}`}
                              </p>
                            )}
                            <p className="font-medium text-primary arabic mt-2">{option.price === 0 ? 'مجاناً' : `${option.price} ريال`}</p>
                          </div>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  <Button type="submit" className="w-full mt-6">
                    تأكيد الطلب
                  </Button>
                </form>
              </Card>
            </div>
            
            <div>
              <Card className="p-6 sticky top-20">
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
                  
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="arabic">المجموع الفرعي</span>
                      <span className="arabic">{totalPrice.toFixed(2)} ريال</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="arabic">رسوم التوصيل</span>
                      <span className="arabic">{deliveryFee.toFixed(2)} ريال</span>
                    </div>
                    
                    <div className="flex justify-between pt-2 border-t font-bold">
                      <span className="arabic">الإجمالي</span>
                      <span className="arabic">{finalTotal.toFixed(2)} ريال</span>
                    </div>
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
