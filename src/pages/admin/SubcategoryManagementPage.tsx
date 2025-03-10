
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useProducts } from '@/contexts/ProductContext';
import { Subcategory, Size, Color, Smell } from '@/types/product';
import { Plus, Pencil, Trash2, Hash, Palette, Wind } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const SubcategoryManagementPage = () => {
  const { 
    categories,
    subcategories, 
    addSubcategory, 
    updateSubcategory, 
    deleteSubcategory,
    sizes,
    addSize,
    updateSize,
    deleteSize,
    colors,
    addColor,
    updateColor,
    deleteColor,
    smells,
    addSmell,
    updateSmell,
    deleteSmell
  } = useProducts();
  
  // State for subcategory dialog
  const [isSubcategoryDialogOpen, setIsSubcategoryDialogOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [subcategoryForm, setSubcategoryForm] = useState({
    name: '',
    arabicName: '',
    categoryId: '',
    description: ''
  });
  
  // State for size dialog
  const [isSizeDialogOpen, setIsSizeDialogOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [sizeForm, setSizeForm] = useState({
    name: '',
    arabicName: '',
    value: ''
  });
  
  // State for color dialog
  const [isColorDialogOpen, setIsColorDialogOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [colorForm, setColorForm] = useState({
    name: '',
    arabicName: '',
    hexCode: '#000000'
  });
  
  // State for smell dialog
  const [isSmellDialogOpen, setIsSmellDialogOpen] = useState(false);
  const [selectedSmell, setSelectedSmell] = useState<Smell | null>(null);
  const [smellForm, setSmellForm] = useState({
    name: '',
    arabicName: '',
    description: ''
  });
  
  // State for delete confirmation
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<'subcategory' | 'size' | 'color' | 'smell'>('subcategory');
  const [itemToDelete, setItemToDelete] = useState<string>('');
  
  // Handle open subcategory dialog
  const handleOpenSubcategoryDialog = (subcategory: Subcategory | null = null) => {
    if (subcategory) {
      setSelectedSubcategory(subcategory);
      setSubcategoryForm({
        name: subcategory.name,
        arabicName: subcategory.arabicName || '',
        categoryId: subcategory.categoryId,
        description: subcategory.description || ''
      });
    } else {
      setSelectedSubcategory(null);
      setSubcategoryForm({
        name: '',
        arabicName: '',
        categoryId: '',
        description: ''
      });
    }
    setIsSubcategoryDialogOpen(true);
  };
  
  // Handle open size dialog
  const handleOpenSizeDialog = (size: Size | null = null) => {
    if (size) {
      setSelectedSize(size);
      setSizeForm({
        name: size.name,
        arabicName: size.arabicName || '',
        value: size.value
      });
    } else {
      setSelectedSize(null);
      setSizeForm({
        name: '',
        arabicName: '',
        value: ''
      });
    }
    setIsSizeDialogOpen(true);
  };
  
  // Handle open color dialog
  const handleOpenColorDialog = (color: Color | null = null) => {
    if (color) {
      setSelectedColor(color);
      setColorForm({
        name: color.name,
        arabicName: color.arabicName || '',
        hexCode: color.hexCode
      });
    } else {
      setSelectedColor(null);
      setColorForm({
        name: '',
        arabicName: '',
        hexCode: '#000000'
      });
    }
    setIsColorDialogOpen(true);
  };
  
  // Handle open smell dialog
  const handleOpenSmellDialog = (smell: Smell | null = null) => {
    if (smell) {
      setSelectedSmell(smell);
      setSmellForm({
        name: smell.name,
        arabicName: smell.arabicName || '',
        description: smell.description || ''
      });
    } else {
      setSelectedSmell(null);
      setSmellForm({
        name: '',
        arabicName: '',
        description: ''
      });
    }
    setIsSmellDialogOpen(true);
  };
  
  // Handle subcategory form submission
  const handleSubcategorySubmit = () => {
    // Validation
    if (!subcategoryForm.name || !subcategoryForm.arabicName || !subcategoryForm.categoryId) {
      toast.error('الاسم والتصنيف مطلوبين');
      return;
    }
    
    try {
      const subcategoryData: Subcategory = {
        id: selectedSubcategory?.id || Date.now().toString(),
        name: subcategoryForm.name,
        arabicName: subcategoryForm.arabicName,
        categoryId: subcategoryForm.categoryId,
        description: subcategoryForm.description
      };
      
      if (selectedSubcategory) {
        updateSubcategory(selectedSubcategory.id, subcategoryData);
        toast.success('تم تحديث التصنيف الفرعي بنجاح');
      } else {
        addSubcategory(subcategoryData);
        toast.success('تم إضافة التصنيف الفرعي بنجاح');
      }
      
      setIsSubcategoryDialogOpen(false);
    } catch (error) {
      toast.error('حدث خطأ أثناء حفظ التصنيف الفرعي');
    }
  };
  
  // Handle size form submission
  const handleSizeSubmit = () => {
    // Validation
    if (!sizeForm.name || !sizeForm.arabicName || !sizeForm.value) {
      toast.error('جميع الحقول مطلوبة');
      return;
    }
    
    try {
      const sizeData: Size = {
        id: selectedSize?.id || Date.now().toString(),
        name: sizeForm.name,
        arabicName: sizeForm.arabicName,
        value: sizeForm.value
      };
      
      if (selectedSize) {
        updateSize(selectedSize.id, sizeData);
        toast.success('تم تحديث الحجم بنجاح');
      } else {
        addSize(sizeData);
        toast.success('تم إضافة الحجم بنجاح');
      }
      
      setIsSizeDialogOpen(false);
    } catch (error) {
      toast.error('حدث خطأ أثناء حفظ الحجم');
    }
  };
  
  // Handle color form submission
  const handleColorSubmit = () => {
    // Validation
    if (!colorForm.name || !colorForm.arabicName || !colorForm.hexCode) {
      toast.error('جميع الحقول مطلوبة');
      return;
    }
    
    try {
      const colorData: Color = {
        id: selectedColor?.id || Date.now().toString(),
        name: colorForm.name,
        arabicName: colorForm.arabicName,
        hexCode: colorForm.hexCode
      };
      
      if (selectedColor) {
        updateColor(selectedColor.id, colorData);
        toast.success('تم تحديث اللون بنجاح');
      } else {
        addColor(colorData);
        toast.success('تم إضافة اللون بنجاح');
      }
      
      setIsColorDialogOpen(false);
    } catch (error) {
      toast.error('حدث خطأ أثناء حفظ اللون');
    }
  };
  
  // Handle smell form submission
  const handleSmellSubmit = () => {
    // Validation
    if (!smellForm.name || !smellForm.arabicName) {
      toast.error('جميع الحقول مطلوبة');
      return;
    }
    
    try {
      const smellData: Smell = {
        id: selectedSmell?.id || Date.now().toString(),
        name: smellForm.name,
        arabicName: smellForm.arabicName,
        description: smellForm.description
      };
      
      if (selectedSmell) {
        updateSmell(selectedSmell.id, smellData);
        toast.success('تم تحديث الرائحة بنجاح');
      } else {
        addSmell(smellData);
        toast.success('تم إضافة الرائحة بنجاح');
      }
      
      setIsSmellDialogOpen(false);
    } catch (error) {
      toast.error('حدث خطأ أثناء حفظ الرائحة');
    }
  };
  
  // Handle delete confirmation
  const handleOpenDeleteDialog = (type: 'subcategory' | 'size' | 'color' | 'smell', id: string) => {
    setDeleteType(type);
    setItemToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = () => {
    try {
      switch (deleteType) {
        case 'subcategory':
          deleteSubcategory(itemToDelete);
          toast.success('تم حذف التصنيف الفرعي بنجاح');
          break;
        case 'size':
          deleteSize(itemToDelete);
          toast.success('تم حذف الحجم بنجاح');
          break;
        case 'color':
          deleteColor(itemToDelete);
          toast.success('تم حذف اللون بنجاح');
          break;
        case 'smell':
          deleteSmell(itemToDelete);
          toast.success('تم حذف الرائحة بنجاح');
          break;
      }
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error('حدث خطأ أثناء الحذف');
    }
  };
  
  // Get category name by id
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? (category.arabicName || category.name) : categoryId;
  };
  
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold arabic">إدارة التصنيفات الفرعية</h1>
        <p className="text-muted-foreground arabic mt-1">
          إدارة التصنيفات الفرعية والخصائص المرتبطة بالمنتجات
        </p>
      </div>
      
      <Tabs defaultValue="subcategories" className="space-y-6">
        <TabsList className="mb-4">
          <TabsTrigger value="subcategories" className="arabic">التصنيفات الفرعية</TabsTrigger>
          <TabsTrigger value="sizes" className="arabic">الأحجام</TabsTrigger>
          <TabsTrigger value="colors" className="arabic">الألوان</TabsTrigger>
          <TabsTrigger value="smells" className="arabic">الروائح</TabsTrigger>
        </TabsList>
        
        {/* Subcategories Tab */}
        <TabsContent value="subcategories">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold arabic">التصنيفات الفرعية</h2>
            <Button 
              onClick={() => handleOpenSubcategoryDialog()} 
              className="flex items-center gap-2 bg-narcissus-600 hover:bg-narcissus-700"
            >
              <Plus className="h-4 w-4" />
              <span className="arabic">إضافة تصنيف فرعي</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subcategories.map(subcategory => (
              <Card key={subcategory.id} className="border border-border overflow-hidden">
                <CardHeader className="pb-2 bg-muted/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg arabic">{subcategory.arabicName || subcategory.name}</CardTitle>
                      {subcategory.arabicName && <p className="text-sm text-muted-foreground ltr">{subcategory.name}</p>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground arabic">التصنيف:</span>
                      <span className="font-medium arabic">{getCategoryName(subcategory.categoryId)}</span>
                    </div>
                    {subcategory.description && (
                      <p className="text-muted-foreground text-sm arabic mt-2">{subcategory.description}</p>
                    )}
                    <div className="flex justify-end gap-2 mt-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleOpenSubcategoryDialog(subcategory)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleOpenDeleteDialog('subcategory', subcategory.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {subcategories.length === 0 && (
              <div className="col-span-full text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                <p className="text-muted-foreground arabic">
                  لا توجد تصنيفات فرعية بعد. أضف تصنيفًا فرعيًا جديدًا.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Sizes Tab */}
        <TabsContent value="sizes">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold arabic">الأحجام</h2>
            <Button 
              onClick={() => handleOpenSizeDialog()} 
              className="flex items-center gap-2 bg-narcissus-600 hover:bg-narcissus-700"
            >
              <Plus className="h-4 w-4" />
              <span className="arabic">إضافة حجم</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sizes.map(size => (
              <Card key={size.id} className="border border-border overflow-hidden">
                <CardHeader className="pb-2 pt-3 px-4 bg-muted/20 flex flex-row items-center justify-between space-y-0">
                  <div className="flex items-center">
                    <div className="p-1.5 bg-narcissus-100 rounded-md text-narcissus-600 mr-2">
                      <Hash className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-base arabic">{size.arabicName}</CardTitle>
                  </div>
                  <div className="p-1.5 bg-gray-100 rounded-md font-mono text-sm">
                    {size.value}
                  </div>
                </CardHeader>
                <CardContent className="pt-3 px-4 pb-3 flex justify-between items-center">
                  <p className="text-sm text-muted-foreground ltr">{size.name}</p>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleOpenSizeDialog(size)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleOpenDeleteDialog('size', size.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {sizes.length === 0 && (
              <div className="col-span-full text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                <p className="text-muted-foreground arabic">
                  لا توجد أحجام بعد. أضف حجمًا جديدًا.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Colors Tab */}
        <TabsContent value="colors">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold arabic">الألوان</h2>
            <Button 
              onClick={() => handleOpenColorDialog()} 
              className="flex items-center gap-2 bg-narcissus-600 hover:bg-narcissus-700"
            >
              <Plus className="h-4 w-4" />
              <span className="arabic">إضافة لون</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {colors.map(color => (
              <Card key={color.id} className="border border-border overflow-hidden">
                <CardHeader className="pb-2 pt-3 px-4 bg-muted/20 flex flex-row items-center justify-between space-y-0">
                  <div className="flex items-center">
                    <div className="p-1.5 bg-narcissus-100 rounded-md text-narcissus-600 mr-2">
                      <Palette className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-base arabic">{color.arabicName}</CardTitle>
                  </div>
                  <div 
                    className="w-6 h-6 rounded-full border border-gray-200" 
                    style={{ backgroundColor: color.hexCode }}
                  ></div>
                </CardHeader>
                <CardContent className="pt-3 px-4 pb-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <p className="text-sm text-muted-foreground ltr mr-2">{color.name}</p>
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">{color.hexCode}</code>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleOpenColorDialog(color)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleOpenDeleteDialog('color', color.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {colors.length === 0 && (
              <div className="col-span-full text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                <p className="text-muted-foreground arabic">
                  لا توجد ألوان بعد. أضف لونًا جديدًا.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Smells Tab */}
        <TabsContent value="smells">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold arabic">الروائح</h2>
            <Button 
              onClick={() => handleOpenSmellDialog()} 
              className="flex items-center gap-2 bg-narcissus-600 hover:bg-narcissus-700"
            >
              <Plus className="h-4 w-4" />
              <span className="arabic">إضافة رائحة</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {smells.map(smell => (
              <Card key={smell.id} className="border border-border overflow-hidden">
                <CardHeader className="pb-2 pt-3 px-4 bg-muted/20 flex flex-row items-center space-y-0">
                  <div className="p-1.5 bg-narcissus-100 rounded-md text-narcissus-600 mr-2">
                    <Wind className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base arabic">{smell.arabicName}</CardTitle>
                    <p className="text-sm text-muted-foreground ltr">{smell.name}</p>
                  </div>
                </CardHeader>
                <CardContent className="pt-3 px-4 pb-3">
                  {smell.description && (
                    <p className="text-sm text-muted-foreground arabic mb-3">{smell.description}</p>
                  )}
                  <div className="flex justify-end gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleOpenSmellDialog(smell)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleOpenDeleteDialog('smell', smell.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {smells.length === 0 && (
              <div className="col-span-full text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                <p className="text-muted-foreground arabic">
                  لا توجد روائح بعد. أضف رائحة جديدة.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Subcategory Dialog */}
      <Dialog open={isSubcategoryDialogOpen} onOpenChange={setIsSubcategoryDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="arabic">
              {selectedSubcategory ? 'تعديل التصنيف الفرعي' : 'إضافة تصنيف فرعي جديد'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subcategoryName" className="ltr">English Name</Label>
                <Input
                  id="subcategoryName"
                  value={subcategoryForm.name}
                  onChange={(e) => setSubcategoryForm({...subcategoryForm, name: e.target.value})}
                  placeholder="Subcategory name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subcategoryArabicName" className="arabic">الاسم بالعربية</Label>
                <Input
                  id="subcategoryArabicName"
                  value={subcategoryForm.arabicName}
                  onChange={(e) => setSubcategoryForm({...subcategoryForm, arabicName: e.target.value})}
                  placeholder="اسم التصنيف الفرعي"
                  dir="rtl"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categoryId" className="arabic">التصنيف الرئيسي</Label>
              <Select 
                value={subcategoryForm.categoryId} 
                onValueChange={(value) => setSubcategoryForm({...subcategoryForm, categoryId: value})}
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
            
            <div className="space-y-2">
              <Label htmlFor="description" className="arabic">الوصف</Label>
              <Textarea
                id="description"
                value={subcategoryForm.description}
                onChange={(e) => setSubcategoryForm({...subcategoryForm, description: e.target.value})}
                placeholder="وصف التصنيف الفرعي"
                dir="rtl"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsSubcategoryDialogOpen(false)}>
              إلغاء
            </Button>
            <Button type="button" onClick={handleSubcategorySubmit}>
              {selectedSubcategory ? 'تحديث' : 'إضافة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Size Dialog */}
      <Dialog open={isSizeDialogOpen} onOpenChange={setIsSizeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="arabic">
              {selectedSize ? 'تعديل الحجم' : 'إضافة حجم جديد'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sizeName" className="ltr">English Name</Label>
                <Input
                  id="sizeName"
                  value={sizeForm.name}
                  onChange={(e) => setSizeForm({...sizeForm, name: e.target.value})}
                  placeholder="Large"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sizeArabicName" className="arabic">الاسم بالعربية</Label>
                <Input
                  id="sizeArabicName"
                  value={sizeForm.arabicName}
                  onChange={(e) => setSizeForm({...sizeForm, arabicName: e.target.value})}
                  placeholder="كبير"
                  dir="rtl"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sizeValue" className="arabic">القيمة</Label>
              <Input
                id="sizeValue"
                value={sizeForm.value}
                onChange={(e) => setSizeForm({...sizeForm, value: e.target.value})}
                placeholder="L"
              />
              <p className="text-xs text-muted-foreground arabic">قيمة الحجم (مثال: L, XL, XXL)</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsSizeDialogOpen(false)}>
              إلغاء
            </Button>
            <Button type="button" onClick={handleSizeSubmit}>
              {selectedSize ? 'تحديث' : 'إضافة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Color Dialog */}
      <Dialog open={isColorDialogOpen} onOpenChange={setIsColorDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="arabic">
              {selectedColor ? 'تعديل اللون' : 'إضافة لون جديد'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="colorName" className="ltr">English Name</Label>
                <Input
                  id="colorName"
                  value={colorForm.name}
                  onChange={(e) => setColorForm({...colorForm, name: e.target.value})}
                  placeholder="Blue"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="colorArabicName" className="arabic">الاسم بالعربية</Label>
                <Input
                  id="colorArabicName"
                  value={colorForm.arabicName}
                  onChange={(e) => setColorForm({...colorForm, arabicName: e.target.value})}
                  placeholder="أزرق"
                  dir="rtl"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hexCode" className="arabic">كود اللون</Label>
              <div className="flex gap-3">
                <Input
                  id="hexCode"
                  value={colorForm.hexCode}
                  onChange={(e) => setColorForm({...colorForm, hexCode: e.target.value})}
                  placeholder="#1aa8ff"
                />
                <input
                  type="color"
                  value={colorForm.hexCode}
                  onChange={(e) => setColorForm({...colorForm, hexCode: e.target.value})}
                  className="w-12 h-10 p-1 border rounded-md"
                />
              </div>
              <p className="text-xs text-muted-foreground arabic">كود اللون بصيغة HEX (مثال: #1aa8ff)</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsColorDialogOpen(false)}>
              إلغاء
            </Button>
            <Button type="button" onClick={handleColorSubmit}>
              {selectedColor ? 'تحديث' : 'إضافة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Smell Dialog */}
      <Dialog open={isSmellDialogOpen} onOpenChange={setIsSmellDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="arabic">
              {selectedSmell ? 'تعديل الرائحة' : 'إضافة رائحة جديدة'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smellName" className="ltr">English Name</Label>
                <Input
                  id="smellName"
                  value={smellForm.name}
                  onChange={(e) => setSmellForm({...smellForm, name: e.target.value})}
                  placeholder="Citrus"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smellArabicName" className="arabic">الاسم بالعربية</Label>
                <Input
                  id="smellArabicName"
                  value={smellForm.arabicName}
                  onChange={(e) => setSmellForm({...smellForm, arabicName: e.target.value})}
                  placeholder="حمضيات"
                  dir="rtl"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smellDescription" className="arabic">الوصف</Label>
              <Textarea
                id="smellDescription"
                value={smellForm.description}
                onChange={(e) => setSmellForm({...smellForm, description: e.target.value})}
                placeholder="وصف الرائحة"
                dir="rtl"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsSmellDialogOpen(false)}>
              إلغاء
            </Button>
            <Button type="button" onClick={handleSmellSubmit}>
              {selectedSmell ? 'تحديث' : 'إضافة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="arabic">تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription className="arabic">
              {(() => {
                switch (deleteType) {
                  case 'subcategory':
                    return 'هل أنت متأكد من حذف هذا التصنيف الفرعي؟';
                  case 'size':
                    return 'هل أنت متأكد من حذف هذا الحجم؟';
                  case 'color':
                    return 'هل أنت متأكد من حذف هذا اللون؟';
                  case 'smell':
                    return 'هل أنت متأكد من حذف هذه الرائحة؟';
                  default:
                    return 'هل أنت متأكد من الحذف؟';
                }
              })()}
              لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="arabic">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <span className="arabic">حذف</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default SubcategoryManagementPage;
