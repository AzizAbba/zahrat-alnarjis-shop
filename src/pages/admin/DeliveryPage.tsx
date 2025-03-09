
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { PlusCircle, Pencil, Trash2, Truck, MapPin } from 'lucide-react';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { toast } from '@/components/ui/use-toast';
import { toast as sonnerToast } from 'sonner';
import { useProducts } from '@/contexts/ProductContext';
import { DeliveryOption, DeliveryZone } from '@/types/product';

const DeliveryPage: React.FC = () => {
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
  
  // Delivery options state
  const [isOptionDialogOpen, setIsOptionDialogOpen] = useState(false);
  const [isOptionDeleteDialogOpen, setIsOptionDeleteDialogOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DeliveryOption | null>(null);
  const [optionFormData, setOptionFormData] = useState({
    id: '',
    name: '',
    arabicName: '',
    price: '',
    description: '',
    estimatedDays: '',
    isActive: true,
    icon: ''
  });
  
  // Delivery zones state
  const [isZoneDialogOpen, setIsZoneDialogOpen] = useState(false);
  const [isZoneDeleteDialogOpen, setIsZoneDeleteDialogOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const [zoneFormData, setZoneFormData] = useState({
    id: '',
    name: '',
    arabicName: '',
    cities: '',
    additionalFee: '',
    isActive: true
  });
  
  // Reset form data
  const resetOptionForm = () => {
    setOptionFormData({
      id: '',
      name: '',
      arabicName: '',
      price: '',
      description: '',
      estimatedDays: '',
      isActive: true,
      icon: ''
    });
    setSelectedOption(null);
  };
  
  const resetZoneForm = () => {
    setZoneFormData({
      id: '',
      name: '',
      arabicName: '',
      cities: '',
      additionalFee: '',
      isActive: true
    });
    setSelectedZone(null);
  };
  
  // Open dialogs
  const handleOpenOptionDialog = (option: DeliveryOption | null = null) => {
    if (option) {
      setOptionFormData({
        id: option.id,
        name: option.name,
        arabicName: option.arabicName || '',
        price: option.price.toString(),
        description: option.description || '',
        estimatedDays: option.estimatedDays || '',
        isActive: option.isActive,
        icon: option.icon || ''
      });
      setSelectedOption(option);
    } else {
      resetOptionForm();
    }
    setIsOptionDialogOpen(true);
  };
  
  const handleOpenZoneDialog = (zone: DeliveryZone | null = null) => {
    if (zone) {
      setZoneFormData({
        id: zone.id,
        name: zone.name,
        arabicName: zone.arabicName || '',
        cities: zone.cities.join(', '),
        additionalFee: zone.additionalFee.toString(),
        isActive: zone.isActive
      });
      setSelectedZone(zone);
    } else {
      resetZoneForm();
    }
    setIsZoneDialogOpen(true);
  };
  
  // Submit forms
  const handleOptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!optionFormData.name || !optionFormData.price) {
      toast({
        title: "Input Error",
        description: 'اسم طريقة التوصيل والسعر مطلوبين',
        variant: "destructive"
      });
      return;
    }
    
    const price = parseFloat(optionFormData.price);
    if (isNaN(price) || price < 0) {
      toast({
        title: "Price Error",
        description: 'السعر يجب أن يكون رقماً صحيحاً',
        variant: "destructive"
      });
      return;
    }
    
    try {
      const optionData = {
        name: optionFormData.name,
        arabicName: optionFormData.arabicName || undefined,
        price,
        description: optionFormData.description || undefined,
        estimatedDays: optionFormData.estimatedDays || undefined,
        isActive: optionFormData.isActive,
        icon: optionFormData.icon || undefined
      };
      
      if (selectedOption) {
        // Update
        updateDeliveryOption(selectedOption.id, optionData);
        toast({
          title: "Delivery Option Updated",
          description: 'تم تحديث طريقة التوصيل بنجاح'
        });
      } else {
        // Add
        addDeliveryOption(optionData);
        toast({
          title: "Delivery Option Added",
          description: 'تم إضافة طريقة التوصيل بنجاح'
        });
      }
      
      setIsOptionDialogOpen(false);
      resetOptionForm();
    } catch (error) {
      toast({
        title: "Error",
        description: 'حدث خطأ أثناء حفظ طريقة التوصيل',
        variant: "destructive"
      });
    }
  };
  
  const handleZoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!zoneFormData.name || !zoneFormData.cities) {
      toast({
        title: "Input Error",
        description: 'اسم منطقة التوصيل والمدن مطلوبة',
        variant: "destructive"
      });
      return;
    }
    
    const additionalFee = parseFloat(zoneFormData.additionalFee);
    if (isNaN(additionalFee) || additionalFee < 0) {
      toast({
        title: "Fee Error",
        description: 'الرسوم الإضافية يجب أن تكون رقماً صحيحاً',
        variant: "destructive"
      });
      return;
    }
    
    try {
      const zoneData = {
        name: zoneFormData.name,
        arabicName: zoneFormData.arabicName || undefined,
        cities: zoneFormData.cities.split(',').map(city => city.trim()),
        additionalFee,
        isActive: zoneFormData.isActive
      };
      
      if (selectedZone) {
        // Update
        updateDeliveryZone(selectedZone.id, zoneData);
        toast({
          title: "Delivery Zone Updated",
          description: 'تم تحديث منطقة التوصيل بنجاح'
        });
      } else {
        // Add
        addDeliveryZone(zoneData);
        toast({
          title: "Delivery Zone Added",
          description: 'تم إضافة منطقة التوصيل بنجاح'
        });
      }
      
      setIsZoneDialogOpen(false);
      resetZoneForm();
    } catch (error) {
      toast({
        title: "Error",
        description: 'حدث خطأ أثناء حفظ منطقة التوصيل',
        variant: "destructive"
      });
    }
  };
  
  // Delete handlers
  const handleDeleteOption = () => {
    if (selectedOption) {
      deleteDeliveryOption(selectedOption.id);
      sonnerToast.success("تم حذف طريقة التوصيل بنجاح");
      setIsOptionDeleteDialogOpen(false);
      setSelectedOption(null);
    }
  };
  
  const handleDeleteZone = () => {
    if (selectedZone) {
      deleteDeliveryZone(selectedZone.id);
      sonnerToast.success("تم حذف منطقة التوصيل بنجاح");
      setIsZoneDeleteDialogOpen(false);
      setSelectedZone(null);
    }
  };
  
  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold arabic">إدارة التوصيل</h1>
      </div>
      
      <Tabs defaultValue="options" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="options" className="arabic">طرق التوصيل</TabsTrigger>
          <TabsTrigger value="zones" className="arabic">مناطق التوصيل</TabsTrigger>
        </TabsList>
        
        {/* Delivery Options Tab */}
        <TabsContent value="options" className="bg-card rounded-lg border shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold arabic">طرق التوصيل</h2>
            <Button onClick={() => handleOpenOptionDialog()} className="flex items-center gap-2">
              <PlusCircle size={16} />
              <span className="arabic">إضافة طريقة توصيل</span>
            </Button>
          </div>
          
          {deliveryOptions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground arabic">
              لا توجد طرق توصيل. قم بإضافة طريقة توصيل جديدة.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deliveryOptions.map(option => (
                <div key={option.id} className={`border rounded-lg p-4 ${!option.isActive ? 'opacity-60' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Truck size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium arabic">{option.arabicName || option.name}</h3>
                        {option.arabicName && (
                          <p className="text-xs text-muted-foreground ltr">{option.name}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {!option.isActive && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full arabic mr-2">
                          غير نشط
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground arabic">السعر:</span>
                      <span className="font-medium ltr">{option.price.toFixed(2)} ريال</span>
                    </div>
                    
                    {option.estimatedDays && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground arabic">وقت التوصيل:</span>
                        <span className="font-medium arabic">{option.estimatedDays} يوم</span>
                      </div>
                    )}
                    
                    {option.description && (
                      <p className="text-sm text-muted-foreground arabic mt-2">{option.description}</p>
                    )}
                  </div>
                  
                  <div className="mt-4 flex justify-end space-x-2 rtl:space-x-reverse">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOpenOptionDialog(option)}
                    >
                      <Pencil size={14} className="mr-1" />
                      <span className="arabic">تعديل</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        setSelectedOption(option);
                        setIsOptionDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 size={14} className="mr-1" />
                      <span className="arabic">حذف</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Delivery Zones Tab */}
        <TabsContent value="zones" className="bg-card rounded-lg border shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold arabic">مناطق التوصيل</h2>
            <Button onClick={() => handleOpenZoneDialog()} className="flex items-center gap-2">
              <PlusCircle size={16} />
              <span className="arabic">إضافة منطقة توصيل</span>
            </Button>
          </div>
          
          {deliveryZones.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground arabic">
              لا توجد مناطق توصيل. قم بإضافة منطقة توصيل جديدة.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deliveryZones.map(zone => (
                <div key={zone.id} className={`border rounded-lg p-4 ${!zone.isActive ? 'opacity-60' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium arabic">{zone.arabicName || zone.name}</h3>
                        {zone.arabicName && (
                          <p className="text-xs text-muted-foreground ltr">{zone.name}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {!zone.isActive && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full arabic mr-2">
                          غير نشط
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground arabic">الرسوم الإضافية:</span>
                      <span className="font-medium ltr">{zone.additionalFee.toFixed(2)} ريال</span>
                    </div>
                    
                    <div className="mt-2">
                      <h4 className="text-sm text-muted-foreground arabic mb-1">المدن:</h4>
                      <div className="flex flex-wrap gap-1">
                        {zone.cities.map((city, index) => (
                          <span 
                            key={index} 
                            className="text-xs bg-muted px-2 py-1 rounded-full arabic"
                          >
                            {city}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end space-x-2 rtl:space-x-reverse">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOpenZoneDialog(zone)}
                    >
                      <Pencil size={14} className="mr-1" />
                      <span className="arabic">تعديل</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        setSelectedZone(zone);
                        setIsZoneDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 size={14} className="mr-1" />
                      <span className="arabic">حذف</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Delivery Option Dialog */}
      <Dialog open={isOptionDialogOpen} onOpenChange={setIsOptionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="arabic">
              {selectedOption ? 'تعديل طريقة التوصيل' : 'إضافة طريقة توصيل جديدة'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleOptionSubmit}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="ltr">English Name</Label>
                  <Input
                    id="name"
                    value={optionFormData.name}
                    onChange={(e) => setOptionFormData({...optionFormData, name: e.target.value})}
                    placeholder="Delivery option name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="arabicName" className="arabic">الاسم بالعربية</Label>
                  <Input
                    id="arabicName"
                    dir="rtl"
                    value={optionFormData.arabicName}
                    onChange={(e) => setOptionFormData({...optionFormData, arabicName: e.target.value})}
                    placeholder="اسم طريقة التوصيل"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="arabic">السعر</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={optionFormData.price}
                    onChange={(e) => setOptionFormData({...optionFormData, price: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="estimatedDays" className="arabic">وقت التوصيل (بالأيام)</Label>
                  <Input
                    id="estimatedDays"
                    value={optionFormData.estimatedDays}
                    onChange={(e) => setOptionFormData({...optionFormData, estimatedDays: e.target.value})}
                    placeholder="1-3"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="arabic">الوصف</Label>
                <Textarea
                  id="description"
                  dir="rtl"
                  value={optionFormData.description}
                  onChange={(e) => setOptionFormData({...optionFormData, description: e.target.value})}
                  placeholder="وصف طريقة التوصيل"
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="icon" className="arabic">أيقونة</Label>
                <Input
                  id="icon"
                  value={optionFormData.icon}
                  onChange={(e) => setOptionFormData({...optionFormData, icon: e.target.value})}
                  placeholder="truck"
                />
                <p className="text-xs text-muted-foreground ltr">
                  Icon name from Lucide icons (e.g. truck, zap, store)
                </p>
              </div>
              
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Switch
                  id="isActive"
                  checked={optionFormData.isActive}
                  onCheckedChange={(checked) => setOptionFormData({...optionFormData, isActive: checked})}
                />
                <Label htmlFor="isActive" className="arabic">نشط</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOptionDialogOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit">
                {selectedOption ? 'تحديث' : 'إضافة'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delivery Zone Dialog */}
      <Dialog open={isZoneDialogOpen} onOpenChange={setIsZoneDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="arabic">
              {selectedZone ? 'تعديل منطقة التوصيل' : 'إضافة منطقة توصيل جديدة'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleZoneSubmit}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zoneName" className="ltr">English Name</Label>
                  <Input
                    id="zoneName"
                    value={zoneFormData.name}
                    onChange={(e) => setZoneFormData({...zoneFormData, name: e.target.value})}
                    placeholder="Zone name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="zoneArabicName" className="arabic">الاسم بالعربية</Label>
                  <Input
                    id="zoneArabicName"
                    dir="rtl"
                    value={zoneFormData.arabicName}
                    onChange={(e) => setZoneFormData({...zoneFormData, arabicName: e.target.value})}
                    placeholder="اسم المنطقة"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="zoneCities" className="arabic">المدن (مفصولة بفواصل)</Label>
                <Textarea
                  id="zoneCities"
                  dir="rtl"
                  value={zoneFormData.cities}
                  onChange={(e) => setZoneFormData({...zoneFormData, cities: e.target.value})}
                  placeholder="الرياض، جدة، الدمام"
                  rows={2}
                />
                <p className="text-xs text-muted-foreground arabic">
                  أدخل أسماء المدن مفصولة بفواصل، مثل: الرياض، جدة، الدمام
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additionalFee" className="arabic">الرسوم الإضافية</Label>
                <Input
                  id="additionalFee"
                  type="number"
                  step="0.01"
                  min="0"
                  value={zoneFormData.additionalFee}
                  onChange={(e) => setZoneFormData({...zoneFormData, additionalFee: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Switch
                  id="zoneIsActive"
                  checked={zoneFormData.isActive}
                  onCheckedChange={(checked) => setZoneFormData({...zoneFormData, isActive: checked})}
                />
                <Label htmlFor="zoneIsActive" className="arabic">نشط</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsZoneDialogOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit">
                {selectedZone ? 'تحديث' : 'إضافة'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Option Confirmation */}
      <AlertDialog open={isOptionDeleteDialogOpen} onOpenChange={setIsOptionDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="arabic">حذف طريقة التوصيل</AlertDialogTitle>
            <AlertDialogDescription className="arabic">
              هل أنت متأكد من حذف طريقة التوصيل هذه؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="arabic">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground arabic"
              onClick={handleDeleteOption}
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete Zone Confirmation */}
      <AlertDialog open={isZoneDeleteDialogOpen} onOpenChange={setIsZoneDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="arabic">حذف منطقة التوصيل</AlertDialogTitle>
            <AlertDialogDescription className="arabic">
              هل أنت متأكد من حذف منطقة التوصيل هذه؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="arabic">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground arabic"
              onClick={handleDeleteZone}
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default DeliveryPage;
