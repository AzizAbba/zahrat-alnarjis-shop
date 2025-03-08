
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import UserTable from '@/components/admin/users/UserTable';
import UserFormDialog from '@/components/admin/users/UserFormDialog';
import DeleteConfirmationDialog from '@/components/admin/users/DeleteConfirmationDialog';
import { Admin } from '@/contexts/AuthContext';

const AdminUsersPage = () => {
  const { user, adminUsers, updateAdmin, deleteAdmin, addAdmin } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Admin | null>(null);
  
  const handleOpenDialog = (user: Admin | null = null) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedUser(null);
  };
  
  const handleSubmit = (formData: any) => {
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
        // Add new admin
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
  
  const handleDeleteClick = (user: Admin) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
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
      
      <UserTable 
        adminUsers={adminUsers}
        onEdit={handleOpenDialog}
        onDelete={handleDeleteClick}
      />
      
      <UserFormDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        selectedUser={selectedUser}
      />
      
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteUser}
      />
    </AdminLayout>
  );
};

export default AdminUsersPage;
