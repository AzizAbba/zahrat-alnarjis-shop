import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ShoppingBag, Users, Settings, Layout } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-6 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-gray-800 arabic">
            لوحة التحكم
          </Link>
          <button
            className="text-gray-500 focus:outline-none focus:text-gray-700"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? 'إخفاء القائمة' : 'إظهار القائمة'}
          </button>
        </div>
      </nav>
      
      <div className="flex">
        <aside className="w-64 bg-white shadow-sm h-screen">
          <div className="p-4">
            <nav className="space-y-2">
              <Link
                to="/admin"
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
              >
                <Home className="w-5 h-5" />
                <span className="arabic">الرئيسية</span>
              </Link>
              <Link
                to="/admin/products"
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="arabic">المنتجات</span>
              </Link>
              <Link
                to="/admin/users"
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
              >
                <Users className="w-5 h-5" />
                <span className="arabic">المستخدمين</span>
              </Link>
              <Link
                to="/admin/settings"
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
              >
                <Settings className="w-5 h-5" />
                <span className="arabic">الإعدادات</span>
              </Link>
              <Link
                to="/admin/site-content"
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
              >
                <Layout className="w-5 h-5" />
                <span className="arabic">إدارة المحتوى</span>
              </Link>
            </nav>
          </div>
        </aside>
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
