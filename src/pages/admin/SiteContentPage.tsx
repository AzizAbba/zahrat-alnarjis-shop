
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { useProducts } from '@/contexts/ProductContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PageContent {
  id: string;
  page: string;
  section: string;
  title?: string;
  content: string;
  imageUrl?: string;
}

const initialContent: PageContent[] = [
  {
    id: 'home-hero',
    page: 'home',
    section: 'hero',
    title: 'مرحباً بكم في متجرنا',
    content: 'اكتشف منتجاتنا المميزة',
    imageUrl: '/placeholder.svg'
  },
  {
    id: 'about-main',
    page: 'about',
    section: 'main',
    title: 'من نحن',
    content: 'نحن شركة رائدة في مجال المنظفات',
    imageUrl: '/placeholder.svg'
  },
  {
    id: 'contact-info',
    page: 'contact',
    section: 'info',
    title: 'اتصل بنا',
    content: 'نحن هنا لمساعدتك',
    imageUrl: '/placeholder.svg'
  }
];

const SiteContentPage = () => {
  const [content, setContent] = useState<PageContent[]>(
    JSON.parse(localStorage.getItem('siteContent') || JSON.stringify(initialContent))
  );
  const [selectedContent, setSelectedContent] = useState<PageContent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { categories, subcategories, addCategory, updateCategory, deleteCategory, addSubcategory, updateSubcategory, deleteSubcategory } = useProducts();
  const [newCategory, setNewCategory] = useState({ name: '', arabicName: '', description: '' });
  const [newSubcategory, setNewSubcategory] = useState({ name: '', arabicName: '', description: '', categoryId: '' });
  
  const saveContent = (updatedContent: PageContent[]) => {
    localStorage.setItem('siteContent', JSON.stringify(updatedContent));
    setContent(updatedContent);
    toast({
      title: "Content Updated",
      description: "تم تحديث المحتوى بنجاح"
    });
  };
  
  const handleEditContent = (item: PageContent) => {
    setSelectedContent(item);
    setIsDialogOpen(true);
  };
  
  const handleSaveContent = () => {
    if (!selectedContent) return;
    
    const newContent = content.map(item => 
      item.id === selectedContent.id ? selectedContent : item
    );
    
    saveContent(newContent);
    setIsDialogOpen(false);
    setSelectedContent(null);
  };
  
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
  };
  
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
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold arabic mb-6">إدارة محتوى الموقع</h1>
        
        <Tabs defaultValue="content">
          <TabsList>
            <TabsTrigger value="content" className="arabic">محتوى الصفحات</TabsTrigger>
            <TabsTrigger value="categories" className="arabic">التصنيفات</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="space-y-4">
            {content.map((item) => (
              <Card key={item.id} className="w-full">
                <CardHeader>
                  <CardTitle className="arabic">{item.title || item.section}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-4">
                      {item.imageUrl && (
                        <img 
                          src={item.imageUrl} 
                          alt={item.title || item.section}
                          className="w-24 h-24 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 space-y-2">
                        <p className="text-sm text-muted-foreground arabic">
                          {item.content}
                        </p>
                      </div>
                    </div>
                    <Button onClick={() => handleEditContent(item)} className="arabic">
                      تعديل المحتوى
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
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
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="arabic">تعديل المحتوى</DialogTitle>
          </DialogHeader>
          
          {selectedContent && (
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Title"
                  value={selectedContent.title || ''}
                  onChange={(e) => setSelectedContent({...selectedContent, title: e.target.value})}
                />
              </div>
              <div>
                <Textarea
                  placeholder="Content"
                  value={selectedContent.content}
                  onChange={(e) => setSelectedContent({...selectedContent, content: e.target.value})}
                />
              </div>
              <div>
                <Input
                  placeholder="Image URL"
                  value={selectedContent.imageUrl || ''}
                  onChange={(e) => setSelectedContent({...selectedContent, imageUrl: e.target.value})}
                />
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
    </AdminLayout>
  );
};

export default SiteContentPage;
