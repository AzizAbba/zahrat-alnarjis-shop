
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
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
      email: formData.email ? '' : 'البريد الإلكتروني مطلوب',
      message: formData.message ? '' : 'الرسالة مطلوبة'
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Here you would normally send the form data to your backend
    console.log('Form submitted:', formData);
    
    // Show success message and reset form
    toast.success('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };
  
  return (
    <MainLayout>
      <div className="container max-w-6xl py-12">
        <h1 className="text-3xl font-bold mb-8 text-center arabic">اتصل بنا</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4 arabic">أرسل لنا رسالة</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="arabic">الاسم</Label>
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
                <Label htmlFor="email" className="arabic">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  dir="ltr"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1 arabic">{errors.email}</p>}
              </div>
              
              <div>
                <Label htmlFor="phone" className="arabic">رقم الهاتف (اختياري)</Label>
                <Input
                  id="phone"
                  name="phone"
                  dir="ltr"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <Label htmlFor="message" className="arabic">الرسالة</Label>
                <Textarea
                  id="message"
                  name="message"
                  dir="rtl"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className={errors.message ? 'border-red-500' : ''}
                />
                {errors.message && <p className="text-red-500 text-sm mt-1 arabic">{errors.message}</p>}
              </div>
              
              <Button type="submit" className="w-full">
                إرسال الرسالة
              </Button>
            </form>
          </Card>
          
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 arabic">معلومات التواصل</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium arabic">رقم الهاتف</h3>
                    <p className="text-muted-foreground ltr">+966 55 555 5555</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium arabic">البريد الإلكتروني</h3>
                    <p className="text-muted-foreground ltr">info@narjiscleaning.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium arabic">العنوان</h3>
                    <p className="text-muted-foreground arabic">
                      الرياض، المملكة العربية السعودية<br />
                      طريق الملك فهد، حي العليا
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium arabic">ساعات العمل</h3>
                    <p className="text-muted-foreground arabic">
                      من الأحد إلى الخميس<br />
                      8:00 صباحاً - 5:00 مساءً
                    </p>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 arabic">تابعنا على</h2>
              
              <div className="flex justify-center gap-4">
                <a href="#" className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a href="#" className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactPage;
