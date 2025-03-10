
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/contexts/ProductContext';
import { Category } from '@/types/product';
import { ShoppingBag, Truck, ThumbsUp, Award, Star, ArrowRight, Heart, Sparkles } from 'lucide-react';

const HomePage: React.FC = () => {
  const { products, categories } = useProducts();
  const navigate = useNavigate();
  
  // Filter featured products
  const featuredProducts = products.filter(product => product.featured).slice(0, 4);
  
  // For the hero section - get a category with an image
  const heroCategory = categories.find(category => category.imageUrl) || categories[0];
  
  return (
    <MainLayout>
      {/* Hero section */}
      <section className="bg-gradient-to-r from-narcissus-700 to-narcissus-500 text-white py-16">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 arabic">
              منتجات تنظيف عالية الجودة لمنزلك
            </h1>
            <p className="text-lg opacity-90 mb-8 arabic">
              اكتشف مجموعتنا المتميزة من منتجات التنظيف التي تجعل التنظيف أسهل وأكثر فعالية.
            </p>
            <div className="flex space-x-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/products')}
                className="bg-white text-narcissus-700 hover:bg-gray-100 arabic"
              >
                تسوق الآن
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate('/about')}
                className="border-white text-white hover:bg-white hover:text-narcissus-700 arabic"
              >
                اقرأ المزيد
              </Button>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <img 
              src="https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
              alt="منتجات التنظيف" 
              className="w-full h-auto rounded-lg shadow-lg border-4 border-white/20"
            />
          </div>
        </div>
      </section>
      
      {/* Featured products section */}
      <section className="py-16 bg-narcissus-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block mb-2">
              <Sparkles className="h-10 w-10 text-narcissus-500" />
            </div>
            <h2 className="text-3xl font-bold mb-4 arabic">منتجات مميزة</h2>
            <p className="text-gray-600 max-w-2xl mx-auto arabic">
              منتجات التنظيف الأكثر شعبية وفعالية، مثالية لكل منزل.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button 
              size="lg" 
              onClick={() => navigate('/products')}
              className="bg-narcissus-600 hover:bg-narcissus-700 text-white arabic"
            >
              عرض جميع المنتجات
              <ArrowRight className="mr-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Learn More Improved Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 arabic">لماذا تختار منتجاتنا؟</h2>
            <p className="text-gray-600 max-w-2xl mx-auto arabic">
              منتجات زهرة النرجس هي الخيار الأمثل لتنظيف منزلك بكفاءة عالية وبطريقة آمنة للبيئة.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md border border-narcissus-100 hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-narcissus-100 text-narcissus-600 rounded-full mb-6">
                <ThumbsUp className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 arabic">جودة عالية</h3>
              <p className="text-gray-600 arabic">
                منتجاتنا مصنوعة من أفضل المواد عالية الجودة لضمان نتائج تنظيف ممتازة في كل مرة تستخدمها.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md border border-narcissus-100 hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-stem-100 text-stem-600 rounded-full mb-6">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 arabic">صديقة للبيئة</h3>
              <p className="text-gray-600 arabic">
                نحن نهتم بالبيئة، لذلك نستخدم مكونات قابلة للتحلل ونقلل من استخدام البلاستيك في تغليف منتجاتنا.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md border border-narcissus-100 hover:shadow-lg transition-shadow duration-300 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-narcissus-100 text-narcissus-600 rounded-full mb-6">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 arabic">فعالية مضمونة</h3>
              <p className="text-gray-600 arabic">
                تم اختبار جميع منتجاتنا بدقة لضمان أنها تزيل البقع والأوساخ العنيدة بكفاءة عالية.
              </p>
            </div>
          </div>
          
          <div className="mt-16 bg-narcissus-600 text-white rounded-xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-4 arabic">كيف تعمل منتجاتنا؟</h3>
                <p className="mb-6 arabic">
                  تعتمد منتجاتنا على تركيبات متطورة تستهدف البقع والأوساخ بشكل فعال مع الحفاظ على سلامة الأسطح والأنسجة.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="bg-white rounded-full p-1 mr-3">
                      <Star className="h-4 w-4 text-narcissus-600" />
                    </div>
                    <span className="arabic">تفكيك البقع العنيدة بسهولة</span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-white rounded-full p-1 mr-3">
                      <Star className="h-4 w-4 text-narcissus-600" />
                    </div>
                    <span className="arabic">تنظيف عميق للأسطح المختلفة</span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-white rounded-full p-1 mr-3">
                      <Star className="h-4 w-4 text-narcissus-600" />
                    </div>
                    <span className="arabic">روائح منعشة تدوم طويلاً</span>
                  </li>
                </ul>
                <Button 
                  className="mt-8 bg-white text-narcissus-700 hover:bg-narcissus-50 self-start arabic"
                  onClick={() => navigate('/about')}
                >
                  اقرأ المزيد
                  <ArrowRight className="mr-2 h-4 w-4" />
                </Button>
              </div>
              <div className="hidden md:block">
                <img 
                  src="https://images.pexels.com/photos/4239031/pexels-photo-4239031.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="كيف تعمل منتجاتنا" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 arabic">تصنيفات المنتجات</h2>
            <p className="text-gray-600 max-w-2xl mx-auto arabic">
              تصفح مجموعة منتجاتنا حسب التصنيف
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.slice(0, 6).map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 arabic">آراء عملائنا</h2>
            <p className="text-gray-600 max-w-2xl mx-auto arabic">
              اقرأ تجارب عملائنا السعداء مع منتجاتنا
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              name="أحمد علي"
              text="منظف الأرضيات رائع! لم تبدو البلاط الخاص بي نظيفاً ولامعاً بهذا الشكل من قبل."
            />
            <TestimonialCard 
              name="فاطمة حسن"
              text="لقد جربت العديد من منظفات المطبخ ولكن هذا المنتج هو الأفضل بلا شك في إزالة الدهون."
              featured
            />
            <TestimonialCard 
              name="محمد كريم"
              text="منتجات عالية الجودة مع سرعة في التوصيل. سأطلب منكم مرة أخرى بالتأكيد!"
            />
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section className="py-16 bg-narcissus-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4 arabic">مميزات التسوق معنا</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="mx-auto w-12 h-12 flex items-center justify-center bg-narcissus-100 text-narcissus-600 rounded-full mb-3">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-1 arabic">توصيل سريع</h3>
              <p className="text-sm text-gray-600 arabic">شحن سريع لجميع أنحاء المملكة</p>
            </div>
            
            <div className="p-4">
              <div className="mx-auto w-12 h-12 flex items-center justify-center bg-narcissus-100 text-narcissus-600 rounded-full mb-3">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-1 arabic">منتجات متنوعة</h3>
              <p className="text-sm text-gray-600 arabic">تشكيلة واسعة من منتجات التنظيف</p>
            </div>
            
            <div className="p-4">
              <div className="mx-auto w-12 h-12 flex items-center justify-center bg-narcissus-100 text-narcissus-600 rounded-full mb-3">
                <ThumbsUp className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-1 arabic">جودة مضمونة</h3>
              <p className="text-sm text-gray-600 arabic">منتجات عالية الجودة بضمان الرضا</p>
            </div>
            
            <div className="p-4">
              <div className="mx-auto w-12 h-12 flex items-center justify-center bg-narcissus-100 text-narcissus-600 rounded-full mb-3">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-1 arabic">خدمة ممتازة</h3>
              <p className="text-sm text-gray-600 arabic">دعم العملاء على مدار الساعة</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to action */}
      <section className="py-16 bg-narcissus-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 arabic">ابدأ التسوق اليوم</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto arabic">
            اكتشف منتجات التنظيف المتميزة واجعل منزلك يتألق بجهد أقل.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/products')}
            className="bg-white text-narcissus-700 hover:bg-gray-100 arabic"
          >
            تصفح المنتجات
            <ArrowRight className="mr-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </MainLayout>
  );
};

