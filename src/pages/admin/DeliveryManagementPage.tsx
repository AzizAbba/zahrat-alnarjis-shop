
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useProducts } from '@/contexts/ProductContext';
import { DeliveryOption, DeliveryZone } from '@/types/product';
import { MapPin, Truck, Package, Plus, Pencil, Trash2, CheckCircle2, XCircle } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const DeliveryManagementPage = () => {
  const { 
    deliveryOptions, 
    addDeliveryOption, 
    updateDeliveryOption, 
    deleteDeliveryOption,
    deliveryZones,
    addDeliveryZone,
    updateDeliveryZone,
    deleteDeliveryZone
  } = useProducts();
  
  // State for delivery options dialog
  const [isOptionDialogOpen, setIsOptionDialogOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DeliveryOption | null>(null);
  const [optionForm, setOptionForm] = useState({
    name: '',
    arabicName: '',
    price: 0,
    estimatedDays: '',
    isActive: true,
    icon: 'truck'
  });
  
  // State for delivery zones dialog
  const [isZoneDialogOpen, setIsZoneDialogOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const [zoneForm, setZoneForm] = useState({
    name: '',
    arabicName: '',
    cities: '',
    additionalFee: 0,
    isActive: true
  });
  
  // State for delete confirmation
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<'option' | 'zone'>('option');
  const [itemToDelete, setItemToDelete] = useState<string>('');
  
  // Handle open delivery option dialog
  const handleOpenOptionDialog = (option: DeliveryOption | null = null) => {
    if (option) {
      setSelectedOption(option);
      setOptionForm({
        name: option.name,
        arabicName: option.arabicName || '',
        price: option.price,
        estimatedDays: option.estimatedDays,
        isActive: option.isActive,
        icon: option.icon || 'truck'
      });
    } else {
      setSelectedOption(null);
      setOptionForm({
        name: '',
        arabicName: '',
        price: 0,
        estimatedDays: '',
        isActive: true,
        icon: 'truck'
      });
    }
    setIsOptionDialogOpen(true);
  };
  
  // Handle open delivery zone dialog
  const handleOpenZoneDialog = (zone: DeliveryZone | null = null) => {
    if (zone) {
      setSelectedZone(zone);
      setZoneForm({
        name: zone.name,
        arabicName: zone.arabicName || '',
        cities: zone.cities.join(', '),
        additionalFee: zone.additionalFee,
        isActive: zone.isActive
      });
    } else {
      setSelectedZone(null);
      setZoneForm({
        name: '',
        arabicName: '',
        cities: '',
        additionalFee: 0,
        isActive: true
      });
    }
    setIsZoneDialogOpen(true);
  };
  
  // Handle delivery option form submission
  const handleOptionSubmit = () => {
    // Validation
    if (!optionForm.name || !optionForm.arabicName) {
      toast.error('جميع الحقول مطلوبة');
      return;
    }
    
    try {
      const optionData: DeliveryOption = {
        id: selectedOption?.id || Date.now().toString(),
        name: optionForm.name,
        arabicName: optionForm.arabicName,
        price: optionForm.price,
        estimatedDays: optionForm.estimatedDays,
        isActive: optionForm.isActive,
        icon: optionForm.icon
      };
      
      if (selectedOption) {
        updateDeliveryOption(selectedOption.id, optionData);
        toast.success('تم تحديث خيار التوصيل بنجاح');
      } else {
        addDeliveryOption(optionData);
        toast.success('تم إضافة خيار التوصيل بنجاح');
      }
      
      setIsOptionDialogOpen(false);
    } catch (error) {
      toast.error('حدث خطأ أثناء حفظ خيار التوصيل');
    }
  };
  
  // Handle delivery zone form submission
  const handleZoneSubmit = () => {
    // Validation
    if (!zoneForm.name || !zoneForm.arabicName || !zoneForm.cities) {
      toast.error('جميع الحقول مطلوبة');
      return;
    }
    
    try {
      const zoneData: DeliveryZone = {
        id: selectedZone?.id || Date.now().toString(),
        name: zoneForm.name,
        arabicName: zoneForm.arabicName,
        cities: zoneForm.cities.split(',').map(city => city.trim()),
        additionalFee: zoneForm.additionalFee,
        isActive: zoneForm.isActive
      };
      
      if (selectedZone) {
        updateDeliveryZone(selectedZone.id, zoneData);
        toast.success('تم تحديث منطقة التوصيل بنجاح');
      } else {
        addDeliveryZone(zoneData);
        toast.success('تم إضافة منطقة التوصيل بنجاح');
      }
      
      setIsZoneDialogOpen(false);
    } catch (error) {
      toast.error('حدث خطأ أثناء حفظ منطقة التوصيل');
    }
  };
  
  // Handle delete confirmation
  const handleOpenDeleteDialog = (type: 'option' | 'zone', id: string) => {
    setDeleteType(type);
    setItemToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = () => {
    try {
      if (deleteType === 'option') {
        deleteDeliveryOption(itemToDelete);
        toast.success('تم حذف خيار التوصيل بنجاح');
      } else {
        deleteDeliveryZone(itemToDelete);
        toast.success('تم حذف منطقة التوصيل بنجاح');
      }
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error('حدث خطأ أثناء الحذف');
    }
  };
  
  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <div className="flex items-center text-green-600">
        <CheckCircle2 className="h-4 w-4 mr-1" />
        <span className="arabic text-xs">نشط</span>
      </div>
    ) : (
      <div className="flex items-center text-red-600">
        <XCircle className="h-4 w-4 mr-1" />
        <span className="arabic text-xs">غير نشط</span>
      </div>
    );
  };
  
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold arabic">إدارة التوصيل</h1>
        <p className="text-muted-foreground arabic mt-1">
          إدارة خيارات ومناطق التوصيل المتاحة للعملاء
        </p>
      </div>
      
      <Tabs defaultValue="options" className="space-y-6">
        <TabsList className="mb-4">
          <TabsTrigger value="options" className="arabic">خيارات التوصيل</TabsTrigger>
          <TabsTrigger value="zones" className="arabic">مناطق التوصيل</TabsTrigger>
        </TabsList>
        
        {/* Delivery Options Tab */}
        <TabsContent value="options">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold arabic">خيارات التوصيل</h2>
            <Button onClick={() => handleOpenOptionDialog()} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span className="arabic">إضافة خيار جديد</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deliveryOptions.map(option => (
              <Card key={option.id} className="border border-border">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="p-2 bg-narcissus-100 rounded-md text-narcissus-600 mr-2">
                        {option.icon === 'truck' && <Truck className="h-5 w-5" />}
                        {option.icon === 'package' && <Package className="h-5 w-5" />}
                        {option.icon === 'mapPin' && <MapPin className="h-5 w-5" />}
                      </div>
                      <CardTitle className="text-lg arabic">{option.arabicName}</CardTitle>
                    </div>
                    {getStatusBadge(option.isActive)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground arabic">السعر:</span>
                      <span className="font-medium ltr">{option.price} ريال</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground arabic">مدة التوصيل:</span>
                      <span className="font-medium arabic">{option.estimatedDays} يوم</span>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleOpenOptionDialog(option)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleOpenDeleteDialog('option', option.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {deliveryOptions.length === 0 && (
              <div className="col-span-full text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                <Package className="h-10 w-10 mx-auto text-muted-foreground mb-2 opacity-50" />
                <p className="text-muted-foreground arabic">
                  لا توجد خيارات توصيل بعد. أضف خيار جديد.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Delivery Zones Tab */}
        <TabsContent value="zones">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold arabic">مناطق التوصيل</h2>
            <Button onClick={() => handleOpenZoneDialog()} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span className="arabic">إضافة منطقة جديدة</span>
            </Button>
          </div>
          
          <div className="bg-card rounded-lg shadow-sm border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-right arabic font-medium">المنطقة</th>
                    <th className="p-3 text-right arabic font-medium">المدن</th>
                    <th className="p-3 text-right arabic font-medium">الرسوم الإضافية</th>
                    <th className="p-3 text-right arabic font-medium">الحالة</th>
                    <th className="p-3 text-right arabic font-medium">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryZones.map(zone => (
                    <tr key={zone.id} className="border-b">
                      <td className="p-3 arabic">{zone.arabicName}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1 max-w-[250px]">
                          {zone.cities.map((city, index) => (
                            <span key={index} className="bg-muted px-2 py-0.5 rounded-full text-xs arabic">
                              {city}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 ltr">{zone.additionalFee} ريال</td>
                      <td className="p-3">
                        {getStatusBadge(zone.isActive)}
                      </td>
                      <td className="p-3">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleOpenZoneDialog(zone)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleOpenDeleteDialog('zone', zone.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {deliveryZones.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center">
                        <MapPin className="h-10 w-10 mx-auto text-muted-foreground mb-2 opacity-50" />
                        <p className="text-muted-foreground arabic">
                          لا توجد مناطق توصيل بعد. أضف منطقة جديدة.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Delivery Option Dialog */}
      <Dialog open={isOptionDialogOpen} onOpenChange={setIsOptionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="arabic">
              {selectedOption ? 'تعديل خيار التوصيل' : 'إضافة خيار توصيل جديد'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="ltr">English Name</Label>
                <Input
                  id="name"
                  value={optionForm.name}
                  onChange={(e) => setOptionForm({...optionForm, name: e.target.value})}
                  placeholder="Delivery option name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="arabicName" className="arabic">الاسم بالعربية</Label>
                <Input
                  id="arabicName"
                  value={optionForm.arabicName}
                  onChange={(e) => setOptionForm({...optionForm, arabicName: e.target.value})}
                  placeholder="اسم خيار التوصيل"
                  dir="rtl"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="arabic">السعر</Label>
                <Input
                  id="price"
                  type="number"
                  value={optionForm.price}
                  onChange={(e) => setOptionForm({...optionForm, price: parseFloat(e.target.value)})}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="estimatedDays" className="arabic">مدة التوصيل (بالأيام)</Label>
                <Input
                  id="estimatedDays"
                  value={optionForm.estimatedDays}
                  onChange={(e) => setOptionForm({...optionForm, estimatedDays: e.target.value})}
                  placeholder="1-3"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="icon" className="arabic">الأيقونة</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={optionForm.icon === 'truck' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setOptionForm({...optionForm, icon: 'truck'})}
                >
                  <Truck className="h-4 w-4 mr-2" />
                  <span className="arabic">شاحنة</span>
                </Button>
                <Button
                  type="button"
                  variant={optionForm.icon === 'package' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setOptionForm({...optionForm, icon: 'package'})}
                >
                  <Package className="h-4 w-4 mr-2" />
                  <span className="arabic">طرد</span>
                </Button>
                <Button
                  type="button"
                  variant={optionForm.icon === 'mapPin' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setOptionForm({...optionForm, icon: 'mapPin'})}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="arabic">موقع</span>
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="isActive" className="arabic">نشط</Label>
              <Switch
                id="isActive"
                checked={optionForm.isActive}
                onCheckedChange={(checked) => setOptionForm({...optionForm, isActive: checked})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOptionDialogOpen(false)}>
              إلغاء
            </Button>
            <Button type="button" onClick={handleOptionSubmit}>
              {selectedOption ? 'تحديث' : 'إضافة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delivery Zone Dialog */}
      <Dialog open={isZoneDialogOpen} onOpenChange={setIsZoneDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="arabic">
              {selectedZone ? 'تعديل منطقة التوصيل' : 'إضافة منطقة توصيل جديدة'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zoneName" className="ltr">English Name</Label>
                <Input
                  id="zoneName"
                  value={zoneForm.name}
                  onChange={(e) => setZoneForm({...zoneForm, name: e.target.value})}
                  placeholder="Zone name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="zoneArabicName" className="arabic">الاسم بالعربية</Label>
                <Input
                  id="zoneArabicName"
                  value={zoneForm.arabicName}
                  onChange={(e) => setZoneForm({...zoneForm, arabicName: e.target.value})}
                  placeholder="اسم المنطقة"
                  dir="rtl"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cities" className="arabic">المدن (مفصولة بفواصل)</Label>
              <Input
                id="cities"
                value={zoneForm.cities}
                onChange={(e) => setZoneForm({...zoneForm, cities: e.target.value})}
                placeholder="الرياض، جدة، الدمام"
                dir="rtl"
              />
              <p className="text-xs text-muted-foreground arabic">أدخل أسماء المدن مفصولة بفواصل</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="additionalFee" className="arabic">الرسوم الإضافية</Label>
              <Input
                id="additionalFee"
                type="number"
                value={zoneForm.additionalFee}
                onChange={(e) => setZoneForm({...zoneForm, additionalFee: parseFloat(e.target.value)})}
                placeholder="0"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="zoneIsActive" className="arabic">نشط</Label>
              <Switch
                id="zoneIsActive"
                checked={zoneForm.isActive}
                onCheckedChange={(checked) => setZoneForm({...zoneForm, isActive: checked})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsZoneDialogOpen(false)}>
              إلغاء
            </Button>
            <Button type="button" onClick={handleZoneSubmit}>
              {selectedZone ? 'تحديث' : 'إضافة'}
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
              {deleteType === 'option' 
                ? 'هل أنت متأكد من حذف خيار التوصيل هذا؟' 
                : 'هل أنت متأكد من حذف منطقة التوصيل هذه؟'
              } 
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

export default DeliveryManagementPage;
