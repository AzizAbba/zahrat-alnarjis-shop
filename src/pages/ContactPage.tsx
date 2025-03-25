
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Send, Loader2 } from 'lucide-react';
import { useMessages } from '@/contexts/MessageContext';

const ContactPage = () => {
  const { addMessage } = useMessages();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      alert('الرجاء تعبئة جميع الحقول المطلوبة');
      setIsSubmitting(false);
      return;
    }
    
    // Add the message to the context
    setTimeout(() => {
      addMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || 'غير محدد',
        subject: formData.subject || 'رسالة جديدة',
        message: formData.message
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-center mb-12 arabic">اتصل بنا</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-6 arabic">معلومات التواصل</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4 rtl:space-x-reverse">
                <span className="bg-narcissus-100 text-narcissus-800 p-2 rounded-full">
                  <MapPin size={20} />
                </span>
                <div>
                  <h3 className="font-medium text-gray-900 arabic">العنوان</h3>
                  <p className="text-gray-600 arabic">الرياض، المملكة العربية السعودية</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 rtl:space-x-reverse">
                <span className="bg-narcissus-100 text-narcissus-800 p-2 rounded-full">
                  <Phone size={20} />
                </span>
                <div>
                  <h3 className="font-medium text-gray-900 arabic">الهاتف</h3>
                  <p className="text-gray-600 arabic">+966 123 456 789</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 rtl:space-x-reverse">
                <span className="bg-narcissus-100 text-narcissus-800 p-2 rounded-full">
                  <Mail size={20} />
                </span>
                <div>
                  <h3 className="font-medium text-gray-900 arabic">البريد الإلكتروني</h3>
                  <p className="text-gray-600">info@zahrat-alnargis.com</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-6 arabic">أرسل لنا رسالة</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 arabic">
                    الاسم *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rtl"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 arabic">
                    البريد الإلكتروني *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rtl"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 arabic">
                    رقم الهاتف
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rtl"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1 arabic">
                    الموضوع
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full rtl"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1 arabic">
                  الرسالة *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full rtl"
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="w-full md:w-auto" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      إرسال الرسالة
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactPage;
