
import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const isMobile = useMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    if (!isMobile && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isMobile, isMenuOpen]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      if (isMenuOpen) setIsMenuOpen(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container mx-auto">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="mr-2">
              <img 
                src="/lovable-uploads/f1704d88-b08e-4a51-90be-eaeb1edea8ca.png" 
                alt="زهرة النرجس" 
                className="h-10" 
              />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink to="/" className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }>
              الرئيسية
            </NavLink>
            <NavLink to="/products" className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }>
              المنتجات
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }>
              عن المتجر
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }>
              اتصل بنا
            </NavLink>
          </nav>
          
          {/* Desktop Search and User Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder="ابحث عن منتج..."
                className="w-48 pl-8 rtl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            </form>
            
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-2">
                {user.isAdmin && (
                  <Button variant="ghost" size="sm" onClick={() => navigate('/admin')} className="text-xs">
                    لوحة التحكم
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-xs">
                  تسجيل الخروج
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => navigate('/login')}>
                <User className="h-5 w-5" />
              </Button>
            )}
          </div>
          
          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white pt-16">
          <div className="container mx-auto px-4 py-6 space-y-6">
            <form onSubmit={handleSearch} className="relative mb-6">
              <Input
                type="search"
                placeholder="ابحث عن منتج..."
                className="w-full pl-8 rtl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Button type="submit" className="absolute right-1 top-1 h-8" size="sm">
                بحث
              </Button>
            </form>
            
            <nav className="flex flex-col space-y-2">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `py-3 px-4 rounded-md ${isActive ? 'bg-red-100 text-red-800' : 'hover:bg-gray-100'}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                الرئيسية
              </NavLink>
              <NavLink 
                to="/products" 
                className={({ isActive }) => 
                  `py-3 px-4 rounded-md ${isActive ? 'bg-red-100 text-red-800' : 'hover:bg-gray-100'}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                المنتجات
              </NavLink>
              <NavLink 
                to="/about" 
                className={({ isActive }) => 
                  `py-3 px-4 rounded-md ${isActive ? 'bg-red-100 text-red-800' : 'hover:bg-gray-100'}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                عن المتجر
              </NavLink>
              <NavLink 
                to="/contact" 
                className={({ isActive }) => 
                  `py-3 px-4 rounded-md ${isActive ? 'bg-red-100 text-red-800' : 'hover:bg-gray-100'}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                اتصل بنا
              </NavLink>
            </nav>
            
            <div className="border-t border-gray-200 pt-4">
              {user ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">مرحباً، {user.name}</p>
                  {user.isAdmin && (
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {
                        navigate('/admin');
                        setIsMenuOpen(false);
                      }}
                    >
                      لوحة التحكم
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-600 border-red-200"
                    onClick={handleLogout}
                  >
                    تسجيل الخروج
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      navigate('/login');
                      setIsMenuOpen(false);
                    }}
                  >
                    تسجيل الدخول
                  </Button>
                  <Button 
                    className="w-full"
                    onClick={() => {
                      navigate('/register');
                      setIsMenuOpen(false);
                    }}
                  >
                    إنشاء حساب
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
