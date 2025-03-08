
import React, { useState } from 'react';
import { Admin } from '@/contexts/AuthContext';
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
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface UserFormData {
  id: string;
  name: string;
  username: string;
  password: string;
  isSuperAdmin: boolean;
}

interface UserFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: UserFormData) => void;
  selectedUser: Admin | null;
}

const UserFormDialog: React.FC<UserFormDialogProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  selectedUser 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    id: '',
    name: '',
    username: '',
    password: '',
    isSuperAdmin: false
  });

  // Reset form when dialog opens/closes or selected user changes
  React.useEffect(() => {
    if (selectedUser) {
      setFormData({
        id: selectedUser.id,
        name: selectedUser.name,
        username: selectedUser.username,
        password: '',
        isSuperAdmin: selectedUser.isSuperAdmin
      });
    } else {
      setFormData({
        id: '',
        name: '',
        username: '',
        password: '',
        isSuperAdmin: false
      });
    }
  }, [selectedUser, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit">
              {selectedUser ? 'تحديث' : 'إضافة'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserFormDialog;
