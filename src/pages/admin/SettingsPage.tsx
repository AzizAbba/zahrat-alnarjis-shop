
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldAlert, RefreshCw, Database, PaintBucket, Key, FileDown, FileUp } from 'lucide-react';

const SettingsPage = () => {
  const { user } = useAuth();
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'زهرة النرجس',
    storeEmail: 'info@narcissus.com',
    storePhone: '+966 55 123 4567',
    currency: 'ريال',
    enableReviews: true,
    enableWishlist: true,
    maintenanceMode: false
  });
  
  const handleStoreSettingChange = (key: string, value: any) => {
    setStoreSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSaveSettings = () => {
    // In a real app, this would save to backend
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم حفظ التغييرات بنجاح",
    });
  };
  
  const handleExportData = () => {
    toast({
      title: "تم تصدير البيانات",
      description: "تم تصدير بيانات المتجر بنجاح",
    });
  };
  
  const handleImportData = () => {
    toast({
      title: "تم استيراد البيانات",
      description: "تم استيراد بيانات المتجر بنجاح",
    });
  };
  
  const handleClearCache = () => {
    toast({
      title: "تم مسح الذاكرة المؤقتة",
      description: "تم مسح الذاكرة المؤقتة بنجاح",
    });
  };
  
  if (!user?.isSuperAdmin) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <ShieldAlert className="w-12 h-12 text-narcissus-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 arabic">غير مصرح بالوصول</h2>
          <p className="text-gray-500 arabic">
            عذراً، هذه الصفحة متاحة فقط للمديرين الأساسيين
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6 arabic">إعدادات المتجر</h1>
      
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="mb-6">
          <TabsTrigger value="general" className="arabic">عام</TabsTrigger>
          <TabsTrigger value="appearance" className="arabic">المظهر</TabsTrigger>
          <TabsTrigger value="security" className="arabic">الأمان</TabsTrigger>
          <TabsTrigger value="backup" className="arabic">النسخ الاحتياطي</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="arabic">إعدادات المتجر العامة</CardTitle>
              <CardDescription className="arabic">
                إدارة إعدادات المتجر الأساسية
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="storeName" className="arabic">اسم المتجر</Label>
                  <Input
                    id="storeName"
                    value={storeSettings.storeName}
                    onChange={(e) => handleStoreSettingChange('storeName', e.target.value)}
                    dir="rtl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency" className="arabic">العملة</Label>
                  <Input
                    id="currency"
                    value={storeSettings.currency}
                    onChange={(e) => handleStoreSettingChange('currency', e.target.value)}
                    dir="rtl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="storeEmail" className="arabic">البريد الإلكتروني</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={storeSettings.storeEmail}
                    onChange={(e) => handleStoreSettingChange('storeEmail', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="storePhone" className="arabic">رقم الهاتف</Label>
                  <Input
                    id="storePhone"
                    value={storeSettings.storePhone}
                    onChange={(e) => handleStoreSettingChange('storePhone', e.target.value)}
                  />
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <h3 className="text-lg font-medium arabic mb-2">خيارات المتجر</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableReviews" className="arabic">تفعيل التقييمات</Label>
                    <p className="text-sm text-gray-500 arabic">السماح للعملاء بإضافة تقييمات للمنتجات</p>
                  </div>
                  <Switch
                    id="enableReviews"
                    checked={storeSettings.enableReviews}
                    onCheckedChange={(checked) => handleStoreSettingChange('enableReviews', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableWishlist" className="arabic">تفعيل قائمة الرغبات</Label>
                    <p className="text-sm text-gray-500 arabic">السماح للعملاء بإضافة منتجات إلى قائمة الرغبات</p>
                  </div>
                  <Switch
                    id="enableWishlist"
                    checked={storeSettings.enableWishlist}
                    onCheckedChange={(checked) => handleStoreSettingChange('enableWishlist', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenanceMode" className="arabic">وضع الصيانة</Label>
                    <p className="text-sm text-gray-500 arabic">تفعيل وضع الصيانة لإغلاق المتجر مؤقتاً</p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={storeSettings.maintenanceMode}
                    onCheckedChange={(checked) => handleStoreSettingChange('maintenanceMode', checked)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} className="ml-auto arabic">
                حفظ الإعدادات
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="arabic">إعدادات المظهر</CardTitle>
              <CardDescription className="arabic">
                تخصيص مظهر المتجر
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="arabic">الألوان الرئيسية</Label>
                <div className="flex flex-wrap gap-2">
                  <div className="bg-narcissus-500 w-10 h-10 rounded-full border"></div>
                  <div className="bg-narcissus-600 w-10 h-10 rounded-full border"></div>
                  <div className="bg-narcissus-700 w-10 h-10 rounded-full border"></div>
                  <div className="bg-stem-500 w-10 h-10 rounded-full border"></div>
                  <div className="bg-stem-600 w-10 h-10 rounded-full border"></div>
                  <div className="bg-stem-700 w-10 h-10 rounded-full border"></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="arabic">الشعار</Label>
                <div className="flex items-center space-x-4">
                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <img 
                      src="/lovable-uploads/f1704d88-b08e-4a51-90be-eaeb1edea8ca.png" 
                      alt="زهرة النرجس" 
                      className="h-16" 
                    />
                  </div>
                  <Button variant="outline">
                    <PaintBucket className="h-4 w-4 mr-2" />
                    <span className="arabic">تغيير الشعار</span>
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="arabic">الوضع المظلم</Label>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 arabic">تفعيل الوضع المظلم</p>
                  <Switch id="darkMode" defaultChecked={false} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} className="ml-auto arabic">
                حفظ الإعدادات
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="arabic">إعدادات الأمان</CardTitle>
              <CardDescription className="arabic">
                إدارة إعدادات الأمان والخصوصية
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="arabic">تغيير كلمة المرور</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input type="password" placeholder="كلمة المرور الحالية" dir="rtl" />
                  <Input type="password" placeholder="كلمة المرور الجديدة" dir="rtl" />
                </div>
              </div>
              
              <div className="space-y-2 mt-6">
                <Label className="arabic">API Keys</Label>
                <div className="p-4 bg-gray-50 rounded-lg border text-sm font-mono flex justify-between items-center">
                  <div className="truncate flex-1">sk_live_••••••••••••••••••••••••••••••</div>
                  <Button variant="ghost" size="icon">
                    <Key className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 arabic">مفتاح API للتكامل مع خدمات خارجية</p>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div>
                  <Label htmlFor="2fa" className="arabic">المصادقة الثنائية</Label>
                  <p className="text-sm text-gray-500 arabic">تفعيل المصادقة الثنائية لزيادة أمان الحساب</p>
                </div>
                <Switch id="2fa" defaultChecked={false} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} className="ml-auto arabic">
                حفظ الإعدادات
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle className="arabic">النسخ الاحتياطي واستعادة البيانات</CardTitle>
              <CardDescription className="arabic">
                إدارة النسخ الاحتياطي واستعادة بيانات المتجر
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium arabic">تصدير البيانات</h3>
                <p className="text-sm text-gray-500 arabic">
                  تصدير جميع بيانات المتجر كملف JSON لحفظها
                </p>
                <Button variant="outline" onClick={handleExportData} className="mt-2">
                  <FileDown className="h-4 w-4 mr-2" />
                  <span className="arabic">تصدير البيانات</span>
                </Button>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium arabic">استيراد البيانات</h3>
                <p className="text-sm text-gray-500 arabic">
                  استيراد بيانات المتجر من ملف JSON
                </p>
                <Button variant="outline" onClick={handleImportData} className="mt-2">
                  <FileUp className="h-4 w-4 mr-2" />
                  <span className="arabic">استيراد البيانات</span>
                </Button>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium arabic">مسح الذاكرة المؤقتة</h3>
                <p className="text-sm text-gray-500 arabic">
                  مسح الذاكرة المؤقتة للمتجر وإعادة تحميل البيانات
                </p>
                <Button variant="outline" onClick={handleClearCache} className="mt-2">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  <span className="arabic">مسح الذاكرة المؤقتة</span>
                </Button>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium arabic">معلومات النظام</h3>
                <div className="bg-gray-50 p-4 rounded-lg border space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 arabic">الإصدار:</span>
                    <span>1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 arabic">React:</span>
                    <span>18.3.1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 arabic">نوع قاعدة البيانات:</span>
                    <div className="flex items-center">
                      <Database className="h-3 w-3 mr-1" />
                      <span>Local Storage</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default SettingsPage;
