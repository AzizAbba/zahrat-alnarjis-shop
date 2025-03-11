
import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { useProducts } from '@/contexts/ProductContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PageContent } from '@/components/layout/MainLayout';
import { FileUploader } from '@/components/common/FileUploader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Pencil, Trash2, Image } from 'lucide-react';

// Initial content for site
const initialContent: PageContent[] = [
  // Home page content
  {
    id: 'home-hero',
    page: 'home',
    section: 'hero',
    title: 'مرحباً بكم في متجرنا',
    content: 'اكتشف منتجاتنا المميزة',
    imageUrl: '/placeholder.svg'
  },
  {
    id: 'home-featured',
    page: 'home',
    section: 'featured',
    title: 'منتجات مميزة',
    content: 'تصفح مجموعتنا المميزة من المنتجات',
    imageUrl: '/placeholder.svg'
  },
  {
    id: 'home-about',
    page: 'home',
    section: 'about',
    title: 'من نحن',
    content: 'نحن شركة رائدة في مجال المنظفات منذ أكثر من 20 عاماً',
    imageUrl: '/placeholder.svg'
  },
  // About page content
  {
    id: 'about-main',
    page: 'about',
    section: 'main',
    title: 'من نحن',
    content: 'نحن شركة رائدة في مجال المنظفات نعمل بجد لتقديم منتجات عالية الجودة لعملائنا',
    imageUrl: '/placeholder.svg'
  },
  {
    id: 'about-mission',
    page: 'about',
    section: 'mission',
    title: 'مهمتنا',
    content: 'تقديم منتجات منظفات آمنة وفعالة وبأسعار معقولة لجميع العملاء',
    imageUrl: '/placeholder.svg'
  },
  {
    id: 'about-vision',
    page: 'about',
    section: 'vision',
    title: 'رؤيتنا',
    content: 'أن نكون الشركة الرائدة في مجال المنظفات في المنطقة',
    imageUrl: '/placeholder.svg'
  },
  // Contact page content
  {
    id: 'contact-info',
    page: 'contact',
    section: 'info',
    title: 'اتصل بنا',
    content: 'نحن هنا لمساعدتك، لا تتردد في التواصل معنا',
    imageUrl: '/placeholder.svg'
  },
  {
    id: 'contact-address',
    page: 'contact',
    section: 'address',
    title: 'العنوان',
    content: 'الرياض، المملكة العربية السعودية',
    imageUrl: '/placeholder.svg'
  },
  // Products page content
  {
    id: 'products-header',
    page: 'products',
    section: 'header',
    title: 'منتجاتنا',
    content: 'تصفح مجموعتنا الواسعة من المنتجات',
    imageUrl: '/placeholder.svg'
  }
];

// Contact messages data structure
interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

// Define delivery options structure
interface DeliveryOption {
  id: string;
  name: string;
  arabicName: string;
  price: number;
  description: string;
  estimatedDays: string;
  isActive: boolean;
}