// Helper component for category cards
const CategoryCard: React.FC<{ category: Category }> = ({ category }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="group rounded-lg overflow-hidden shadow-md border border-narcissus-100 relative cursor-pointer"
      onClick={() => navigate(`/products?category=${category.id}`)}
    >
      <div className="aspect-video">
        <img 
          src={category.imageUrl || 'https://via.placeholder.com/600x400'} 
          alt={category.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
        <div>
          <h3 className="text-white text-xl font-bold arabic">
            {category.arabicName || category.name}
          </h3>
          <Button 
            variant="link" 
            className="text-narcissus-200 hover:text-white p-0 h-auto arabic"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/products?category=${category.id}`);
            }}
          >
            عرض المنتجات
            <ArrowRight className="mr-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Helper component for testimonials
const TestimonialCard: React.FC<{ 
  name: string; 
  text: string; 
  featured?: boolean 
}> = ({ name, text, featured }) => {
  return (
    <div className={`p-6 rounded-lg ${
      featured 
        ? 'bg-narcissus-50 border border-narcissus-200 shadow-md' 
        : 'bg-white border border-gray-200 shadow-sm'
    }`}>
      <div className="flex items-center space-x-2 mb-4">
        {[1, 2, 3, 4, 5].map(star => (
          <Star 
            key={star} 
            className="w-5 h-5 fill-narcissus-400 text-narcissus-400" 
          />
        ))}
      </div>
      <p className="text-gray-700 mb-4 arabic">{text}</p>
      <p className="font-medium arabic">{name}</p>
    </div>
  );
};

export default HomePage;
