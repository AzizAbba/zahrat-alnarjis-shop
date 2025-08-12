
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Eye, EyeOff, Lock, User } from 'lucide-react';

const AdminLoginPage = () => {
  const { adminLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = adminLogin(formData.username, formData.password);
      
      if (success) {
        toast({
          title: "Login successful",
          description: 'تم تسجيل الدخول بنجاح'
        });
        navigate('/admin');
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Login failed",
        description: 'حدث خطأ أثناء تسجيل الدخول',
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-stem-50 to-narcissus-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg border animate-fadeIn">
        <div className="text-center">
          <img 
            src="lovable-uploads/f1704d88-b08e-4a51-90be-eaeb1edea8ca.png" 
            alt="زهرة النرجس" 
            className="h-24 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold tracking-tight arabic text-narcissus-800">
            منظفات زهر النرجس
          </h1>
          <p className="text-muted-foreground mt-2 arabic">
            تسجيل الدخول إلى لوحة التحكم
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="username" className="block text-sm font-medium arabic">
                اسم المستخدم
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                </div>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="pl-10 dir-ltr"
                  autoComplete="username"
                  placeholder="Admin username"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium arabic">
                كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 dir-ltr"
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-narcissus-600 hover:bg-narcissus-700"
            disabled={isLoading}
          >
            {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
