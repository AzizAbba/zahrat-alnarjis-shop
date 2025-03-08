
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Product, Category } from '@/types/product';

// Sample data
import { sampleProducts, sampleCategories } from '@/data/sampleData';

interface ProductContextType {
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Initialize with sample data on first load
  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    const storedCategories = localStorage.getItem('categories');
    
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(sampleProducts);
      localStorage.setItem('products', JSON.stringify(sampleProducts));
    }
    
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      setCategories(sampleCategories);
      localStorage.setItem('categories', JSON.stringify(sampleCategories));
    }
  }, []);
  
  // Save to localStorage when products change
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);
  
  // Save to localStorage when categories change
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);
  
  // Add a new product
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString()
    };
    
    setProducts(prevProducts => [...prevProducts, newProduct]);
    
    toast({
      title: "Product added",
      description: `${product.name} has been added successfully`,
    });
  };
  
  // Update an existing product
  const updateProduct = (id: string, product: Partial<Product>) => {
    setProducts(prevProducts => 
      prevProducts.map(p => 
        p.id === id ? { ...p, ...product } : p
      )
    );
    
    toast({
      title: "Product updated",
      description: "Product has been updated successfully",
    });
  };
  
  // Delete a product
  const deleteProduct = (id: string) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
    
    toast({
      title: "Product deleted",
      description: "Product has been deleted successfully",
    });
  };
  
  // Add a new category
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString()
    };
    
    setCategories(prevCategories => [...prevCategories, newCategory]);
    
    toast({
      title: "Category added",
      description: `${category.name} has been added successfully`,
    });
  };
  
  // Update an existing category
  const updateCategory = (id: string, category: Partial<Category>) => {
    setCategories(prevCategories => 
      prevCategories.map(c => 
        c.id === id ? { ...c, ...category } : c
      )
    );
    
    toast({
      title: "Category updated",
      description: "Category has been updated successfully",
    });
  };
  
  // Delete a category
  const deleteCategory = (id: string) => {
    // Check if any products are using this category
    const productsWithCategory = products.filter(p => p.categoryId === id);
    
    if (productsWithCategory.length > 0) {
      toast({
        variant: "destructive",
        title: "Cannot delete category",
        description: "This category is in use by one or more products",
      });
      return;
    }
    
    setCategories(prevCategories => prevCategories.filter(c => c.id !== id));
    
    toast({
      title: "Category deleted",
      description: "Category has been deleted successfully",
    });
  };
  
  return (
    <ProductContext.Provider value={{
      products,
      categories,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateCategory,
      deleteCategory
    }}>
      {children}
    </ProductContext.Provider>
  );
};

// Hook for using product context
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
