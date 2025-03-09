
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Eye, EyeOff } from 'lucide-react';

const AdminLoginPage = () => {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Updated to match expected parameters
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg border">
        <div className="text-center">
          <img 
            src="/lovable-uploads/f1704d88-b08e-4a51-90be-eaeb1edea8ca.png" 
            alt="زهرة النرجس" 
            className="h-24 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold tracking-tight arabic">
            منظفات زهر النرجس
          </h1>
          <p className="text-muted-foreground mt-2 arabic">
            تسجيل الدخول إلى لوحة التحكم
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="space-y-1">
              <label htmlFor="username" className="block text-sm font-medium arabic">
                اسم المستخدم
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="dir-ltr"
                autoComplete="username"
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium arabic">
                كلمة المرور
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="dir-ltr"
                  autoComplete="current-password"
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
            className="w-full"
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
