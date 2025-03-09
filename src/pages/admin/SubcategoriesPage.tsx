
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Pencil, Trash2, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
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
import { useProducts } from '@/contexts/ProductContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Subcategory } from '@/types/product';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SubcategoriesPage = () => {
  const { 
    categories, 
    subcategories, 
    sizes, 
    colors, 
    smells, 
    addSubcategory, 
    updateSubcategory, 
    deleteSubcategory,
    addSize,
    updateSize,
    deleteSize,
    addColor,
    updateColor,
    deleteColor,
    addSmell,
    updateSmell,
    deleteSmell
  } = useProducts();
  
  const [activeTab, setActiveTab] = useState('subcategories');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    arabicName: '',
    categoryId: '',
    description: '',
    value: '',
    hexCode: '#FFFFFF'
  });
  
  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      arabicName: '',
      categoryId: '',
      description: '',
      value: '',
      hexCode: '#FFFFFF'
    });
    setSelectedItem(null);
  };
  
  const handleOpenDialog = (item: any | null = null) => {
    if (item) {
      const commonFields = {
        id: item.id,
        name: item.name,
        arabicName: item.arabicName || '',
        description: item.description || '',
      };
      
      if (activeTab === 'subcategories') {
        setFormData({
          ...commonFields,
          categoryId: item.categoryId,
          value: '',
          hexCode: '#FFFFFF'
        });
      } else if (activeTab === 'sizes') {
        setFormData({
          ...commonFields,
          value: item.value,
          categoryId: '',
          hexCode: '#FFFFFF'
        });
      } else if (activeTab === 'colors') {
        setFormData({
          ...commonFields,
          hexCode: item.hexCode,
          categoryId: '',
          value: ''
        });
      } else if (activeTab === 'smells') {
        setFormData({
          ...commonFields,
          categoryId: '',
          value: '',
          hexCode: '#FFFFFF'
        });
      }
      
      setSelectedItem(item);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (activeTab === 'subcategories') {
        // Validation
        if (!formData.name || !formData.categoryId) {
          toast({
            title: "Input Error",
            description: 'الاسم والتصنيف مطلوبين',
            variant: "destructive"
          });
          return;
        }
        
        const subcategoryData = {
          id: formData.id,
          name: formData.name,
          arabicName: formData.arabicName,
          categoryId: formData.categoryId,
          description: formData.description
        };
        
        if (selectedItem) {
          updateSubcategory(subcategoryData.id, subcategoryData);
        } else {
          addSubcategory(subcategoryData);
        }
      } 
      else if (activeTab === 'sizes') {
        // Validation
        if (!formData.name || !formData.value) {
          toast({
            title: "Input Error",
            description: 'الاسم والقيمة مطلوبين',
            variant: "destructive"
          });
          return;
        }
        
        const sizeData = {
          id: formData.id,
          name: formData.name,
          arabicName: formData.arabicName,
          value: formData.value
        };
        
        if (selectedItem) {
          updateSize(sizeData.id, sizeData);
        } else {
          addSize(sizeData);
        }
      }
      else if (activeTab === 'colors') {
        // Validation
        if (!formData.name || !formData.hexCode) {
          toast({
            title: "Input Error",
            description: 'الاسم ورمز اللون مطلوبين',
            variant: "destructive"
          });
          return;
        }
        
        const colorData = {
          id: formData.id,
          name: formData.name,
          arabicName: formData.arabicName,
          hexCode: formData.hexCode
        };
        
        if (selectedItem) {
          updateColor(colorData.id, colorData);
        } else {
          addColor(colorData);
        }
      }
      else if (activeTab === 'smells') {
        // Validation
        if (!formData.name) {
          toast({
            title: "Input Error",
            description: 'الاسم مطلوب',
            variant: "destructive"
          });
          return;
        }
        
        const smellData = {
          id: formData.id,
          name: formData.name,
          arabicName: formData.arabicName,
          description: formData.description
        };
        
        if (selectedItem) {
          updateSmell(smellData.id, smellData);
        } else {
          addSmell(smellData);
        }
      }
      
      toast({
        title: selectedItem ? "Updated Successfully" : "Added Successfully",
        description: selectedItem ? 'تم التحديث بنجاح' : 'تمت الإضافة بنجاح'
      });
      
      handleCloseDialog();
    } catch (error) {
      toast({
        title: "Error",
        description: 'حدث خطأ أثناء العملية',
        variant: "destructive"
      });
    }
  };
  
  const handleDelete = () => {
    if (!selectedItem) return;
    
    try {
      if (activeTab === 'subcategories') {
        deleteSubcategory(selectedItem.id);
      } else if (activeTab === 'sizes') {
        deleteSize(selectedItem.id);
      } else if (activeTab === 'colors') {
        deleteColor(selectedItem.id);
      } else if (activeTab === 'smells') {
        deleteSmell(selectedItem.id);
      }
      
      toast({
        title: "Deleted Successfully",
        description: 'تم الحذف بنجاح'
      });
      
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
    } catch (error) {
      toast({
        title: "Error",
        description: 'حدث خطأ أثناء الحذف',
        variant: "destructive"
      });
    }
  };
  
  const getFilteredItems = () => {
    const search = searchTerm.toLowerCase();
    
    if (activeTab === 'subcategories') {
      return subcategories.filter(
        item => item.name.toLowerCase().includes(search) ||
               (item.arabicName || '').toLowerCase().includes(search)
      );
    } else if (activeTab === 'sizes') {
      return sizes.filter(
        item => item.name.toLowerCase().includes(search) ||
               (item.arabicName || '').toLowerCase().includes(search) ||
               item.value.toLowerCase().includes(search)
      );
    } else if (activeTab === 'colors') {
      return colors.filter(
        item => item.name.toLowerCase().includes(search) ||
               (item.arabicName || '').toLowerCase().includes(search)
      );
    } else if (activeTab === 'smells') {
      return smells.filter(
        item => item.name.toLowerCase().includes(search) ||
               (item.arabicName || '').toLowerCase().includes(search) ||
               (item.description || '').toLowerCase().includes(search)
      );
    }
    return [];
  };
  
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? (category.arabicName || category.name) : '';
  };
  
  const renderDialogContent = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="ltr">English Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="English name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="arabicName" className="arabic">الاسم بالعربية</Label>
              <Input
                id="arabicName"
                dir="rtl"
                value={formData.arabicName}
                onChange={(e) => setFormData({...formData, arabicName: e.target.value})}
                placeholder="الاسم بالعربية"
              />
            </div>
          </div>
          
          {activeTab === 'subcategories' && (
            <div className="space-y-2">
              <Label htmlFor="categoryId" className="arabic">التصنيف الرئيسي</Label>
              <Select 
                value={formData.categoryId} 
                onValueChange={(value) => setFormData({...formData, categoryId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id} className="arabic">
                      {category.arabicName || category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {(activeTab === 'subcategories' || activeTab === 'smells') && (
            <div className="space-y-2">
              <Label htmlFor="description" className="arabic">الوصف</Label>
              <Textarea
                id="description"
                dir="rtl"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="وصف اختياري"
                rows={3}
              />
            </div>
          )}
          
          {activeTab === 'sizes' && (
            <div className="space-y-2">
              <Label htmlFor="value" className="arabic">القيمة</Label>
              <Input
                id="value"
                value={formData.value}
                onChange={(e) => setFormData({...formData, value: e.target.value})}
                placeholder="مثال: S, M, L, XL"
              />
            </div>
          )}
          
          {activeTab === 'colors' && (
            <div className="space-y-2">
              <Label htmlFor="hexCode" className="arabic">كود اللون</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="hexCode"
                  type="color"
                  value={formData.hexCode}
                  onChange={(e) => setFormData({...formData, hexCode: e.target.value})}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={formData.hexCode}
                  onChange={(e) => setFormData({...formData, hexCode: e.target.value})}
                  placeholder="#RRGGBB"
                  className="flex-1"
                />
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCloseDialog}>
            إلغاء
          </Button>
          <Button type="submit">
            {selectedItem ? 'تحديث' : 'إضافة'}
          </Button>
        </DialogFooter>
      </form>
    );
  };
  
  const renderSubcategoriesTable = () => {
    const items = getFilteredItems();
    
    return (
      <table className="w-full">
        <thead>
          <tr className="border-b text-right">
            <th className="p-3 font-medium arabic">الاسم</th>
            <th className="p-3 font-medium arabic">التصنيف الرئيسي</th>
            <th className="p-3 font-medium arabic">الوصف</th>
            <th className="p-3 font-medium arabic">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b text-right">
              <td className="p-3">
                <div>
                  <p className="arabic font-medium">{item.arabicName || item.name}</p>
                  {item.arabicName && <p className="text-xs text-muted-foreground ltr">{item.name}</p>}
                </div>
              </td>
              <td className="p-3 arabic">{getCategoryName(item.categoryId)}</td>
              <td className="p-3 arabic text-sm text-muted-foreground">{item.description || 'لا يوجد وصف'}</td>
              <td className="p-3">
                <div className="flex items-center gap-2 justify-end">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleOpenDialog(item)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setSelectedItem(item);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          
          {items.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-center text-muted-foreground arabic">
                لا توجد عناصر
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };
  
  const renderSizesTable = () => {
    const items = getFilteredItems();
    
    return (
      <table className="w-full">
        <thead>
          <tr className="border-b text-right">
            <th className="p-3 font-medium arabic">الاسم</th>
            <th className="p-3 font-medium arabic">القيمة</th>
            <th className="p-3 font-medium arabic">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b text-right">
              <td className="p-3">
                <div>
                  <p className="arabic font-medium">{item.arabicName || item.name}</p>
                  {item.arabicName && <p className="text-xs text-muted-foreground ltr">{item.name}</p>}
                </div>
              </td>
              <td className="p-3 font-mono text-center">{item.value}</td>
              <td className="p-3">
                <div className="flex items-center gap-2 justify-end">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleOpenDialog(item)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setSelectedItem(item);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          
          {items.length === 0 && (
            <tr>
              <td colSpan={3} className="p-4 text-center text-muted-foreground arabic">
                لا توجد عناصر
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };
  
  const renderColorsTable = () => {
    const items = getFilteredItems();
    
    return (
      <table className="w-full">
        <thead>
          <tr className="border-b text-right">
            <th className="p-3 font-medium arabic">الاسم</th>
            <th className="p-3 font-medium arabic">اللون</th>
            <th className="p-3 font-medium arabic">الرمز</th>
            <th className="p-3 font-medium arabic">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b text-right">
              <td className="p-3">
                <div>
                  <p className="arabic font-medium">{item.arabicName || item.name}</p>
                  {item.arabicName && <p className="text-xs text-muted-foreground ltr">{item.name}</p>}
                </div>
              </td>
              <td className="p-3">
                <div className="h-6 w-10 rounded" style={{ backgroundColor: item.hexCode }} />
              </td>
              <td className="p-3 font-mono text-center">{item.hexCode}</td>
              <td className="p-3">
                <div className="flex items-center gap-2 justify-end">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleOpenDialog(item)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setSelectedItem(item);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          
          {items.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-center text-muted-foreground arabic">
                لا توجد عناصر
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };
  
  const renderSmellsTable = () => {
    const items = getFilteredItems();
    
    return (
      <table className="w-full">
        <thead>
          <tr className="border-b text-right">
            <th className="p-3 font-medium arabic">الاسم</th>
            <th className="p-3 font-medium arabic">الوصف</th>
            <th className="p-3 font-medium arabic">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b text-right">
              <td className="p-3">
                <div>
                  <p className="arabic font-medium">{item.arabicName || item.name}</p>
                  {item.arabicName && <p className="text-xs text-muted-foreground ltr">{item.name}</p>}
                </div>
              </td>
              <td className="p-3 arabic text-sm text-muted-foreground">{item.description || 'لا يوجد وصف'}</td>
              <td className="p-3">
                <div className="flex items-center gap-2 justify-end">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleOpenDialog(item)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setSelectedItem(item);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          
          {items.length === 0 && (
            <tr>
              <td colSpan={3} className="p-4 text-center text-muted-foreground arabic">
                لا توجد عناصر
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };
  
  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold arabic">إدارة التصنيفات الفرعية</h1>
        
        <div className="flex w-full sm:w-auto gap-2 flex-wrap">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث..."
              className="pl-8 rtl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2 whitespace-nowrap">
            <PlusCircle size={16} />
            <span className="arabic">إضافة جديد</span>
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="subcategories" className="arabic">التصنيفات الفرعية</TabsTrigger>
          <TabsTrigger value="sizes" className="arabic">الحجم</TabsTrigger>
          <TabsTrigger value="colors" className="arabic">اللون</TabsTrigger>
          <TabsTrigger value="smells" className="arabic">الرائحة</TabsTrigger>
        </TabsList>
        
        <div className="bg-card rounded-lg border shadow-sm">
          <div className="overflow-x-auto">
            <TabsContent value="subcategories" className="mt-0">
              {renderSubcategoriesTable()}
            </TabsContent>
            
            <TabsContent value="sizes" className="mt-0">
              {renderSizesTable()}
            </TabsContent>
            
            <TabsContent value="colors" className="mt-0">
              {renderColorsTable()}
            </TabsContent>
            
            <TabsContent value="smells" className="mt-0">
              {renderSmellsTable()}
            </TabsContent>
          </div>
        </div>
      </Tabs>
      
      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="arabic">
              {selectedItem ? 'تعديل' : 'إضافة جديد'}
              {activeTab === 'subcategories' ? ' - تصنيف فرعي' : ''}
              {activeTab === 'sizes' ? ' - حجم' : ''}
              {activeTab === 'colors' ? ' - لون' : ''}
              {activeTab === 'smells' ? ' - رائحة' : ''}
            </DialogTitle>
          </DialogHeader>
          
          {renderDialogContent()}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="arabic">تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription className="arabic">
              هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="arabic">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground arabic"
              onClick={handleDelete}
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default SubcategoriesPage;
