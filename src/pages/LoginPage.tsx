
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import MainLayout from '@/components/layout/MainLayout';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
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
      const success = login(formData.email, formData.password);
      
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome back!"
        });
        navigate('/');
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-card rounded-lg shadow-md border p-6">
          <div className="text-center mb-6">
            <img 
              src="/lovable-uploads/f1704d88-b08e-4a51-90be-eaeb1edea8ca.png" 
              alt="زهرة النرجس" 
              className="h-24 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold arabic">تسجيل الدخول</h1>
            <p className="text-muted-foreground mt-2 arabic">أدخل بيانات حسابك للوصول</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="arabic">البريد الإلكتروني</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="example@example.com"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="arabic">كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>

            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground arabic">
                ليس لديك حساب؟{' '}
                <Link to="/register" className="text-primary font-medium hover:underline">
                  إنشاء حساب جديد
                </Link>
              </p>
              <Link to="/admin/login" className="text-sm text-primary font-medium hover:underline block mt-2 arabic">
                دخول المشرفين
              </Link>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default LoginPage;
