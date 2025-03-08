
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Admin } from '@/contexts/AuthContext';

interface UserTableProps {
  adminUsers: Admin[];
  onEdit: (user: Admin) => void;
  onDelete: (user: Admin) => void;
}

const UserTable: React.FC<UserTableProps> = ({ adminUsers, onEdit, onDelete }) => {
  return (
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
                      onClick={() => onEdit(admin)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onDelete(admin)}
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
  );
};

export default UserTable;
