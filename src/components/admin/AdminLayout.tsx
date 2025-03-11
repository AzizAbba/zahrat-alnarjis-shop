
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  ClipboardList,
  Settings,
  LogOut,
  MessageSquare,
  Home,
  TruckIcon,
  FileText
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from '@/components/ui/use-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: 'تم تسجيل الخروج بنجاح'
    });
    navigate('/admin/login');
  };
  
  if (!user || !user.isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="arabic">غير مصرح بالدخول</p>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-red-50 border-r border-red-100 hidden md:flex md:flex-col">
        <div className="p-4">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/lovable-uploads/f1704d88-b08e-4a51-90be-eaeb1edea8ca.png" 
              alt="زهرة النرجس" 
              className="h-16" 
            />
          </div>
          <h2 className="text-xl font-bold text-red-700 arabic">لوحة التحكم</h2>
          <p className="text-sm text-red-600 arabic">مرحباً {user.name}</p>
        </div>
        
        <Separator className="bg-red-100" />
        
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          <NavLink to="/admin" end
            className={({ isActive }) => 
              `flex items-center gap-2 p-2 rounded-md ${
                isActive 
                  ? 'bg-red-600 text-white' 
                  : 'text-red-700 hover:bg-red-100'
              }`
            }
          >
            <LayoutDashboard size={18} />
            <span className="arabic">الرئيسية</span>
          </NavLink>
          
          <NavLink to="/admin/products"
            className={({ isActive }) => 
              `flex items-center gap-2 p-2 rounded-md ${
                isActive 
                  ? 'bg-red-600 text-white' 
                  : 'text-red-700 hover:bg-red-100'
              }`
            }
          >
            <ShoppingBag size={18} />
            <span className="arabic">المنتجات</span>
          </NavLink>
          
          <NavLink to="/admin/orders"
            className={({ isActive }) => 
              `flex items-center gap-2 p-2 rounded-md ${
                isActive 
                  ? 'bg-red-600 text-white' 
                  : 'text-red-700 hover:bg-red-100'
              }`
            }
          >
            <ClipboardList size={18} />
            <span className="arabic">الطلبات</span>
          </NavLink>
          
          <NavLink to="/admin/messages"
            className={({ isActive }) => 
              `flex items-center gap-2 p-2 rounded-md ${
                isActive 
                  ? 'bg-red-600 text-white' 
                  : 'text-red-700 hover:bg-red-100'
              }`
            }
          >
            <MessageSquare size={18} />
            <span className="arabic">الرسائل</span>
          </NavLink>

          <NavLink to="/admin/delivery"
            className={({ isActive }) => 
              `flex items-center gap-2 p-2 rounded-md ${
                isActive 
                  ? 'bg-red-600 text-white' 
                  : 'text-red-700 hover:bg-red-100'
              }`
            }
          >
            <TruckIcon size={18} />
            <span className="arabic">الشحن والتوصيل</span>
          </NavLink>

          <NavLink to="/admin/subcategories"
            className={({ isActive }) => 
              `flex items-center gap-2 p-2 rounded-md ${
                isActive 
                  ? 'bg-red-600 text-white' 
                  : 'text-red-700 hover:bg-red-100'
              }`
            }
          >
            <FileText size={18} />
            <span className="arabic">التصنيفات الفرعية</span>
          </NavLink>
          
          {user.isSuperAdmin && (
            <NavLink to="/admin/users"
              className={({ isActive }) => 
                `flex items-center gap-2 p-2 rounded-md ${
                  isActive 
                    ? 'bg-red-600 text-white' 
                    : 'text-red-700 hover:bg-red-100'
                }`
              }
            >
              <Users size={18} />
              <span className="arabic">المستخدمين</span>
            </NavLink>
          )}
          
          <NavLink to="/admin/settings"
            className={({ isActive }) => 
              `flex items-center gap-2 p-2 rounded-md ${
                isActive 
                  ? 'bg-red-600 text-white' 
                  : 'text-red-700 hover:bg-red-100'
              }`
            }
          >
            <Settings size={18} />
            <span className="arabic">الإعدادات</span>
          </NavLink>
        </nav>
        
        <div className="p-4 border-t border-red-100">
          <div className="flex gap-2 mb-3">
            <Button 
              variant="yellow"
              className="w-1/2 flex items-center gap-2"
              onClick={() => navigate('/')}
            >
              <Home size={16} />
              <span className="arabic">المتجر</span>
            </Button>
            
            <Button 
              variant="outline"
              className="w-1/2 flex items-center gap-2 border-red-200 text-red-700"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span className="arabic">خروج</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-red-50 border-b border-red-100 p-3 z-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/f1704d88-b08e-4a51-90be-eaeb1edea8ca.png" 
              alt="زهرة النرجس" 
              className="h-8 mr-2" 
            />
            <h2 className="text-lg font-bold text-red-700 arabic">لوحة التحكم</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-1 text-red-700"
              onClick={() => navigate('/')}
            >
              <Home className="h-4 w-4" />
              <span className="text-xs">المتجر</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="arabic">الحساب</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/')} className="arabic cursor-pointer">
                  <Home className="mr-2 h-4 w-4" />
                  زيارة المتجر
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="arabic cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="flex overflow-x-auto space-x-2 py-2 -mx-3 px-3">
          <NavLink to="/admin" end
            className={({ isActive }) => 
              `flex items-center gap-1 p-2 rounded-md whitespace-nowrap text-xs ${
                isActive 
                  ? 'bg-red-600 text-white' 
                  : 'text-red-700 bg-red-100/50'
              }`
            }
          >
            <LayoutDashboard size={14} />
            <span className="arabic">الرئيسية</span>
          </NavLink>
          
          <NavLink to="/admin/products"
            className={({ isActive }) => 
              `flex items-center gap-1 p-2 rounded-md whitespace-nowrap text-xs ${
                isActive 
                  ? 'bg-red-600 text-white' 
                  : 'text-red-700 bg-red-100/50'
              }`
            }
          >
            <ShoppingBag size={14} />
            <span className="arabic">المنتجات</span>
          </NavLink>
          
          <NavLink to="/admin/orders"
            className={({ isActive }) => 
              `flex items-center gap-1 p-2 rounded-md whitespace-nowrap text-xs ${
                isActive 
                  ? 'bg-red-600 text-white' 
                  : 'text-red-700 bg-red-100/50'
              }`
            }
          >
            <ClipboardList size={14} />
            <span className="arabic">الطلبات</span>
          </NavLink>
          
          <NavLink to="/admin/messages"
            className={({ isActive }) => 
              `flex items-center gap-1 p-2 rounded-md whitespace-nowrap text-xs ${
                isActive 
                  ? 'bg-red-600 text-white' 
                  : 'text-red-700 bg-red-100/50'
              }`
            }
          >
            <MessageSquare size={14} />
            <span className="arabic">الرسائل</span>
          </NavLink>
          
          <NavLink to="/admin/delivery"
            className={({ isActive }) => 
              `flex items-center gap-1 p-2 rounded-md whitespace-nowrap text-xs ${
                isActive 
                  ? 'bg-red-600 text-white' 
                  : 'text-red-700 bg-red-100/50'
              }`
            }
          >
            <TruckIcon size={14} />
            <span className="arabic">الشحن</span>
          </NavLink>
          
          {user.isSuperAdmin && (
            <NavLink to="/admin/users"
              className={({ isActive }) => 
                `flex items-center gap-1 p-2 rounded-md whitespace-nowrap text-xs ${
                  isActive 
                    ? 'bg-red-600 text-white' 
                    : 'text-red-700 bg-red-100/50'
                }`
              }
            >
              <Users size={14} />
              <span className="arabic">المستخدمين</span>
            </NavLink>
          )}
          
          <NavLink to="/admin/settings"
            className={({ isActive }) => 
              `flex items-center gap-1 p-2 rounded-md whitespace-nowrap text-xs ${
                isActive 
                  ? 'bg-red-600 text-white' 
                  : 'text-red-700 bg-red-100/50'
              }`
            }
          >
            <Settings size={14} />
            <span className="arabic">الإعدادات</span>
          </NavLink>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <main className="p-6 md:p-8 md:pt-6 pt-24">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
