
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { PageContent, useContent } from '@/components/layout/MainLayout';
import { ImageUploader } from '@/components/common/FileUploader';
import { Edit, Plus, Save, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const SiteContentPage = () => {
  // Use the custom hook to access content
  const { siteContent, updatePageContent, addPageContent, removePageContent } = useContent();
  const [currentTab, setCurrentTab] = useState('home');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<PageContent | null>(null);
  
  const [formData, setFormData] = useState({
    id: '',
    page: '',
    section: '',
    title: '',
    content: '',
    imageUrl: ''
  });
  
  const getPageContent = (page: string) => {
    return siteContent.filter(content => content.page === page);
  };
  
  const handleEdit = (content: PageContent) => {
    setSelectedContent(content);
    setFormData({
      id: content.id,
      page: content.page,
      section: content.section,
      title: content.title || '',
      content: content.content,
      imageUrl: content.imageUrl || ''
    });
    setIsEditDialogOpen(true);
  };
  
  const handleDelete = (content: PageContent) => {
    setSelectedContent(content);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (!selectedContent) return;
    
    removePageContent(selectedContent.id);
    toast.success('تم حذف المحتوى بنجاح');
    setIsDeleteDialogOpen(false);
  };
  
  const handleAddNew = () => {
    setFormData({
      id: '',
      page: currentTab,
      section: '',
      title: '',
      content: '',
      imageUrl: ''
    });
    setIsAddDialogOpen(true);
  };
  
  const handleSaveContent = (isNew: boolean = false) => {
    if (!formData.section) {
      toast.error('يرجى إدخال اسم القسم');
      return;
    }
    
    if (!formData.content) {
      toast.error('يرجى إدخال المحتوى');
      return;
    }
    
    const contentData: PageContent = {
      id: isNew ? `${formData.page}-${formData.section}-${Date.now()}` : formData.id,
      page: formData.page,
      section: formData.section,
      title: formData.title,
      content: formData.content,
      imageUrl: formData.imageUrl
    };
    
    if (isNew) {
      addPageContent(contentData);
      toast.success('تمت إضافة المحتوى بنجاح');
      setIsAddDialogOpen(false);
    } else {
      updatePageContent(contentData);
      toast.success('تم تحديث المحتوى بنجاح');
      setIsEditDialogOpen(false);
    }
  };
  
  const renderContentCards = (page: string) => {
    const pageContent = getPageContent(page);
    
    if (pageContent.length === 0) {
      return (
        <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300 arabic">
          <p className="text-muted-foreground mb-4">لا يوجد محتوى لهذه الصفحة</p>
          <Button variant="outline" onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            <span className="arabic">إضافة محتوى جديد</span>
          </Button>
        </div>
      );
    }
    
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {pageContent.map(content => (
          <Card key={content.id} className="overflow-hidden">
            {content.imageUrl && (
              <div className="aspect-video overflow-hidden bg-gray-100">
                <img 
                  src={content.imageUrl} 
                  alt={content.title || content.section} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              </div>
            )}
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="arabic">{content.title || content.section}</CardTitle>
                  <CardDescription className="arabic">قسم: {content.section}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(content)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(content)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="arabic">{content.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold arabic">إدارة محتوى الموقع</h1>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          <span className="arabic">إضافة محتوى جديد</span>
        </Button>
      </div>
      
      <Tabs 
        defaultValue="home" 
        value={currentTab}
        onValueChange={setCurrentTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="home" className="arabic">الرئيسية</TabsTrigger>
          <TabsTrigger value="products" className="arabic">المنتجات</TabsTrigger>
          <TabsTrigger value="about" className="arabic">من نحن</TabsTrigger>
          <TabsTrigger value="contact" className="arabic">اتصل بنا</TabsTrigger>
        </TabsList>
        
        <TabsContent value="home" className="pt-4">
          {renderContentCards('home')}
        </TabsContent>
        
        <TabsContent value="products" className="pt-4">
          {renderContentCards('products')}
        </TabsContent>
        
        <TabsContent value="about" className="pt-4">
          {renderContentCards('about')}
        </TabsContent>
        
        <TabsContent value="contact" className="pt-4">
          {renderContentCards('contact')}
        </TabsContent>
      </Tabs>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="arabic">تعديل المحتوى</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium arabic">الصفحة</label>
                <Input
                  disabled
                  value={formData.page}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium arabic">القسم</label>
                <Input
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="mt-1 arabic"
                  placeholder="اسم القسم"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium arabic">العنوان</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 arabic"
                placeholder="عنوان المحتوى (اختياري)"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium arabic">المحتوى</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="mt-1 arabic"
                rows={4}
                placeholder="نص المحتوى"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium arabic mb-2 block">صورة القسم (اختياري)</label>
              <ImageUploader 
                imageUrl={formData.imageUrl}
                onImageUploaded={(url) => setFormData({ ...formData, imageUrl: url })}
                className="h-40 w-full"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              className="arabic"
            >
              إلغاء
            </Button>
            <Button onClick={() => handleSaveContent(false)} className="arabic">
              <Save className="mr-2 h-4 w-4" />
              حفظ التغييرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="arabic">إضافة محتوى جديد</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium arabic">الصفحة</label>
                <select
                  value={formData.page}
                  onChange={(e) => setFormData({ ...formData, page: e.target.value })}
                  className="mt-1 w-full rounded-md border border-input px-3 py-2"
                >
                  <option value="home">الصفحة الرئيسية</option>
                  <option value="products">صفحة المنتجات</option>
                  <option value="about">من نحن</option>
                  <option value="contact">اتصل بنا</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium arabic">القسم</label>
                <Input
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="mt-1 arabic"
                  placeholder="اسم القسم"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium arabic">العنوان</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 arabic"
                placeholder="عنوان المحتوى (اختياري)"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium arabic">المحتوى</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="mt-1 arabic"
                rows={4}
                placeholder="نص المحتوى"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium arabic mb-2 block">صورة القسم (اختياري)</label>
              <ImageUploader 
                imageUrl={formData.imageUrl}
                onImageUploaded={(url) => setFormData({ ...formData, imageUrl: url })}
                className="h-40 w-full"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddDialogOpen(false)}
              className="arabic"
            >
              إلغاء
            </Button>
            <Button onClick={() => handleSaveContent(true)} className="arabic">
              <Plus className="mr-2 h-4 w-4" />
              إضافة محتوى
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="arabic">حذف المحتوى</AlertDialogTitle>
            <AlertDialogDescription className="arabic">
              هل أنت متأكد من حذف هذا المحتوى؟ لا يمكن التراجع عن هذه العملية.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="arabic">إلغاء</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground arabic" onClick={confirmDelete}>
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default SiteContentPage;
