
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingCart, ArrowLeft, Star, Heart, Share2, Truck, Clock, Tag } from 'lucide-react';
import { useProducts } from '@/contexts/ProductContext';
import { useCart } from '@/contexts/CartContext';
import ProductCard from '@/components/products/ProductCard';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { products, categories, subcategories, sizes, colors, smells } = useProducts();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  // Find the product by ID
  const product = products.find(p => p.id === productId);
  
  // If product not found, redirect to products page
  if (!product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">
            The product you are looking for does not exist or has been removed.
          </p>
          <Button onClick={() => navigate('/products')}>
            View All Products
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  // Find the product's category and related attributes
  const category = categories.find(c => c.id === product.categoryId);
  const subcategory = subcategories.find(s => s.id === product.subcategoryId);
  const size = sizes.find(s => s.id === product.sizeId);
  const color = colors.find(c => c.id === product.colorId);
  const smell = smells.find(s => s.id === product.smellId);
  
  // Find related products (same category, excluding current product)
  const relatedProducts = products
    .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);
  
  // Quantity selector state
  const [quantity, setQuantity] = useState(1);
  
  // Increase quantity
  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };
  
  // Decrease quantity
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  // Add to cart handler
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb navigation */}
        <div className="flex items-center mb-8 text-sm">
          <Link to="/" className="text-gray-500 hover:text-narcissus-800">الرئيسية</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to="/products" className="text-gray-500 hover:text-narcissus-800">المنتجات</Link>
          {category && (
            <>
              <span className="mx-2 text-gray-400">/</span>
              <Link 
                to={`/products?category=${category.id}`} 
                className="text-gray-500 hover:text-narcissus-800"
              >
                {category.arabicName || category.name}
              </Link>
            </>
          )}
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-narcissus-700 font-medium">{product.arabicName || product.name}</span>
        </div>
        
        {/* Back button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-narcissus-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          رجوع
        </Button>
        
        {/* Product detail */}
        <div className="grid md:grid-cols-2 gap-10 mb-12">
          {/* Product image */}
          <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-narcissus-100">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-auto object-cover aspect-square"
            />
            <div className="flex justify-end p-4 gap-2">
              <Button variant="outline" size="icon" className="rounded-full hover:bg-narcissus-50 hover:text-narcissus-700">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full hover:bg-narcissus-50 hover:text-narcissus-700">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Product info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 ltr">{product.name}</h1>
              {product.arabicName && (
                <h2 className="text-2xl text-gray-700 mb-4 arabic">{product.arabicName}</h2>
              )}
              
              <div className="flex items-center mb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className="h-5 w-5 fill-narcissus-400 text-narcissus-400" 
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">(12 تقييم)</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-narcissus-700">{product.price.toFixed(2)} ريال</span>
              
              <div className="py-1 px-3 bg-narcissus-50 rounded-full text-sm text-narcissus-700 flex items-center">
                {product.stock > 0 ? (
                  <>
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                    متوفر في المخزون ({product.stock})
                  </>
                ) : (
                  <>
                    <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1"></span>
                    غير متوفر
                  </>
                )}
              </div>
            </div>
            
            <Separator className="bg-narcissus-100" />
            
            <div>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
            
            <div className="space-y-4">
              {category && (
                <div className="flex items-center">
                  <span className="text-gray-500 w-24 arabic">التصنيف:</span>
                  <Link 
                    to={`/products?category=${category.id}`}
                    className="text-narcissus-600 hover:underline"
                  >
                    {category.arabicName || category.name}
                  </Link>
                </div>
              )}
              
              {subcategory && (
                <div className="flex items-center">
                  <span className="text-gray-500 w-24 arabic">التصنيف الفرعي:</span>
                  <span>{subcategory.arabicName || subcategory.name}</span>
                </div>
              )}
              
              {size && (
                <div className="flex items-center">
                  <span className="text-gray-500 w-24 arabic">الحجم:</span>
                  <span className="bg-narcissus-50 px-3 py-1 rounded-full text-sm">
                    {size.arabicName || size.name} ({size.value})
                  </span>
                </div>
              )}
              
              {color && (
                <div className="flex items-center">
                  <span className="text-gray-500 w-24 arabic">اللون:</span>
                  <div className="flex items-center">
                    <span 
                      className="w-5 h-5 rounded-full mr-2" 
                      style={{ backgroundColor: color.hexCode }}
                    ></span>
                    <span>{color.arabicName || color.name}</span>
                  </div>
                </div>
              )}
              
              {smell && (
                <div className="flex items-center">
                  <span className="text-gray-500 w-24 arabic">الرائحة:</span>
                  <span>{smell.arabicName || smell.name}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center bg-narcissus-50 p-3 rounded-lg text-narcissus-700">
              <Truck className="h-5 w-5 mr-2" />
              <span className="arabic">شحن سريع لجميع المدن خلال 2-3 أيام عمل</span>
            </div>
            
            {/* Quantity selector */}
            <div className="flex items-center">
              <span className="text-gray-700 w-24 arabic">الكمية:</span>
              <div className="flex items-center border border-narcissus-200 rounded-md">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="h-10 px-3 hover:bg-narcissus-50 hover:text-narcissus-700"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                
                <span className="w-12 text-center">{quantity}</span>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                  className="h-10 px-3 hover:bg-narcissus-50 hover:text-narcissus-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Add to cart button */}
            <Button 
              size="lg" 
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="w-full bg-narcissus-600 hover:bg-narcissus-700 text-white"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              إضافة إلى السلة
            </Button>
          </div>
        </div>
        
        {/* Product details tabs */}
        <div className="mb-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="description" className="arabic">الوصف</TabsTrigger>
              <TabsTrigger value="specifications" className="arabic">المواصفات</TabsTrigger>
              <TabsTrigger value="reviews" className="arabic">التقييمات</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="bg-white p-6 rounded-lg border border-narcissus-100">
              <h3 className="text-xl font-bold mb-4 arabic">وصف المنتج</h3>
              <p className="text-gray-700 leading-relaxed mb-4">{product.description}</p>
              <p className="text-gray-700 leading-relaxed">
                جميع منتجاتنا مصنوعة من أفضل المواد وبجودة عالية لضمان رضا العملاء. نحن نفتخر بتقديم منتجات ذات جودة عالية وبأسعار منافسة.
              </p>
            </TabsContent>
            <TabsContent value="specifications" className="bg-white p-6 rounded-lg border border-narcissus-100">
              <h3 className="text-xl font-bold mb-4 arabic">مواصفات المنتج</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2 py-2 border-b border-gray-100">
                  <span className="text-gray-500 arabic">الاسم</span>
                  <span className="font-medium">{product.arabicName || product.name}</span>
                </div>
                {category && (
                  <div className="grid grid-cols-2 py-2 border-b border-gray-100">
                    <span className="text-gray-500 arabic">التصنيف</span>
                    <span className="font-medium">{category.arabicName || category.name}</span>
                  </div>
                )}
                {size && (
                  <div className="grid grid-cols-2 py-2 border-b border-gray-100">
                    <span className="text-gray-500 arabic">الحجم</span>
                    <span className="font-medium">{size.arabicName || size.name} ({size.value})</span>
                  </div>
                )}
                {color && (
                  <div className="grid grid-cols-2 py-2 border-b border-gray-100">
                    <span className="text-gray-500 arabic">اللون</span>
                    <div className="flex items-center">
                      <span 
                        className="w-4 h-4 rounded-full mr-2" 
                        style={{ backgroundColor: color.hexCode }}
                      ></span>
                      <span className="font-medium">{color.arabicName || color.name}</span>
                    </div>
                  </div>
                )}
                {smell && (
                  <div className="grid grid-cols-2 py-2 border-b border-gray-100">
                    <span className="text-gray-500 arabic">الرائحة</span>
                    <span className="font-medium">{smell.arabicName || smell.name}</span>
                  </div>
                )}
                <div className="grid grid-cols-2 py-2 border-b border-gray-100">
                  <span className="text-gray-500 arabic">السعر</span>
                  <span className="font-medium">{product.price.toFixed(2)} ريال</span>
                </div>
                <div className="grid grid-cols-2 py-2 border-b border-gray-100">
                  <span className="text-gray-500 arabic">المخزون</span>
                  <span className="font-medium">{product.stock} وحدة</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="bg-white p-6 rounded-lg border border-narcissus-100">
              <h3 className="text-xl font-bold mb-4 arabic">تقييمات المنتج</h3>
              <div className="text-center py-8">
                <Star className="h-12 w-12 mx-auto fill-narcissus-400 text-narcissus-400 mb-2" />
                <p className="text-lg mb-4 arabic">لا توجد تقييمات بعد</p>
                <p className="text-gray-500 mb-6 arabic">كن أول من يقيم هذا المنتج</p>
                <Button variant="outline" className="border-narcissus-200 hover:bg-narcissus-50 hover:text-narcissus-700">
                  إضافة تقييم
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-narcissus-100 pt-12">
            <h2 className="text-2xl font-bold mb-6 arabic">منتجات مشابهة</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ProductDetailPage;
