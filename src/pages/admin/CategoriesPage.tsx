
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Pencil, Trash2, Search, FileUp, FileDown, Plus, ChevronDown, ChevronUp } from 'lucide-react';
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useProducts } from '@/contexts/ProductContext';
import { toast } from '@/components/ui/use-toast';
import { toast as sonnerToast } from 'sonner';
import { Category, Subcategory } from '@/types/product';

const CategoriesPage: React.FC = () => {
  const { categories, subcategories, addCategory, updateCategory, deleteCategory, addSubcategory, updateSubcategory, deleteSubcategory } = useProducts();
  
  // Category state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryFormData, setCategoryFormData] = useState({
    id: '',
    name: '',
    arabicName: '',
    description: '',
    imageUrl: '',
    displayOrder: '0'
  });
  
  // Subcategory state
  const [isSubDialogOpen, setIsSubDialogOpen] = useState(false);
  const [isSubDeleteDialogOpen, setIsSubDeleteDialogOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [subFormData, setSubFormData] = useState({
    id: '',
    name: '',
    arabicName: '',
    categoryId: '',
    description: '',
    imageUrl: '',
    displayOrder: '0'
  });
  
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  
  // Reset form data
  const resetCategoryForm = () => {
    setCategoryFormData({
      id: '',
      name: '',
      arabicName: '',
      description: '',
      imageUrl: '',
      displayOrder: '0'
    });
    setSelectedCategory(null);
  };
  
  const resetSubcategoryForm = () => {
    setSubFormData({
      id: '',
      name: '',
      arabicName: '',
      categoryId: '',
      description: '',
      imageUrl: '',
      displayOrder: '0'
    });
    setSelectedSubcategory(null);
  };
  
  // Open dialogs
  const handleOpenCategoryDialog = (category: Category | null = null) => {
    if (category) {
      setCategoryFormData({
        id: category.id,
        name: category.name,
        arabicName: category.arabicName || '',
        description: category.description || '',
        imageUrl: category.imageUrl || '',
        displayOrder: category.displayOrder?.toString() || '0'
      });
      setSelectedCategory(category);
    } else {
      resetCategoryForm();
    }
    setIsDialogOpen(true);
  };
  
  const handleOpenSubcategoryDialog = (parentCategoryId: string = '', subcategory: Subcategory | null = null) => {
    if (subcategory) {
      setSubFormData({
        id: subcategory.id,
        name: subcategory.name,
        arabicName: subcategory.arabicName || '',
        categoryId: subcategory.categoryId,
        description: subcategory.description || '',
        imageUrl: subcategory.imageUrl || '',
        displayOrder: subcategory.displayOrder?.toString() || '0'
      });
      setSelectedSubcategory(subcategory);
    } else {
      resetSubcategoryForm();
      setSubFormData(prev => ({ ...prev, categoryId: parentCategoryId }));
    }
    setIsSubDialogOpen(true);
  };
  
  // Submit forms
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!categoryFormData.name) {
      toast({
        title: "Input Error",
        description: 'اسم التصنيف مطلوب',
        variant: "destructive"
      });
      return;
    }
    
    try {
      const categoryData = {
        name: categoryFormData.name,
        arabicName: categoryFormData.arabicName || undefined,
        description: categoryFormData.description || undefined,
        imageUrl: categoryFormData.imageUrl || undefined,
        displayOrder: categoryFormData.displayOrder ? parseInt(categoryFormData.displayOrder) : undefined
      };
      
      if (selectedCategory) {
        // Update
        updateCategory(selectedCategory.id, categoryData);
        toast({
          title: "Category Updated",
          description: 'تم تحديث التصنيف بنجاح'
        });
      } else {
        // Add
        addCategory(categoryData);
        toast({
          title: "Category Added",
          description: 'تم إضافة التصنيف بنجاح'
        });
      }
      
      setIsDialogOpen(false);
      resetCategoryForm();
    } catch (error) {
      toast({
        title: "Error",
        description: 'حدث خطأ أثناء حفظ التصنيف',
        variant: "destructive"
      });
    }
  };
  
  const handleSubcategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!subFormData.name || !subFormData.categoryId) {
      toast({
        title: "Input Error",
        description: 'اسم التصنيف الفرعي والتصنيف الرئيسي مطلوبين',
        variant: "destructive"
      });
      return;
    }
    
    try {
      const subcategoryData = {
        name: subFormData.name,
        arabicName: subFormData.arabicName || undefined,
        categoryId: subFormData.categoryId,
        description: subFormData.description || undefined,
        imageUrl: subFormData.imageUrl || undefined,
        displayOrder: subFormData.displayOrder ? parseInt(subFormData.displayOrder) : undefined
      };
      
      if (selectedSubcategory) {
        // Update
        updateSubcategory(selectedSubcategory.id, subcategoryData);
        toast({
          title: "Subcategory Updated",
          description: 'تم تحديث التصنيف الفرعي بنجاح'
        });
      } else {
        // Add
        addSubcategory(subcategoryData);
        toast({
          title: "Subcategory Added",
          description: 'تم إضافة التصنيف الفرعي بنجاح'
        });
        
        // Auto-expand the parent category
        setExpandedCategories(prev => ({
          ...prev,
          [subcategoryData.categoryId]: true
        }));
      }
      
      setIsSubDialogOpen(false);
      resetSubcategoryForm();
    } catch (error) {
      toast({
        title: "Error",
        description: 'حدث خطأ أثناء حفظ التصنيف الفرعي',
        variant: "destructive"
      });
    }
  };
  
  // Delete handlers
  const handleDeleteCategory = () => {
    if (selectedCategory) {
      try {
        deleteCategory(selectedCategory.id);
        sonnerToast.success("تم حذف التصنيف بنجاح");
      } catch (error) {
        toast({
          title: "Delete Error",
          description: 'حدث خطأ أثناء حذف التصنيف',
          variant: "destructive"
        });
      }
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
    }
  };
  
  const handleDeleteSubcategory = () => {
    if (selectedSubcategory) {
      try {
        deleteSubcategory(selectedSubcategory.id);
        sonnerToast.success("تم حذف التصنيف الفرعي بنجاح");
      } catch (error) {
        toast({
          title: "Delete Error",
          description: 'حدث خطأ أثناء حذف التصنيف الفرعي',
          variant: "destructive"
        });
      }
      setIsSubDeleteDialogOpen(false);
      setSelectedSubcategory(null);
    }
  };
  
  // Toggle category expansion
  const toggleCategoryExpand = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };
  
  // Filter categories and subcategories based on search term
  const filteredCategories = categories
    .filter(category => 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.arabicName || '').includes(searchTerm) ||
      (category.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  
  const getSubcategoriesForCategory = (categoryId: string) => {
    return subcategories
      .filter(sub => sub.categoryId === categoryId)
      .filter(sub => 
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sub.arabicName || '').includes(searchTerm) ||
        (sub.description || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  };
  
  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold arabic">إدارة التصنيفات</h1>
        
        <div className="flex w-full sm:w-auto gap-2 flex-wrap">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث في التصنيفات..."
              className="pl-8 rtl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button onClick={() => handleOpenCategoryDialog()} className="flex items-center gap-2 whitespace-nowrap">
            <PlusCircle size={16} />
            <span className="arabic">إضافة تصنيف</span>
          </Button>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-1 sm:p-2">
        {filteredCategories.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground arabic">
            لا توجد تصنيفات. قم بإضافة تصنيف جديد.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredCategories.map(category => {
              const categorySubcats = getSubcategoriesForCategory(category.id);
              const isExpanded = expandedCategories[category.id];
              
              return (
                <Collapsible
                  key={category.id}
                  open={isExpanded}
                  onOpenChange={() => toggleCategoryExpand(category.id)}
                  className="rounded-md border"
                >
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      {category.imageUrl && (
                        <div className="h-10 w-10 rounded overflow-hidden bg-muted">
                          <img 
                            src={category.imageUrl} 
                            alt={category.name} 
                            className="h-full w-full object-cover" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium arabic">{category.arabicName || category.name}</h3>
                        {category.arabicName && (
                          <p className="text-sm text-muted-foreground ltr">{category.name}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          <span className="sr-only">Toggle</span>
                        </Button>
                      </CollapsibleTrigger>
                      
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenSubcategoryDialog(category.id);
                        }}
                        title="إضافة تصنيف فرعي"
                      >
                        <Plus size={16} />
                      </Button>
                      
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenCategoryDialog(category);
                        }}
                      >
                        <Pencil size={16} />
                      </Button>
                      
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCategory(category);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  <CollapsibleContent>
                    <div className="p-4 pt-0">
                      {category.description && (
                        <p className="text-sm text-muted-foreground arabic mb-4">{category.description}</p>
                      )}
                      
                      {categorySubcats.length > 0 ? (
                        <div className="bg-background/50 rounded-md border">
                          <div className="p-2 border-b">
                            <h4 className="text-sm font-medium arabic">التصنيفات الفرعية</h4>
                          </div>
                          <ul className="divide-y">
                            {categorySubcats.map(subcat => (
                              <li key={subcat.id} className="flex items-center justify-between p-3">
                                <div>
                                  <p className="font-medium arabic">{subcat.arabicName || subcat.name}</p>
                                  {subcat.arabicName && (
                                    <p className="text-xs text-muted-foreground ltr">{subcat.name}</p>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleOpenSubcategoryDialog('', subcat)}
                                  >
                                    <Pencil size={14} />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => {
                                      setSelectedSubcategory(subcat);
                                      setIsSubDeleteDialogOpen(true);
                                    }}
                                  >
                                    <Trash2 size={14} />
                                  </Button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-sm text-muted-foreground arabic">
                          لا توجد تصنيفات فرعية لهذا التصنيف
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="arabic">
              {selectedCategory ? 'تعديل تصنيف' : 'إضافة تصنيف جديد'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleCategorySubmit}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="ltr">English Name</Label>
                  <Input
                    id="name"
                    value={categoryFormData.name}
                    onChange={(e) => setCategoryFormData({...categoryFormData, name: e.target.value})}
                    placeholder="Category name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="arabicName" className="arabic">الاسم بالعربية</Label>
                  <Input
                    id="arabicName"
                    dir="rtl"
                    value={categoryFormData.arabicName}
                    onChange={(e) => setCategoryFormData({...categoryFormData, arabicName: e.target.value})}
                    placeholder="اسم التصنيف"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="arabic">الوصف</Label>
                <Textarea
                  id="description"
                  dir="rtl"
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({...categoryFormData, description: e.target.value})}
                  placeholder="وصف التصنيف"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl" className="arabic">رابط الصورة</Label>
                  <Input
                    id="imageUrl"
                    value={categoryFormData.imageUrl}
                    onChange={(e) => setCategoryFormData({...categoryFormData, imageUrl: e.target.value})}
                    placeholder="أدخل رابط الصورة"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="displayOrder" className="arabic">ترتيب العرض</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    min="0"
                    value={categoryFormData.displayOrder}
                    onChange={(e) => setCategoryFormData({...categoryFormData, displayOrder: e.target.value})}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit">
                {selectedCategory ? 'تحديث' : 'إضافة'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Subcategory Dialog */}
      <Dialog open={isSubDialogOpen} onOpenChange={setIsSubDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="arabic">
              {selectedSubcategory ? 'تعديل تصنيف فرعي' : 'إضافة تصنيف فرعي'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubcategorySubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="categoryId" className="arabic">التصنيف الرئيسي</Label>
                <select
                  id="categoryId"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={subFormData.categoryId}
                  onChange={(e) => setSubFormData({...subFormData, categoryId: e.target.value})}
                  required
                >
                  <option value="" disabled>اختر التصنيف الرئيسي</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.arabicName || cat.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subName" className="ltr">English Name</Label>
                  <Input
                    id="subName"
                    value={subFormData.name}
                    onChange={(e) => setSubFormData({...subFormData, name: e.target.value})}
                    placeholder="Subcategory name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subArabicName" className="arabic">الاسم بالعربية</Label>
                  <Input
                    id="subArabicName"
                    dir="rtl"
                    value={subFormData.arabicName}
                    onChange={(e) => setSubFormData({...subFormData, arabicName: e.target.value})}
                    placeholder="اسم التصنيف الفرعي"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subDescription" className="arabic">الوصف</Label>
                <Textarea
                  id="subDescription"
                  dir="rtl"
                  value={subFormData.description}
                  onChange={(e) => setSubFormData({...subFormData, description: e.target.value})}
                  placeholder="وصف التصنيف الفرعي"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subImageUrl" className="arabic">رابط الصورة</Label>
                  <Input
                    id="subImageUrl"
                    value={subFormData.imageUrl}
                    onChange={(e) => setSubFormData({...subFormData, imageUrl: e.target.value})}
                    placeholder="أدخل رابط الصورة"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subDisplayOrder" className="arabic">ترتيب العرض</Label>
                  <Input
                    id="subDisplayOrder"
                    type="number"
                    min="0"
                    value={subFormData.displayOrder}
                    onChange={(e) => setSubFormData({...subFormData, displayOrder: e.target.value})}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsSubDialogOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit">
                {selectedSubcategory ? 'تحديث' : 'إضافة'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Category Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="arabic">حذف التصنيف</AlertDialogTitle>
            <AlertDialogDescription className="arabic">
              هل أنت متأكد من حذف هذا التصنيف؟ لا يمكن التراجع عن هذا الإجراء.<br/>
              ملاحظة: لا يمكن حذف التصنيف إذا كان هناك منتجات أو تصنيفات فرعية مرتبطة به.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="arabic">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground arabic"
              onClick={handleDeleteCategory}
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete Subcategory Confirmation */}
      <AlertDialog open={isSubDeleteDialogOpen} onOpenChange={setIsSubDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="arabic">حذف التصنيف الفرعي</AlertDialogTitle>
            <AlertDialogDescription className="arabic">
              هل أنت متأكد من حذف هذا التصنيف الفرعي؟ لا يمكن التراجع عن هذا الإجراء.<br/>
              ملاحظة: لا يمكن حذف التصنيف الفرعي إذا كان هناك منتجات مرتبطة به.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="arabic">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground arabic"
              onClick={handleDeleteSubcategory}
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default CategoriesPage;
