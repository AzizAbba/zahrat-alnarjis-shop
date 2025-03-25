
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useContent } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useMessages } from '@/contexts/MessageContext';
import { MapPin, Phone, Mail } from 'lucide-react';

const ContactPage = () => {
  const { getPageContent } = useContent();
  const { addMessage } = useMessages();
  const contactInfo = getPageContent('contact', 'info');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'الاسم مطلوب';
    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
    }
    if (!formData.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
    if (!formData.subject.trim()) newErrors.subject = 'الموضوع مطلوب';
    if (!formData.message.trim()) newErrors.message = 'الرسالة مطلوبة';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      addMessage(formData);
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-8 text-center arabic">اتصل بنا</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6 arabic">{contactInfo?.title || 'معلومات الاتصال'}</h2>
            <p className="mb-6 arabic">{contactInfo?.content || 'يمكنكم التواصل معنا عبر الهاتف أو البريد الإلكتروني أو من خلال النموذج أدناه.'}</p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-narcissus-600 mt-1 ml-3" />
                <div>
                  <h3 className="font-medium arabic">العنوان</h3>
                  <p className="text-gray-600 arabic">شارع الملك فهد، الرياض، المملكة العربية السعودية</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-6 w-6 text-narcissus-600 mt-1 ml-3" />
                <div>
                  <h3 className="font-medium arabic">الهاتف</h3>
                  <p className="text-gray-600">+966 12 345 6789</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-narcissus-600 mt-1 ml-3" />
                <div>
                  <h3 className="font-medium arabic">البريد الإلكتروني</h3>
                  <p className="text-gray-600">info@zharnarjis.com</p>
                </div>
              </div>
            </div>
            
            {contactInfo?.imageUrl && (
              <div className="mt-8">
                <img 
                  src={contactInfo.imageUrl} 
                  alt="اتصل بنا" 
                  className="rounded-lg w-full h-auto"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              </div>
            )}
          </div>
          
          {/* Contact Form */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6 arabic">نموذج التواصل</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 arabic">الاسم</label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full ${errors.name ? 'border-red-500' : ''}`}
                  dir="rtl"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1 arabic">{errors.name}</p>}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 arabic">البريد الإلكتروني</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full ${errors.email ? 'border-red-500' : ''}`}
                  dir="rtl"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1 arabic">{errors.email}</p>}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 arabic">رقم الهاتف</label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full ${errors.phone ? 'border-red-500' : ''}`}
                  dir="rtl"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1 arabic">{errors.phone}</p>}
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1 arabic">الموضوع</label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full ${errors.subject ? 'border-red-500' : ''}`}
                  dir="rtl"
                />
                {errors.subject && <p className="text-red-500 text-sm mt-1 arabic">{errors.subject}</p>}
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1 arabic">الرسالة</label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full ${errors.message ? 'border-red-500' : ''}`}
                  dir="rtl"
                />
                {errors.message && <p className="text-red-500 text-sm mt-1 arabic">{errors.message}</p>}
              </div>
              
              <Button type="submit" className="w-full arabic">
                إرسال الرسالة
              </Button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactPage;