const SiteContentPage = () => {
  // State for site content
  const [content, setContent] = useState<PageContent[]>(
    JSON.parse(localStorage.getItem('siteContent') || JSON.stringify(initialContent))
  );
  
  // State for selected content item
  const [selectedContent, setSelectedContent] = useState<PageContent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddContentDialogOpen, setIsAddContentDialogOpen] = useState(false);
  const [isAddDeliveryDialogOpen, setIsAddDeliveryDialogOpen] = useState(false);
  
  // State for filtering content
  const [selectedPage, setSelectedPage] = useState<string>('all');
  
  // State for new content
  const [newContent, setNewContent] = useState<PageContent>({
    id: '',
    page: 'home',
    section: '',
    title: '',
    content: '',
    imageUrl: '/placeholder.svg'
  });
  
  // State for contact messages
  const [messages, setMessages] = useState<ContactMessage[]>(
    JSON.parse(localStorage.getItem('contactMessages') || '[]')
  );
  
  // State for delivery options
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>(
    JSON.parse(localStorage.getItem('deliveryOptions') || '[]')
  );
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<DeliveryOption | null>(null);
  
  // Product context
  const { categories, subcategories, addCategory, updateCategory, deleteCategory, addSubcategory, updateSubcategory, deleteSubcategory } = useProducts();
  const [newCategory, setNewCategory] = useState({ name: '', arabicName: '', description: '' });
  const [newSubcategory, setNewSubcategory] = useState({ name: '', arabicName: '', description: '', categoryId: '' });
  
  // File uploader ref for product images
  const fileUploaderRef = useRef(null);
  
  // Save content to local storage
  const saveContent = (updatedContent: PageContent[]) => {
    localStorage.setItem('siteContent', JSON.stringify(updatedContent));
    setContent(updatedContent);
    toast({
      title: "Content Updated",
      description: "تم تحديث المحتوى بنجاح"
    });
  };
  
  // Handle edit content
  const handleEditContent = (item: PageContent) => {
    setSelectedContent(item);
    setIsDialogOpen(true);
  };
  
  // Handle save content
  const handleSaveContent = () => {
    if (!selectedContent) return;
    
    const newContent = content.map(item => 
      item.id === selectedContent.id ? selectedContent : item
    );
    
    saveContent(newContent);
    setIsDialogOpen(false);
    setSelectedContent(null);
  };
  
  // Handle add new content
  const handleAddContent = () => {
    if (!newContent.section || !newContent.content) {
      toast({
        title: "Error",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }
    
    const newId = `${newContent.page}-${newContent.section}-${Date.now()}`;
    const contentItem: PageContent = {
      ...newContent,
      id: newId
    };
    
    const updatedContent = [...content, contentItem];
    saveContent(updatedContent);
    setIsAddContentDialogOpen(false);
    setNewContent({
      id: '',
      page: 'home',
      section: '',
      title: '',
      content: '',
      imageUrl: '/placeholder.svg'
    });
  };
  
  // Handle delete content
  const handleDeleteContent = (id: string) => {
    const updatedContent = content.filter(item => item.id !== id);
    saveContent(updatedContent);
    sonnerToast.success("تم حذف المحتوى بنجاح");
  };
  
  // Handle Category Submit
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.arabicName) {
      toast({
        title: "Error",
        description: "جميع الحقول مطلوبة",
        variant: "destructive"
      });
      return;
    }
    
    addCategory(newCategory);
    setNewCategory({ name: '', arabicName: '', description: '' });
    sonnerToast.success("تم إضافة التصنيف بنجاح");
  };
  
  // Handle Subcategory Submit
  const handleSubcategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubcategory.name || !newSubcategory.arabicName || !newSubcategory.categoryId) {
      toast({
        title: "Error",
        description: "جميع الحقول مطلوبة",
        variant: "destructive"
      });
      return;
    }
    
    addSubcategory(newSubcategory);
    setNewSubcategory({ name: '', arabicName: '', description: '', categoryId: '' });
    sonnerToast.success("تم إضافة التصنيف الفرعي بنجاح");
  };
  
  // Handle Add Delivery Option
  const handleAddDeliveryOption = () => {
    if (!selectedDeliveryOption) return;
    
    let updatedOptions;
    
    if (selectedDeliveryOption.id) {
      // Update existing option
      updatedOptions = deliveryOptions.map(option => 
        option.id === selectedDeliveryOption.id ? selectedDeliveryOption : option
      );
    } else {
      // Add new option
      const newOption = {
        ...selectedDeliveryOption,
        id: Date.now().toString()
      };
      updatedOptions = [...deliveryOptions, newOption];
    }
    
    localStorage.setItem('deliveryOptions', JSON.stringify(updatedOptions));
    setDeliveryOptions(updatedOptions);
    setIsAddDeliveryDialogOpen(false);
    setSelectedDeliveryOption(null);
    sonnerToast.success("تم حفظ خيار التوصيل بنجاح");
  };
  
  // Handle Delete Delivery Option
  const handleDeleteDeliveryOption = (id: string) => {
    const updatedOptions = deliveryOptions.filter(option => option.id !== id);
    localStorage.setItem('deliveryOptions', JSON.stringify(updatedOptions));
    setDeliveryOptions(updatedOptions);
    sonnerToast.success("تم حذف خيار التوصيل بنجاح");
  };
  
  // Filter content based on selected page
  const filteredContent = selectedPage === 'all' 
    ? content 
    : content.filter(item => item.page === selectedPage);
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold arabic mb-6">إدارة المحتوى</h1>
        
        <Tabs defaultValue="content">
          <TabsList className="mb-4">
            <TabsTrigger value="content" className="arabic">محتوى الصفحات</TabsTrigger>
            <TabsTrigger value="categories" className="arabic">التصنيفات</TabsTrigger>
            <TabsTrigger value="messages" className="arabic">الرسائل</TabsTrigger>
            <TabsTrigger value="delivery" className="arabic">خيارات التوصيل</TabsTrigger>
          </TabsList>
          
          {/* Content Management Tab */}
          <TabsContent value="content" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <label className="text-sm arabic">تصفية حسب الصفحة:</label>
                <Select value={selectedPage} onValueChange={setSelectedPage}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="اختر الصفحة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="arabic">جميع الصفحات</SelectItem>
                    <SelectItem value="home" className="arabic">الصفحة الرئيسية</SelectItem>
                    <SelectItem value="about" className="arabic">من نحن</SelectItem>
                    <SelectItem value="contact" className="arabic">اتصل بنا</SelectItem>
                    <SelectItem value="products" className="arabic">المنتجات</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={() => setIsAddContentDialogOpen(true)} 
                className="arabic flex items-center gap-2"
              >
                <PlusCircle size={16} />
                إضافة محتوى جديد
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {filteredContent.map((item) => (
                <Card key={item.id} className="w-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="arabic">{item.title || item.section}</CardTitle>
                        <CardDescription className="arabic">
                          الصفحة: {item.page === 'home' ? 'الرئيسية' : 
                                  item.page === 'about' ? 'من نحن' :
                                  item.page === 'contact' ? 'اتصل بنا' :
                                  item.page === 'products' ? 'المنتجات' : item.page}
                          {' | '}
                          القسم: {item.section}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditContent(item)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteContent(item.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-start space-x-4 rtl:space-x-reverse">
                        {item.imageUrl && (
                          <div className="relative">
                            <img 
                              src={item.imageUrl} 
                              alt={item.title || item.section}
                              className="w-24 h-24 object-cover rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder.svg';
                              }}
                            />
                          </div>
                        )}
                        <div className="flex-1 space-y-2">
                          <p className="text-sm text-muted-foreground arabic">
                            {item.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredContent.length === 0 && (
                <div className="col-span-2 text-center py-8 text-muted-foreground arabic">
                  لا يوجد محتوى للعرض. أضف محتوى جديد.
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Categories Management Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="arabic">إضافة تصنيف جديد</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCategorySubmit} className="space-y-4">
                    <div>
                      <Input
                        placeholder="Category name"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="اسم التصنيف بالعربية"
                        className="text-right"
                        value={newCategory.arabicName}
                        onChange={(e) => setNewCategory({...newCategory, arabicName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="وصف التصنيف"
                        className="text-right"
                        value={newCategory.description}
                        onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                      />
                    </div>
                    <Button type="submit" className="w-full arabic">
                      إضافة تصنيف
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="arabic">إضافة تصنيف فرعي جديد</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubcategorySubmit} className="space-y-4">
                    <div>
                      <select
                        className="w-full p-2 border rounded"
                        value={newSubcategory.categoryId}
                        onChange={(e) => setNewSubcategory({...newSubcategory, categoryId: e.target.value})}
                      >
                        <option value="">اختر التصنيف الرئيسي</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.arabicName || category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Input
                        placeholder="Subcategory name"
                        value={newSubcategory.name}
                        onChange={(e) => setNewSubcategory({...newSubcategory, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="اسم التصنيف الفرعي بالعربية"
                        className="text-right"
                        value={newSubcategory.arabicName}
                        onChange={(e) => setNewSubcategory({...newSubcategory, arabicName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="وصف التصنيف الفرعي"
                        className="text-right"
                        value={newSubcategory.description}
                        onChange={(e) => setNewSubcategory({...newSubcategory, description: e.target.value})}
                      />
                    </div>
                    <Button type="submit" className="w-full arabic">
                      إضافة تصنيف فرعي
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="arabic">التصنيفات الحالية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center justify-between p-2 border rounded">
                        <span className="arabic">{category.arabicName || category.name}</span>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteCategory(category.id)}
                        >
                          حذف
                        </Button>
                      </div>
                    ))}
                    {categories.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground arabic">
                        لا توجد تصنيفات. أضف تصنيفًا جديدًا.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="arabic">التصنيفات الفرعية الحالية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subcategories.map((subcategory) => (
                      <div key={subcategory.id} className="flex items-center justify-between p-2 border rounded">
                        <span className="arabic">{subcategory.arabicName || subcategory.name}</span>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteSubcategory(subcategory.id)}
                        >
                          حذف
                        </Button>
                      </div>
                    ))}
                    {subcategories.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground arabic">
                        لا توجد تصنيفات فرعية. أضف تصنيفًا فرعيًا جديدًا.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="arabic">رسائل العملاء</CardTitle>
              </CardHeader>
              <CardContent>
                {messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <Card key={message.id} className={`border ${message.isRead ? 'border-gray-200' : 'border-yellow-400'}`}>
                        <CardHeader className="py-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-base arabic">{message.name}</CardTitle>
                              <CardDescription>{message.email}</CardDescription>
                            </div>
                            <CardDescription>
                              {new Date(message.timestamp).toLocaleDateString('ar-SA')}
                            </CardDescription>
                          </div>
                        </CardHeader>
                        <CardContent className="py-2">
                          <p className="text-sm arabic">{message.message}</p>
                        </CardContent>
                        <div className="px-4 py-2 flex justify-end border-t">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              const updatedMessages = messages.map(m => 
                                m.id === message.id ? {...m, isRead: true} : m
                              );
                              setMessages(updatedMessages);
                              localStorage.setItem('contactMessages', JSON.stringify(updatedMessages));
                            }}
                            disabled={message.isRead}
                          >
                            {message.isRead ? 'تم القراءة' : 'تحديد كمقروءة'}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground arabic">
                    لا توجد رسائل بعد.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Delivery Options Tab */}
          <TabsContent value="delivery" className="space-y-4">
            <div className="flex justify-end mb-4">
              <Button 
                onClick={() => {
                  setSelectedDeliveryOption({
                    id: '',
                    name: '',
                    arabicName: '',
                    price: 0,
                    description: '',
                    estimatedDays: '',
                    isActive: true
                  });
                  setIsAddDeliveryDialogOpen(true);
                }} 
                className="arabic flex items-center gap-2"
              >
                <PlusCircle size={16} />
                إضافة خيار توصيل جديد
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deliveryOptions.length > 0 ? (
                deliveryOptions.map((option) => (
                  <Card key={option.id} className={`${option.isActive ? 'border-green-200' : 'border-gray-200 opacity-70'}`}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base arabic">{option.arabicName}</CardTitle>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              setSelectedDeliveryOption(option);
                              setIsAddDeliveryDialogOpen(true);
                            }}
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteDeliveryOption(option.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                      <CardDescription className="ltr">{option.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm arabic">{option.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{option.price.toFixed(2)} ريال</span>
                          <span className="text-sm text-muted-foreground arabic">
                            {option.estimatedDays}
                          </span>
                        </div>
                        <div className="flex justify-end">
                          <span className={`text-xs px-2 py-1 rounded-full ${option.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} arabic`}>
                            {option.isActive ? 'مفعل' : 'غير مفعل'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-muted-foreground arabic">
                  لا توجد خيارات توصيل. أضف خيارات جديدة.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Edit Content Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="arabic">تعديل المحتوى</DialogTitle>
          </DialogHeader>
          
          {selectedContent && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block arabic">العنوان</label>
                <Input
                  placeholder="العنوان"
                  value={selectedContent.title || ''}
                  onChange={(e) => setSelectedContent({...selectedContent, title: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block arabic">المحتوى</label>
                <Textarea
                  placeholder="المحتوى"
                  value={selectedContent.content}
                  onChange={(e) => setSelectedContent({...selectedContent, content: e.target.value})}
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block arabic">رابط الصورة</label>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="رابط الصورة"
                    value={selectedContent.imageUrl || ''}
                    onChange={(e) => setSelectedContent({...selectedContent, imageUrl: e.target.value})}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={() => {
                      // Open file picker
                      if (fileUploaderRef.current) {
                        (fileUploaderRef.current as any).openFilePicker();
                      }
                    }}
                  >
                    <Image size={16} />
                  </Button>
                </div>
                {selectedContent.imageUrl && (
                  <div className="mt-2">
                    <img 
                      src={selectedContent.imageUrl} 
                      alt="Preview" 
                      className="max-h-24 rounded border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSaveContent}>
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Content Dialog */}
      <Dialog open={isAddContentDialogOpen} onOpenChange={setIsAddContentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="arabic">إضافة محتوى جديد</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block arabic">الصفحة</label>
              <Select value={newContent.page} onValueChange={(value) => setNewContent({...newContent, page: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الصفحة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home" className="arabic">الصفحة الرئيسية</SelectItem>
                  <SelectItem value="about" className="arabic">من نحن</SelectItem>
                  <SelectItem value="contact" className="arabic">اتصل بنا</SelectItem>
                  <SelectItem value="products" className="arabic">المنتجات</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block arabic">القسم</label>
              <Input
                placeholder="مثال: hero, featured, etc."
                value={newContent.section}
                onChange={(e) => setNewContent({...newContent, section: e.target.value})}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block arabic">العنوان</label>
              <Input
                placeholder="العنوان"
                value={newContent.title || ''}
                onChange={(e) => setNewContent({...newContent, title: e.target.value})}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block arabic">المحتوى</label>
              <Textarea
                placeholder="المحتوى"
                value={newContent.content}
                onChange={(e) => setNewContent({...newContent, content: e.target.value})}
                rows={4}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block arabic">رابط الصورة</label>
              <Input
                placeholder="رابط الصورة"
                value={newContent.imageUrl || ''}
                onChange={(e) => setNewContent({...newContent, imageUrl: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddContentDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleAddContent}>
              إضافة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Delivery Option Dialog */}
      <Dialog open={isAddDeliveryDialogOpen} onOpenChange={setIsAddDeliveryDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="arabic">
              {selectedDeliveryOption?.id ? 'تعديل خيار التوصيل' : 'إضافة خيار توصيل جديد'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedDeliveryOption && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">English Name</label>
                  <Input
                    placeholder="Delivery name"
                    value={selectedDeliveryOption.name}
                    onChange={(e) => setSelectedDeliveryOption({...selectedDeliveryOption, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block arabic">الاسم بالعربية</label>
                  <Input
                    placeholder="اسم خيار التوصيل"
                    className="text-right"
                    value={selectedDeliveryOption.arabicName}
                    onChange={(e) => setSelectedDeliveryOption({...selectedDeliveryOption, arabicName: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block arabic">السعر</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={selectedDeliveryOption.price.toString()}
                  onChange={(e) => setSelectedDeliveryOption({...selectedDeliveryOption, price: parseFloat(e.target.value) || 0})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block arabic">الوصف</label>
                <Textarea
                  placeholder="وصف خيار التوصيل"
                  value={selectedDeliveryOption.description}
                  onChange={(e) => setSelectedDeliveryOption({...selectedDeliveryOption, description: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block arabic">مدة التوصيل المتوقعة</label>
                <Input
                  placeholder="مثال: 3-5 أيام"
                  value={selectedDeliveryOption.estimatedDays}
                  onChange={(e) => setSelectedDeliveryOption({...selectedDeliveryOption, estimatedDays: e.target.value})}
                />
              </div>
              
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={selectedDeliveryOption.isActive}
                  onChange={(e) => setSelectedDeliveryOption({...selectedDeliveryOption, isActive: e.target.checked})}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                />
                <label htmlFor="isActive" className="text-sm font-medium arabic">
                  مفعل
                </label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDeliveryDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleAddDeliveryOption}>
              {selectedDeliveryOption?.id ? 'تحديث' : 'إضافة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Hidden FileUploader component */}
      <FileUploader
        ref={fileUploaderRef}
        onFileUploaded={(url) => {
          if (selectedContent) {
            setSelectedContent({...selectedContent, imageUrl: url});
          }
        }}
      />
      
    </AdminLayout>
  );
};

export default SiteContentPage;
