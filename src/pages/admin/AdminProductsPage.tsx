
import React, { useState, useRef } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Pencil, Trash2, Search, FileDown, FileUp } from 'lucide-react';
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
import { toast as sonnerToast } from 'sonner';
import { Product } from '@/types/product';
import { ImageUploader } from '@/components/common/FileUploader';

const AdminProductsPage = () => {
  const { products, categories, subcategories, addProduct, updateProduct, deleteProduct } = useProducts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    arabicName: '',
    description: '',
    price: '',
    categoryId: '',
    subcategoryId: '',
    imageUrl: '',
    inStock: true,
    stock: '10',
    featured: false
  });
  
  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      arabicName: '',
      description: '',
      price: '',
      categoryId: '',
      subcategoryId: '',
      imageUrl: '',
      inStock: true,
      stock: '10',
      featured: false
    });
    setSelectedProduct(null);
  };
  
  const handleOpenDialog = (product: Product | null = null) => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name,
        arabicName: product.arabicName || '',
        description: product.description,
        price: product.price.toString(),
        categoryId: product.categoryId,
        subcategoryId: product.subcategoryId || '',
        imageUrl: product.imageUrl,
        inStock: product.stock > 0,
        stock: product.stock.toString(),
        featured: product.featured || false
      });
      setSelectedProduct(product);
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
    
    // Validation
    if (!formData.name || !formData.price || !formData.categoryId) {
      toast({
        title: "Input Error",
        description: 'الاسم والسعر والتصنيف مطلوبين',
        variant: "destructive"
      });
      return;
    }
    
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Price Error",
        description: 'السعر يجب أن يكون رقماً موجباً',
        variant: "destructive"
      });
      return;
    }
    
    try {
      const productData = {
        id: formData.id || Date.now().toString(),
        name: formData.name,
        arabicName: formData.arabicName,
        description: formData.description,
        price,
        categoryId: formData.categoryId,
        subcategoryId: formData.subcategoryId,
        imageUrl: formData.imageUrl || '/placeholder.svg',
        stock: parseInt(formData.stock) || 0,
        featured: formData.featured,
        createdAt: formData.id ? undefined : new Date().toISOString()
      };
      
      if (selectedProduct) {
        // Update existing product
        updateProduct(productData.id, productData);
        toast({
          title: "Product Updated", 
          description: 'تم تحديث المنتج بنجاح'
        });
      } else {
        // Add new product
        addProduct(productData);
        toast({
          title: "Product Added",
          description: 'تم إضافة المنتج بنجاح'
        });
      }
      
      handleCloseDialog();
    } catch (error) {
      toast({
        title: "Error",
        description: 'حدث خطأ أثناء حفظ المنتج',
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteProduct = () => {
    if (selectedProduct) {
      deleteProduct(selectedProduct.id);
      sonnerToast.success("تم حذف المنتج بنجاح");
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
    }
  };
  
  const handleExportProducts = () => {
    try {
      const dataStr = JSON.stringify(products, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = 'products.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      sonnerToast.success("تم تصدير المنتجات بنجاح");
    } catch (error) {
      toast({
        title: "Export Error",
        description: 'حدث خطأ أثناء تصدير المنتجات',
        variant: "destructive"
      });
    }
  };
  
  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.arabicName || '').includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categoryId.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? (category.arabicName || category.name) : categoryId;
  };
  
  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold arabic">إدارة المنتجات</h1>
        
        <div className="flex w-full sm:w-auto gap-2 flex-wrap">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث عن منتج..."
              className="pl-8 rtl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button variant="outline" size="icon" title="تصدير المنتجات" onClick={handleExportProducts}>
            <FileDown size={16} />
          </Button>
          
          <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2 whitespace-nowrap">
            <PlusCircle size={16} />
            <span className="arabic">إضافة منتج</span>
          </Button>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-right">
                <th className="p-3 font-medium arabic">الصورة</th>
                <th className="p-3 font-medium arabic">الاسم</th>
                <th className="p-3 font-medium arabic">التصنيف</th>
                <th className="p-3 font-medium arabic">السعر</th>
                <th className="p-3 font-medium arabic">المخزون</th>
                <th className="p-3 font-medium arabic">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b text-right">
                  <td className="p-3">
                    <div className="h-10 w-10 rounded overflow-hidden bg-muted">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="h-full w-full object-cover" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  </td>
                  <td className="p-3">
                    <div>
                      <p className="arabic font-medium">{product.arabicName || product.name}</p>
                      {product.arabicName && <p className="text-xs text-muted-foreground ltr">{product.name}</p>}
                      {product.featured && <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full arabic mt-1 inline-block">مميز</span>}
                    </div>
                  </td>
                  <td className="p-3 arabic">{getCategoryName(product.categoryId)}</td>
                  <td className="p-3 ltr">{product.price.toFixed(2)} ريال</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.stock > 0
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    } arabic`}>
                      {product.stock > 0 ? `${product.stock} متوفر` : 'غير متوفر'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleOpenDialog(product)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-muted-foreground arabic">
                    لا توجد منتجات
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="arabic">
              {selectedProduct ? 'تعديل منتج' : 'إضافة منتج جديد'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              {/* Image uploader */}
              <div className="space-y-2">
                <Label className="arabic">صورة المنتج</Label>
                <div className="flex flex-col items-center">
                  <ImageUploader 
                    imageUrl={formData.imageUrl}
                    onImageUploaded={(url) => setFormData({...formData, imageUrl: url})}
                    className="w-40 h-40 mx-auto"
                  />
                  <p className="text-xs text-center text-muted-foreground mt-2 arabic">
                    انقر على الصورة لتحميل صورة جديدة
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="ltr">English Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Product name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="arabicName" className="arabic">الاسم بالعربية</Label>
                  <Input
                    id="arabicName"
                    dir="rtl"
                    value={formData.arabicName}
                    onChange={(e) => setFormData({...formData, arabicName: e.target.value})}
                    placeholder="اسم المنتج"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="arabic">وصف المنتج</Label>
                <Textarea
                  id="description"
                  dir="rtl"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="أدخل وصف المنتج"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="arabic">السعر</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stock" className="arabic">المخزون</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value, inStock: parseInt(e.target.value) > 0})}
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryId" className="arabic">التصنيف</Label>
                  <Select 
                    value={formData.categoryId} 
                    onValueChange={(value) => setFormData({...formData, categoryId: value, subcategoryId: ''})}
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
                  <Label htmlFor="subcategoryId" className="arabic">التصنيف الفرعي</Label>
                  <Select 
                    value={formData.subcategoryId} 
                    onValueChange={(value) => setFormData({...formData, subcategoryId: value})}
                    disabled={!formData.categoryId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر التصنيف الفرعي" />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories
                        .filter(sub => sub.categoryId === formData.categoryId)
                        .map((sub) => (
                          <SelectItem key={sub.id} value={sub.id} className="arabic">
                            {sub.arabicName || sub.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="arabic">رابط الصورة</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  placeholder="أدخل رابط الصورة"
                />
                <p className="text-xs text-muted-foreground arabic">
                  اترك فارغاً لاستخدام صورة افتراضية
                </p>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex h-4 items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  />
                </div>
                <div className="leading-none">
                  <label htmlFor="featured" className="text-sm font-medium arabic mr-3">
                    منتج مميز
                  </label>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                إلغاء
              </Button>
              <Button type="submit">
                {selectedProduct ? 'تحديث' : 'إضافة'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="arabic">حذف المنتج</AlertDialogTitle>
            <AlertDialogDescription className="arabic">
              هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="arabic">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground arabic"
              onClick={handleDeleteProduct}
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminProductsPage;
