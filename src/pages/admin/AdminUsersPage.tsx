import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { PlusCircle, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
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

const AdminUsersPage = () => {
  const { user, adminUsers, updateAdmin, deleteAdmin, addAdmin } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    username: '',
    password: '',
    isSuperAdmin: false
  });
  
  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      username: '',
      password: '',
      isSuperAdmin: false
    });
    setSelectedUser(null);
  };
  
  const handleOpenDialog = (user: any = null) => {
    if (user) {
      setFormData({
        id: user.id,
        name: user.name,
        username: user.username,
        password: '',
        isSuperAdmin: user.isSuperAdmin
      });
      setSelectedUser(user);
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
    if (!formData.name || !formData.username || (!selectedUser && !formData.password)) {
      toast.error('جميع الحقول مطلوبة');
      return;
    }
    
    try {
      if (selectedUser) {
        // Update existing admin
        updateAdmin({
          ...selectedUser,
          name: formData.name,
          username: formData.username,
          password: formData.password || selectedUser.password,
          isSuperAdmin: formData.isSuperAdmin
        });
        toast.success('تم تحديث المستخدم بنجاح');
      } else {
        // Add new admin using the object format to match our updated function
        addAdmin({
          id: Date.now().toString(),
          name: formData.name,
          username: formData.username,
          password: formData.password,
          isSuperAdmin: formData.isSuperAdmin,
          isAdmin: true,
          role: formData.isSuperAdmin ? 'superadmin' : 'admin'
        });
        toast.success('تم إضافة المستخدم بنجاح');
      }
      
      handleCloseDialog();
    } catch (error) {
      toast.error('حدث خطأ أثناء حفظ المستخدم');
    }
  };
  
  const handleDeleteUser = () => {
    if (selectedUser) {
      if (selectedUser.id === user?.id) {
        toast.error('لا يمكنك حذف حسابك الحالي');
        return;
      }
      
      deleteAdmin(selectedUser.id);
      toast.success('تم حذف المستخدم بنجاح');
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };
  
  if (!user?.isSuperAdmin) {
    return (
      <AdminLayout>
        <div className="text-center p-12">
          <h1 className="text-2xl font-bold arabic">غير مصرح بالوصول</h1>
          <p className="text-muted-foreground arabic mt-2">
            لا تملك صلاحيات كافية للوصول إلى هذه الصفحة
          </p>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold arabic">إدارة المستخدمين</h1>
        <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2">
          <PlusCircle size={16} />
          <span className="arabic">إضافة مستخدم</span>
        </Button>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-right">
                <th className="p-3 font-medium arabic">الاسم</th>
                <th className="p-3 font-medium arabic">اسم المستخدم</th>
                <th className="p-3 font-medium arabic">كلمة المرور</th>
                <th className="p-3 font-medium arabic">النوع</th>
                <th className="p-3 font-medium arabic">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {adminUsers.map((admin) => (
                <tr key={admin.id} className="border-b text-right">
                  <td className="p-3 arabic">{admin.name}</td>
                  <td className="p-3 ltr">{admin.username}</td>
                  <td className="p-3 ltr">
                    <span className="font-mono">••••••••</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      admin.isSuperAdmin 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    } arabic`}>
                      {admin.isSuperAdmin ? 'مدير أساسي' : 'مدير'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleOpenDialog(admin)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setSelectedUser(admin);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {adminUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground arabic">
                    لا يوجد مستخدمين
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
              {selectedUser ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="arabic">الاسم</Label>
                <Input
                  id="name"
                  dir="rtl"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="أدخل الاسم"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username" className="arabic">اسم المستخدم</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  placeholder="أدخل اسم المستخدم"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="arabic">
                  {selectedUser ? 'كلمة المرور (اترك فارغاً للإبقاء على كلمة المرور الحالية)' : 'كلمة المرور'}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder={selectedUser ? 'اترك فارغاً للإبقاء على كلمة المرور الحالية' : 'أدخل كلمة المرور'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isSuperAdmin"
                  checked={formData.isSuperAdmin}
                  onCheckedChange={(checked) => 
                    setFormData({...formData, isSuperAdmin: checked as boolean})
                  }
                />
                <Label htmlFor="isSuperAdmin" className="arabic mr-2">مدير أساسي</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                إلغاء
              </Button>
              <Button type="submit">
                {selectedUser ? 'تحديث' : 'إضافة'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="arabic">حذف المستخدم</AlertDialogTitle>
            <AlertDialogDescription className="arabic">
              هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="arabic">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground arabic"
              onClick={handleDeleteUser}
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminUsersPage;
