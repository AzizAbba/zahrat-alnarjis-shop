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
import { Product } from '@/types/product';

// Define categories since it's missing from sampleData
const categories = [
  "المنظفات المنزلية",
  "منظفات الملابس",
  "معطرات الجو",
  "أدوات التنظيف",
  "العروض الخاصة"
];

const AdminProductsPage = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    inStock: true
  });
  
  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      inStock: true
    });
    setSelectedProduct(null);
  };
  
  const handleOpenDialog = (product: Product | null = null) => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category || product.categoryId,
        image: product.image || product.imageUrl,
        inStock: product.inStock !== undefined ? product.inStock : (product.stock > 0)
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
    if (!formData.name || !formData.price || !formData.category) {
      toast({
        title: "Error",
        description: 'الاسم والسعر والتصنيف مطلوبين',
        variant: "destructive"
      });
      return;
    }
    
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Error",
        description: 'السعر يجب أن يكون رقماً موجباً',
        variant: "destructive"
      });
      return;
    }
    
    try {
      const productData = {
        id: formData.id || Date.now().toString(),
        name: formData.name,
        description: formData.description,
        price,
        categoryId: formData.category,
        category: formData.category,
        imageUrl: formData.image || '/placeholder.svg',
        image: formData.image || '/placeholder.svg',
        stock: formData.inStock ? 10 : 0,
        inStock: formData.inStock
      };
      
      if (selectedProduct) {
        // Update existing product
        updateProduct(productData);
        toast({
          title: "Success",
          description: 'تم تحديث المنتج بنجاح'
        });
      } else {
        // Add new product
        addProduct(productData);
        toast({
          title: "Success",
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
      toast.success('تم حذف المنتج بنجاح');
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
    }
  };
  
  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category || product.categoryId).toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold arabic">إدارة المنتجات</h1>
        
        <div className="flex w-full sm:w-auto gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث عن منتج..."
              className="pl-8 rtl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
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
                <th className="p-3 font-medium arabic">الحالة</th>
                <th className="p-3 font-medium arabic">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b text-right">
                  <td className="p-3">
                    <div className="h-10 w-10 rounded overflow-hidden bg-muted">
                      <img 
                        src={product.image || product.imageUrl} 
                        alt={product.name} 
                        className="h-full w-full object-cover" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  </td>
                  <td className="p-3 arabic">{product.name}</td>
                  <td className="p-3 arabic">{product.category || product.categoryId}</td>
                  <td className="p-3 ltr">{product.price.toFixed(2)} ريال</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      (product.inStock !== undefined ? product.inStock : product.stock > 0)
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    } arabic`}>
                      {(product.inStock !== undefined ? product.inStock : product.stock > 0) ? 'متوفر' : 'غير متوفر'}
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
              <div className="space-y-2">
                <Label htmlFor="name" className="arabic">اسم المنتج</Label>
                <Input
                  id="name"
                  dir="rtl"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="أدخل اسم المنتج"
                />
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
                  <Label htmlFor="category" className="arabic">التصنيف</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({...formData, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر التصنيف" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category} className="arabic">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image" className="arabic">رابط الصورة</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
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
                    id="inStock"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({...formData, inStock: e.target.checked})}
                  />
                </div>
                <div className="leading-none">
                  <label htmlFor="inStock" className="text-sm font-medium arabic mr-3">
                    متوفر في المخزون
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
