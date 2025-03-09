
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Pencil, Trash2, Search, Truck, MapPin, Check, X } from 'lucide-react';
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
import { DeliveryOption, DeliveryZone } from '@/types/product';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

const DeliveryManagementPage = () => {
  const { 
    deliveryOptions, 
    deliveryZones,
    addDeliveryOption,
    updateDeliveryOption,
    deleteDeliveryOption,
    addDeliveryZone,
    updateDeliveryZone,
    deleteDeliveryZone
  } = useProducts();
  
  const [activeTab, setActiveTab] = useState('options');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    arabicName: '',
    price: '',
    description: '',
    estimatedDays: '',
    isActive: true,
    icon: '',
    cities: '',
    additionalFee: ''
  });
  
  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      arabicName: '',
      price: '',
      description: '',
      estimatedDays: '',
      isActive: true,
      icon: '',
      cities: '',
      additionalFee: ''
    });
    setSelectedItem(null);
  };
  
  const handleOpenDialog = (item: any | null = null) => {
    if (item) {
      if (activeTab === 'options') {
        const option = item as DeliveryOption;
        setFormData({
          id: option.id,
          name: option.name,
          arabicName: option.arabicName || '',
          price: option.price.toString(),
          description: option.description || '',
          estimatedDays: option.estimatedDays || '',
          isActive: option.isActive,
          icon: option.icon || '',
          cities: '',
          additionalFee: ''
        });
      } else {
        const zone = item as DeliveryZone;
        setFormData({
          id: zone.id,
          name: zone.name,
          arabicName: zone.arabicName || '',
          price: '',
          description: '',
          estimatedDays: '',
          isActive: zone.isActive,
          icon: '',
          cities: zone.cities.join(', '),
          additionalFee: zone.additionalFee.toString()
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
      if (activeTab === 'options') {
        // Validation
        if (!formData.name || !formData.price) {
          toast({
            title: "Input Error",
            description: 'الاسم والسعر مطلوبين',
            variant: "destructive"
          });
          return;
        }
        
        const price = parseFloat(formData.price);
        if (isNaN(price) || price < 0) {
          toast({
            title: "Price Error",
            description: 'السعر يجب أن يكون رقماً صحيحاً',
            variant: "destructive"
          });
          return;
        }
        
        const optionData: Partial<DeliveryOption> = {
          name: formData.name,
          arabicName: formData.arabicName,
          price: price,
          description: formData.description,
          estimatedDays: formData.estimatedDays,
          isActive: formData.isActive,
          icon: formData.icon,
        };
        
        if (selectedItem) {
          updateDeliveryOption(formData.id, optionData);
        } else {
          addDeliveryOption(optionData as Omit<DeliveryOption, 'id'>);
        }
      } else {
        // Validation
        if (!formData.name || !formData.cities || !formData.additionalFee) {
          toast({
            title: "Input Error",
            description: 'الاسم والمدن والرسوم الإضافية مطلوبة',
            variant: "destructive"
          });
          return;
        }
        
        const additionalFee = parseFloat(formData.additionalFee);
        if (isNaN(additionalFee) || additionalFee < 0) {
          toast({
            title: "Fee Error",
            description: 'الرسوم الإضافية يجب أن تكون رقماً صحيحاً',
            variant: "destructive"
          });
          return;
        }
        
        const cities = formData.cities.split(',').map(city => city.trim()).filter(city => city);
        
        if (cities.length === 0) {
          toast({
            title: "Cities Error",
            description: 'يجب إضافة مدينة واحدة على الأقل',
            variant: "destructive"
          });
          return;
        }
        
        const zoneData: Partial<DeliveryZone> = {
          name: formData.name,
          arabicName: formData.arabicName,
          cities: cities,
          additionalFee: additionalFee,
          isActive: formData.isActive
        };
        
        if (selectedItem) {
          updateDeliveryZone(formData.id, zoneData);
        } else {
          addDeliveryZone(zoneData as Omit<DeliveryZone, 'id'>);
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
      if (activeTab === 'options') {
        deleteDeliveryOption(selectedItem.id);
      } else {
        deleteDeliveryZone(selectedItem.id);
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
  
  const getIconOptions = () => [
    { value: 'truck', label: 'شاحنة' },
    { value: 'package', label: 'طرد' },
    { value: 'zap', label: 'سريع' },
    { value: 'clock', label: 'ساعة' },
    { value: 'store', label: 'متجر' }
  ];
  
  const getFilteredItems = () => {
    const search = searchTerm.toLowerCase();
    
    if (activeTab === 'options') {
      return deliveryOptions.filter(
        item => item.name.toLowerCase().includes(search) ||
               (item.arabicName || '').toLowerCase().includes(search) ||
               (item.description || '').toLowerCase().includes(search)
      );
    } else {
      return deliveryZones.filter(
        item => item.name.toLowerCase().includes(search) ||
               (item.arabicName || '').toLowerCase().includes(search) ||
               item.cities.some(city => city.toLowerCase().includes(search))
      );
    }
  };
  
  const renderDeliveryOptionsForm = () => {
    return (
      <>
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
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price" className="arabic">السعر (ريال)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              placeholder="0.00"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="estimatedDays" className="arabic">وقت التوصيل المتوقع (أيام)</Label>
            <Input
              id="estimatedDays"
              value={formData.estimatedDays}
              onChange={(e) => setFormData({...formData, estimatedDays: e.target.value})}
              placeholder="مثال: 1-3"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description" className="arabic">الوصف</Label>
          <Textarea
            id="description"
            dir="rtl"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="وصف اختياري"
            rows={2}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="icon" className="arabic">الأيقونة</Label>
          <Select 
            value={formData.icon} 
            onValueChange={(value) => setFormData({...formData, icon: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر أيقونة" />
            </SelectTrigger>
            <SelectContent>
              {getIconOptions().map((icon) => (
                <SelectItem key={icon.value} value={icon.value} className="arabic">
                  {icon.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
          />
          <Label htmlFor="isActive" className="arabic">فعّال</Label>
        </div>
      </>
    );
  };
  
  const renderDeliveryZonesForm = () => {
    return (
      <>
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
        
        <div className="space-y-2">
          <Label htmlFor="cities" className="arabic">المدن (مفصولة بفواصل)</Label>
          <Textarea
            id="cities"
            dir="rtl"
            value={formData.cities}
            onChange={(e) => setFormData({...formData, cities: e.target.value})}
            placeholder="مثال: الرياض، جدة، الدمام"
            rows={2}
          />
          <p className="text-xs text-muted-foreground arabic">
            أدخل أسماء المدن مفصولة بفواصل
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="additionalFee" className="arabic">الرسوم الإضافية (ريال)</Label>
          <Input
            id="additionalFee"
            type="number"
            min="0"
            step="0.01"
            value={formData.additionalFee}
            onChange={(e) => setFormData({...formData, additionalFee: e.target.value})}
            placeholder="0.00"
          />
        </div>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
          />
          <Label htmlFor="isActive" className="arabic">فعّال</Label>
        </div>
      </>
    );
  };
  
  const renderDeliveryOptionsTable = () => {
    const items = getFilteredItems() as DeliveryOption[];
    
    return (
      <table className="w-full">
        <thead>
          <tr className="border-b text-right">
            <th className="p-3 font-medium arabic">الاسم</th>
            <th className="p-3 font-medium arabic">السعر</th>
            <th className="p-3 font-medium arabic">وقت التوصيل</th>
            <th className="p-3 font-medium arabic">الحالة</th>
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
                  {item.description && <p className="text-xs text-muted-foreground arabic mt-1">{item.description}</p>}
                </div>
              </td>
              <td className="p-3 ltr text-center">
                {item.price === 0 ? (
                  <span className="text-green-600 font-medium">مجاناً</span>
                ) : (
                  `${item.price} ريال`
                )}
              </td>
              <td className="p-3 arabic text-center">{item.estimatedDays || "-"}</td>
              <td className="p-3 text-center">
                {item.isActive ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Check className="mr-1 h-3 w-3" /> فعّال
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    <X className="mr-1 h-3 w-3" /> معطل
                  </Badge>
                )}
              </td>
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
              <td colSpan={5} className="p-4 text-center text-muted-foreground arabic">
                لا توجد خيارات توصيل
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };
  
  const renderDeliveryZonesTable = () => {
    const items = getFilteredItems() as DeliveryZone[];
    
    return (
      <table className="w-full">
        <thead>
          <tr className="border-b text-right">
            <th className="p-3 font-medium arabic">المنطقة</th>
            <th className="p-3 font-medium arabic">المدن</th>
            <th className="p-3 font-medium arabic">الرسوم الإضافية</th>
            <th className="p-3 font-medium arabic">الحالة</th>
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
                <div className="flex flex-wrap gap-1">
                  {item.cities.map((city, index) => (
                    <Badge key={index} variant="secondary" className="arabic">
                      {city}
                    </Badge>
                  ))}
                </div>
              </td>
              <td className="p-3 ltr text-center">
                {item.additionalFee === 0 ? (
                  <span className="text-green-600 font-medium">لا يوجد</span>
                ) : (
                  `+${item.additionalFee} ريال`
                )}
              </td>
              <td className="p-3 text-center">
                {item.isActive ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Check className="mr-1 h-3 w-3" /> فعّال
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    <X className="mr-1 h-3 w-3" /> معطل
                  </Badge>
                )}
              </td>
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
              <td colSpan={5} className="p-4 text-center text-muted-foreground arabic">
                لا توجد مناطق توصيل
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
        <h1 className="text-2xl font-bold arabic">إدارة خيارات التوصيل</h1>
        
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
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="options" className="arabic flex items-center gap-2">
            <Truck size={16} /> خيارات التوصيل
          </TabsTrigger>
          <TabsTrigger value="zones" className="arabic flex items-center gap-2">
            <MapPin size={16} /> مناطق التوصيل
          </TabsTrigger>
        </TabsList>
        
        <div className="bg-card rounded-lg border shadow-sm">
          <div className="overflow-x-auto">
            <TabsContent value="options" className="mt-0">
              {renderDeliveryOptionsTable()}
            </TabsContent>
            
            <TabsContent value="zones" className="mt-0">
              {renderDeliveryZonesTable()}
            </TabsContent>
          </div>
        </div>
      </Tabs>
      
      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="arabic">
              {selectedItem ? 'تعديل' : 'إضافة'}
              {activeTab === 'options' ? ' خيار توصيل' : ' منطقة توصيل'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              {activeTab === 'options' ? renderDeliveryOptionsForm() : renderDeliveryZonesForm()}
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
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="arabic">تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription className="arabic">
              هل أنت متأكد من حذف
              {activeTab === 'options' ? ' خيار التوصيل ' : ' منطقة التوصيل '}
              هذا؟ لا يمكن التراجع عن هذا الإجراء.
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

export default DeliveryManagementPage;
