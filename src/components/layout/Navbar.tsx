
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  onSearch?: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
    // Navigate to products page with search query
    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and brand name */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/f1704d88-b08e-4a51-90be-eaeb1edea8ca.png" 
                alt="زهرة النرجس" 
                className="h-10 mr-2" 
              />
              <span className="text-2xl font-bold text-brand-600 arabic">منظفات زهر النرجس</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 items-center">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/products" className="nav-link">
              Products
            </Link>
            <Link to="/about" className="nav-link">
              About Us
            </Link>
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
            {isAdmin && (
              <Link to="/admin" className="nav-link">
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Search bar - Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="w-full relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10"
              />
              <Button 
                type="submit" 
                variant="ghost" 
                size="icon"
                className="absolute right-0 top-0"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* User and Cart - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isAuthenticated ? (
                  <>
                    <DropdownMenuLabel>
                      <span className="font-medium">{user?.name}</span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/orders')}>
                      My Orders
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => navigate('/login')}>
                      Login
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/register')}>
                      Register
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/cart')}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/cart')}
              className="relative mr-2"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pb-3">
            {/* Search bar - Mobile */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10"
                />
                <Button 
                  type="submit" 
                  variant="ghost" 
                  size="icon"
                  className="absolute right-0 top-0"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Navigation links - Mobile */}
            <div className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className="py-2 px-3 rounded hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="py-2 px-3 rounded hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                to="/about" 
                className="py-2 px-3 rounded hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                to="/contact" 
                className="py-2 px-3 rounded hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="py-2 px-3 rounded hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
            </div>

            {/* User account links - Mobile */}
            <div className="mt-4 pt-4 border-t">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 font-medium">
                    {user?.name}
                  </div>
                  <Link 
                    to="/profile" 
                    className="block py-2 px-3 rounded hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link 
                    to="/orders" 
                    className="block py-2 px-3 rounded hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 px-3 rounded hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="block py-2 px-3 rounded hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="block py-2 px-3 rounded hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
