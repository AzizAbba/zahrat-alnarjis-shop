
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/contexts/ProductContext';
import { Category } from '@/types/product';

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
      <section className="bg-gradient-to-r from-brand-700 to-brand-500 text-white py-16">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Quality Cleaning Products for Your Home
            </h1>
            <p className="text-lg opacity-90 mb-8">
              Discover our premium range of cleaning solutions that make cleaning easier and more effective.
            </p>
            <div className="flex space-x-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/products')}
                className="bg-white text-brand-700 hover:bg-gray-100"
              >
                Shop Now
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate('/about')}
                className="border-white text-white hover:bg-white hover:text-brand-700"
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <img 
              src="https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
              alt="Cleaning products" 
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>
      
      {/* Featured products section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our most popular and effective cleaning solutions, perfect for every home.
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
            >
              View All Products
            </Button>
          </div>
        </div>
      </section>
      
      {/* Categories section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Product Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our range of cleaning products by category.
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
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Read testimonials from our satisfied customers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              name="Ahmed Ali"
              text="The floor cleaner is amazing! My tiles have never looked so clean and shiny."
            />
            <TestimonialCard 
              name="Fatima Hassan"
              text="I've tried many kitchen cleaners but this one is by far the best at removing grease."
              featured
            />
            <TestimonialCard 
              name="Mohammed Karim"
              text="Great quality products with quick delivery. Will definitely order again!"
            />
          </div>
        </div>
      </section>
      
      {/* Call to action */}
      <section className="py-16 bg-brand-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Shopping Today</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Discover our premium cleaning products and make your home sparkle with less effort.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/products')}
            className="bg-white text-brand-700 hover:bg-gray-100"
          >
            Browse Products
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
      className="group rounded-lg overflow-hidden shadow-md relative cursor-pointer"
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
          <h3 className="text-white text-xl font-bold ltr">{category.name}</h3>
          {category.arabicName && (
            <p className="text-white/80 arabic">{category.arabicName}</p>
          )}
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
    <div className={`p-6 rounded-lg ${featured ? 'bg-brand-50 border border-brand-200' : 'bg-white shadow-md'}`}>
      <div className="flex items-center space-x-2 mb-4">
        {[1, 2, 3, 4, 5].map(star => (
          <svg 
            key={star} 
            className="w-5 h-5 text-yellow-400" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        ))}
      </div>
      <p className="text-gray-700 mb-4">{text}</p>
      <p className="font-medium">{name}</p>
    </div>
  );
};

export default HomePage;
