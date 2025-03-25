
import React, { useState, useEffect, useRef } from 'react';
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
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ShieldAlert, RefreshCw, Key, FileDown, FileUp, Lock, Globe } from 'lucide-react';
import { useContent } from '@/components/layout/MainLayout';

const SettingsPage = () => {
  const { user } = useAuth();
  const { siteContent } = useContent();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [storeSettings, setStoreSettings] = useState({
    storeName: localStorage.getItem('storeName') || 'زهرة النرجس',
    storeEmail: localStorage.getItem('storeEmail') || 'info@narcissus.com',
    storePhone: localStorage.getItem('storePhone') || '+966 55 123 4567',
    currency: localStorage.getItem('currency') || 'ريال',
    enableReviews: localStorage.getItem('enableReviews') === 'true',
    enableWishlist: localStorage.getItem('enableWishlist') === 'true',
    maintenanceMode: localStorage.getItem('maintenanceMode') === 'true',
    enforceStrongPasswords: localStorage.getItem('enforceStrongPasswords') === 'true',
    twoFactorAuth: localStorage.getItem('twoFactorAuth') === 'true',
    autoLogout: localStorage.getItem('autoLogout') === 'true',
    allowPublicRegistration: localStorage.getItem('allowPublicRegistration') === 'true',
    maxLoginAttempts: parseInt(localStorage.getItem('maxLoginAttempts') || '5'),
    sessionTimeout: parseInt(localStorage.getItem('sessionTimeout') || '30'),
  });
  
  const handleStoreSettingChange = (key: string, value: any) => {
    setStoreSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      localStorage.setItem(key, value.toString());
      return newSettings;
    });
  };
  
  const handleSaveSettings = () => {
    Object.entries(storeSettings).forEach(([key, value]) => {
      localStorage.setItem(key, value.toString());
    });
    toast.success('تم حفظ الإعدادات بنجاح');
  };
  
  const handleExportData = () => {
    const data = {
      settings: storeSettings,
      content: siteContent
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `narcissus-backup-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('تم تصدير البيانات بنجاح');
  };
  
  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.settings) {
            Object.entries(data.settings).forEach(([key, value]) => {
              localStorage.setItem(key, value!.toString());
            });
            setStoreSettings(data.settings);
          }
          toast.success('تم استيراد البيانات بنجاح');
        } catch (error) {
          toast.error('حدث خطأ أثناء استيراد البيانات');
        }
      };
      reader.readAsText(file);
    }
  };
  
  const handleClearCache = () => {
    localStorage.clear();
    toast.success('تم مسح الذاكرة المؤقتة بنجاح');
    window.location.reload();
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 arabic">إعدادات المتجر</h1>
        
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="mb-6">
            <TabsTrigger value="general" className="arabic">عام</TabsTrigger>
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
                      className="arabic"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="arabic">العملة</Label>
                    <Input
                      id="currency"
                      value={storeSettings.currency}
                      onChange={(e) => handleStoreSettingChange('currency', e.target.value)}
                      className="arabic"
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
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 arabic">
                  <Lock className="h-5 w-5" />
                  إعدادات الأمان
                </CardTitle>
                <CardDescription className="arabic">
                  تكوين إعدادات الأمان والخصوصية
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enforceStrongPasswords" className="arabic">تطبيق كلمات المرور القوية</Label>
                      <p className="text-sm text-gray-500 arabic">يتطلب كلمات مرور معقدة للحسابات الجديدة</p>
                    </div>
                    <Switch
                      id="enforceStrongPasswords"
                      checked={storeSettings.enforceStrongPasswords}
                      onCheckedChange={(checked) => handleStoreSettingChange('enforceStrongPasswords', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="twoFactorAuth" className="arabic">المصادقة الثنائية</Label>
                      <p className="text-sm text-gray-500 arabic">تفعيل المصادقة الثنائية للمستخدمين</p>
                    </div>
                    <Switch
                      id="twoFactorAuth"
                      checked={storeSettings.twoFactorAuth}
                      onCheckedChange={(checked) => handleStoreSettingChange('twoFactorAuth', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoLogout" className="arabic">تسجيل الخروج التلقائي</Label>
                      <p className="text-sm text-gray-500 arabic">تسجيل خروج المستخدمين تلقائياً بعد فترة من عدم النشاط</p>
                    </div>
                    <Switch
                      id="autoLogout"
                      checked={storeSettings.autoLogout}
                      onCheckedChange={(checked) => handleStoreSettingChange('autoLogout', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allowPublicRegistration" className="arabic">السماح بالتسجيل العام</Label>
                      <p className="text-sm text-gray-500 arabic">السماح للزوار بإنشاء حسابات جديدة</p>
                    </div>
                    <Switch
                      id="allowPublicRegistration"
                      checked={storeSettings.allowPublicRegistration}
                      onCheckedChange={(checked) => handleStoreSettingChange('allowPublicRegistration', checked)}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts" className="arabic">الحد الأقصى لمحاولات تسجيل الدخول</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={storeSettings.maxLoginAttempts}
                      onChange={(e) => handleStoreSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                      min={1}
                      max={10}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout" className="arabic">مدة الجلسة (بالدقائق)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={storeSettings.sessionTimeout}
                      onChange={(e) => handleStoreSettingChange('sessionTimeout', parseInt(e.target.value))}
                      min={5}
                      max={120}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings} className="ml-auto arabic">
                  حفظ إعدادات الأمان
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
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium arabic">تصدير البيانات</h3>
                    <p className="text-sm text-gray-500 arabic">
                      تصدير جميع بيانات المتجر كملف JSON لحفظها
                    </p>
                    <Button variant="outline" onClick={handleExportData}>
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
                    <div className="flex gap-2">
                      <Input
                        type="file"
                        accept=".json"
                        onChange={handleImportData}
                        className="arabic"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                      />
                      <Button variant="outline" onClick={triggerFileInput}>
                        <FileUp className="h-4 w-4 mr-2" />
                        <span className="arabic">اختيار ملف</span>
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium arabic">مسح الذاكرة المؤقتة</h3>
                    <p className="text-sm text-gray-500 arabic">
                      مسح الذاكرة المؤقتة للمتجر وإعادة تحميل البيانات
                    </p>
                    <Button variant="outline" onClick={handleClearCache}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      <span className="arabic">مسح الذاكرة المؤقتة</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
