
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
  Home
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
      <div className="w-64 bg-sidebar-background text-sidebar-foreground border-r border-sidebar-border hidden md:flex md:flex-col">
        <div className="p-4">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/lovable-uploads/f1704d88-b08e-4a51-90be-eaeb1edea8ca.png" 
              alt="زهرة النرجس" 
              className="h-16" 
            />
          </div>
          <h2 className="text-xl font-bold text-sidebar-foreground arabic">لوحة التحكم</h2>
          <p className="text-sm text-sidebar-foreground/70 arabic">مرحباً {user.name}</p>
        </div>
        
        <Separator className="bg-sidebar-border" />
        
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          <NavLink to="/admin" end
            className={({ isActive }) => 
              `flex items-center gap-2 p-2 rounded-md ${
                isActive 
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
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
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
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
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
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
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              }`
            }
          >
            <MessageSquare size={18} />
            <span className="arabic">الرسائل</span>
          </NavLink>
          
          {user.isSuperAdmin && (
            <NavLink to="/admin/users"
              className={({ isActive }) => 
                `flex items-center gap-2 p-2 rounded-md ${
                  isActive 
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
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
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              }`
            }
          >
            <Settings size={18} />
            <span className="arabic">الإعدادات</span>
          </NavLink>
        </nav>
        
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex gap-2 mb-3">
            <Button 
              variant="outline" 
              className="w-1/2 flex items-center gap-2 bg-sidebar-accent"
              onClick={() => navigate('/')}
            >
              <Home size={16} />
              <span className="arabic">المتجر</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-1/2 flex items-center gap-2 bg-sidebar-accent"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span className="arabic">خروج</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-sidebar-background border-b border-sidebar-border p-3 z-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/f1704d88-b08e-4a51-90be-eaeb1edea8ca.png" 
              alt="زهرة النرجس" 
              className="h-8 mr-2" 
            />
            <h2 className="text-lg font-bold text-sidebar-foreground arabic">لوحة التحكم</h2>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="w-8 h-8 bg-narcissus-500 rounded-full flex items-center justify-center text-white font-bold">
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
        
        <div className="flex overflow-x-auto space-x-2 py-2 -mx-3 px-3">
          <NavLink to="/admin" end
            className={({ isActive }) => 
              `flex items-center gap-1 p-2 rounded-md whitespace-nowrap text-xs ${
                isActive 
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                  : 'text-sidebar-foreground bg-sidebar-accent/50'
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
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                  : 'text-sidebar-foreground bg-sidebar-accent/50'
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
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                  : 'text-sidebar-foreground bg-sidebar-accent/50'
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
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                  : 'text-sidebar-foreground bg-sidebar-accent/50'
              }`
            }
          >
            <MessageSquare size={14} />
            <span className="arabic">الرسائل</span>
          </NavLink>
          
          {user.isSuperAdmin && (
            <NavLink to="/admin/users"
              className={({ isActive }) => 
                `flex items-center gap-1 p-2 rounded-md whitespace-nowrap text-xs ${
                  isActive 
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                    : 'text-sidebar-foreground bg-sidebar-accent/50'
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
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                  : 'text-sidebar-foreground bg-sidebar-accent/50'
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
