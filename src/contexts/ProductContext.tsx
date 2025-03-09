
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { toast as sonnerToast } from 'sonner';
import { Product, Category, Subcategory, DeliveryOption, DeliveryZone, Size, Color, Smell } from '@/types/product';

// Sample data
import { sampleProducts, sampleCategories } from '@/data/sampleData';

// Initial subcategories with Arabic names
const initialSubcategories: Subcategory[] = [
  {
    id: "sub1",
    name: "Liquid Cleaners",
    arabicName: "منظفات سائلة",
    categoryId: "cat1",
    description: "جميع أنواع المنظفات السائلة للمنزل"
  },
  {
    id: "sub2",
    name: "Powder Cleaners",
    arabicName: "منظفات بودرة",
    categoryId: "cat1",
    description: "منظفات البودرة للأرضيات والأسطح"
  },
  {
    id: "sub3",
    name: "Laundry Detergents",
    arabicName: "مساحيق الغسيل",
    categoryId: "cat2",
    description: "مساحيق ومنظفات الغسيل للملابس"
  },
  {
    id: "sub4",
    name: "Fabric Softeners",
    arabicName: "منعمات الأقمشة",
    categoryId: "cat2",
    description: "منعمات للملابس والأقمشة"
  }
];

// Initial sizes
const initialSizes: Size[] = [
  {
    id: "size1",
    name: "Small",
    arabicName: "صغير",
    value: "S"
  },
  {
    id: "size2",
    name: "Medium",
    arabicName: "متوسط",
    value: "M"
  },
  {
    id: "size3",
    name: "Large",
    arabicName: "كبير",
    value: "L"
  },
  {
    id: "size4",
    name: "Extra Large",
    arabicName: "كبير جداً",
    value: "XL"
  }
];

// Initial colors
const initialColors: Color[] = [
  {
    id: "color1",
    name: "Blue",
    arabicName: "أزرق",
    hexCode: "#1aa8ff"
  },
  {
    id: "color2",
    name: "Green",
    arabicName: "أخضر",
    hexCode: "#4CAF50"
  },
  {
    id: "color3",
    name: "Red",
    arabicName: "أحمر",
    hexCode: "#F44336"
  },
  {
    id: "color4",
    name: "Yellow",
    arabicName: "أصفر",
    hexCode: "#FFEB3B"
  }
];

// Initial smells
const initialSmells: Smell[] = [
  {
    id: "smell1",
    name: "Floral",
    arabicName: "زهور",
    description: "عطر الزهور المنعش"
  },
  {
    id: "smell2",
    name: "Citrus",
    arabicName: "حمضيات",
    description: "رائحة الحمضيات المنعشة"
  },
  {
    id: "smell3",
    name: "Lavender",
    arabicName: "خزامى",
    description: "عطر الخزامى المهدئ"
  },
  {
    id: "smell4",
    name: "Ocean",
    arabicName: "بحر",
    description: "رائحة البحر المنعشة"
  }
];

// Initial delivery options
const initialDeliveryOptions: DeliveryOption[] = [
  {
    id: "del1",
    name: "Standard Delivery",
    arabicName: "توصيل عادي",
    price: 15,
    estimatedDays: "3-5",
    isActive: true,
    icon: "truck"
  },
  {
    id: "del2",
    name: "Express Delivery",
    arabicName: "توصيل سريع",
    price: 30,
    estimatedDays: "1-2",
    isActive: true,
    icon: "zap"
  },
  {
    id: "del3",
    name: "Store Pickup",
    arabicName: "استلام من المتجر",
    price: 0,
    estimatedDays: "1",
    isActive: true,
    icon: "store"
  }
];

// Initial delivery zones
const initialDeliveryZones: DeliveryZone[] = [
  {
    id: "zone1",
    name: "City Center",
    arabicName: "وسط المدينة",
    cities: ["الرياض", "جدة", "الدمام"],
    additionalFee: 0,
    isActive: true
  },
  {
    id: "zone2",
    name: "Suburban Areas",
    arabicName: "ضواحي المدن",
    cities: ["الخبر", "الظهران", "أبها"],
    additionalFee: 10,
    isActive: true
  },
  {
    id: "zone3",
    name: "Remote Areas",
    arabicName: "المناطق البعيدة",
    cities: ["حائل", "تبوك", "جازان"],
    additionalFee: 25,
    isActive: true
  }
];

interface ProductContextType {
  products: Product[];
  categories: Category[];
  subcategories: Subcategory[];
  sizes: Size[];
  colors: Color[];
  smells: Smell[];
  deliveryOptions: DeliveryOption[];
  deliveryZones: DeliveryZone[];
  
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  addSubcategory: (subcategory: Omit<Subcategory, 'id'>) => void;
  updateSubcategory: (id: string, subcategory: Partial<Subcategory>) => void;
  deleteSubcategory: (id: string) => void;
  
  addSize: (size: Omit<Size, 'id'>) => void;
  updateSize: (id: string, size: Partial<Size>) => void;
  deleteSize: (id: string) => void;
  
  addColor: (color: Omit<Color, 'id'>) => void;
  updateColor: (id: string, color: Partial<Color>) => void;
  deleteColor: (id: string) => void;
  
  addSmell: (smell: Omit<Smell, 'id'>) => void;
  updateSmell: (id: string, smell: Partial<Smell>) => void;
  deleteSmell: (id: string) => void;
  
  addDeliveryOption: (option: Omit<DeliveryOption, 'id'>) => void;
  updateDeliveryOption: (id: string, option: Partial<DeliveryOption>) => void;
  deleteDeliveryOption: (id: string) => void;
  
  addDeliveryZone: (zone: Omit<DeliveryZone, 'id'>) => void;
  updateDeliveryZone: (id: string, zone: Partial<DeliveryZone>) => void;
  deleteDeliveryZone: (id: string) => void;
  
  importData: (data: any) => boolean;
  exportData: () => any;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [smells, setSmells] = useState<Smell[]>([]);
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([]);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  
  // Initialize with data on first load
  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    const storedCategories = localStorage.getItem('categories');
    const storedSubcategories = localStorage.getItem('subcategories');
    const storedSizes = localStorage.getItem('sizes');
    const storedColors = localStorage.getItem('colors');
    const storedSmells = localStorage.getItem('smells');
    const storedDeliveryOptions = localStorage.getItem('deliveryOptions');
    const storedDeliveryZones = localStorage.getItem('deliveryZones');
    
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
    
    if (storedSubcategories) {
      setSubcategories(JSON.parse(storedSubcategories));
    } else {
      setSubcategories(initialSubcategories);
      localStorage.setItem('subcategories', JSON.stringify(initialSubcategories));
    }
    
    if (storedSizes) {
      setSizes(JSON.parse(storedSizes));
    } else {
      setSizes(initialSizes);
      localStorage.setItem('sizes', JSON.stringify(initialSizes));
    }
    
    if (storedColors) {
      setColors(JSON.parse(storedColors));
    } else {
      setColors(initialColors);
      localStorage.setItem('colors', JSON.stringify(initialColors));
    }
    
    if (storedSmells) {
      setSmells(JSON.parse(storedSmells));
    } else {
      setSmells(initialSmells);
      localStorage.setItem('smells', JSON.stringify(initialSmells));
    }
    
    if (storedDeliveryOptions) {
      setDeliveryOptions(JSON.parse(storedDeliveryOptions));
    } else {
      setDeliveryOptions(initialDeliveryOptions);
      localStorage.setItem('deliveryOptions', JSON.stringify(initialDeliveryOptions));
    }
    
    if (storedDeliveryZones) {
      setDeliveryZones(JSON.parse(storedDeliveryZones));
    } else {
      setDeliveryZones(initialDeliveryZones);
      localStorage.setItem('deliveryZones', JSON.stringify(initialDeliveryZones));
    }
  }, []);
  
  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);
  
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);
  
  useEffect(() => {
    localStorage.setItem('subcategories', JSON.stringify(subcategories));
  }, [subcategories]);
  
  useEffect(() => {
    localStorage.setItem('sizes', JSON.stringify(sizes));
  }, [sizes]);
  
  useEffect(() => {
    localStorage.setItem('colors', JSON.stringify(colors));
  }, [colors]);
  
  useEffect(() => {
    localStorage.setItem('smells', JSON.stringify(smells));
  }, [smells]);
  
  useEffect(() => {
    localStorage.setItem('deliveryOptions', JSON.stringify(deliveryOptions));
  }, [deliveryOptions]);
  
  useEffect(() => {
    localStorage.setItem('deliveryZones', JSON.stringify(deliveryZones));
  }, [deliveryZones]);
  
  // Product Functions
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    setProducts(prevProducts => [...prevProducts, newProduct]);
    
    toast({
      title: "Product Added",
      description: `${product.name} has been added successfully`,
    });
  };
  
  const updateProduct = (id: string, product: Partial<Product>) => {
    setProducts(prevProducts => 
      prevProducts.map(p => 
        p.id === id ? { ...p, ...product } : p
      )
    );
    
    toast({
      title: "Product Updated",
      description: "Product has been updated successfully",
    });
  };
  
  const deleteProduct = (id: string) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
    
    toast({
      title: "Product Deleted",
      description: "Product has been deleted successfully",
    });
  };
  
  // Category Functions
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString()
    };
    
    setCategories(prevCategories => [...prevCategories, newCategory]);
    
    toast({
      title: "Category Added",
      description: `${category.name} has been added successfully`,
    });
  };
  
  const updateCategory = (id: string, category: Partial<Category>) => {
    setCategories(prevCategories => 
      prevCategories.map(c => 
        c.id === id ? { ...c, ...category } : c
      )
    );
    
    toast({
      title: "Category Updated",
      description: "Category has been updated successfully",
    });
  };
  
  const deleteCategory = (id: string) => {
    // Check if any products are using this category
    const productsWithCategory = products.filter(p => p.categoryId === id);
    
    // Check if any subcategories are in this category
    const subcategoriesInCategory = subcategories.filter(s => s.categoryId === id);
    
    if (productsWithCategory.length > 0 || subcategoriesInCategory.length > 0) {
      toast({
        variant: "destructive",
        title: "Cannot Delete Category",
        description: "This category is in use by products or subcategories",
      });
      return;
    }
    
    setCategories(prevCategories => prevCategories.filter(c => c.id !== id));
    
    toast({
      title: "Category Deleted",
      description: "Category has been deleted successfully",
    });
  };
  
  // Subcategory Functions
  const addSubcategory = (subcategory: Omit<Subcategory, 'id'>) => {
    const newSubcategory: Subcategory = {
      ...subcategory,
      id: Date.now().toString()
    };
    
    setSubcategories(prevSubcategories => [...prevSubcategories, newSubcategory]);
    
    toast({
      title: "Subcategory Added",
      description: `${subcategory.name} has been added successfully`,
    });
  };
  
  const updateSubcategory = (id: string, subcategory: Partial<Subcategory>) => {
    setSubcategories(prevSubcategories => 
      prevSubcategories.map(s => 
        s.id === id ? { ...s, ...subcategory } : s
      )
    );
    
    toast({
      title: "Subcategory Updated",
      description: "Subcategory has been updated successfully",
    });
  };
  
  const deleteSubcategory = (id: string) => {
    // Check if any products are using this subcategory
    const productsWithSubcategory = products.filter(p => p.subcategoryId === id);
    
    if (productsWithSubcategory.length > 0) {
      toast({
        variant: "destructive",
        title: "Cannot Delete Subcategory",
        description: "This subcategory is in use by products",
      });
      return;
    }
    
    setSubcategories(prevSubcategories => prevSubcategories.filter(s => s.id !== id));
    
    toast({
      title: "Subcategory Deleted",
      description: "Subcategory has been deleted successfully",
    });
  };
  
  // Size Functions
  const addSize = (size: Omit<Size, 'id'>) => {
    const newSize: Size = {
      ...size,
      id: Date.now().toString()
    };
    
    setSizes(prevSizes => [...prevSizes, newSize]);
    
    toast({
      title: "Size Added",
      description: `${size.name} has been added successfully`,
    });
  };
  
  const updateSize = (id: string, size: Partial<Size>) => {
    setSizes(prevSizes => 
      prevSizes.map(s => 
        s.id === id ? { ...s, ...size } : s
      )
    );
    
    toast({
      title: "Size Updated",
      description: "Size has been updated successfully",
    });
  };
  
  const deleteSize = (id: string) => {
    // Check if any products are using this size
    const productsWithSize = products.filter(p => p.sizeId === id);
    
    if (productsWithSize.length > 0) {
      toast({
        variant: "destructive",
        title: "Cannot Delete Size",
        description: "This size is in use by products",
      });
      return;
    }
    
    setSizes(prevSizes => prevSizes.filter(s => s.id !== id));
    
    toast({
      title: "Size Deleted",
      description: "Size has been deleted successfully",
    });
  };
  
  // Color Functions
  const addColor = (color: Omit<Color, 'id'>) => {
    const newColor: Color = {
      ...color,
      id: Date.now().toString()
    };
    
    setColors(prevColors => [...prevColors, newColor]);
    
    toast({
      title: "Color Added",
      description: `${color.name} has been added successfully`,
    });
  };
  
  const updateColor = (id: string, color: Partial<Color>) => {
    setColors(prevColors => 
      prevColors.map(c => 
        c.id === id ? { ...c, ...color } : c
      )
    );
    
    toast({
      title: "Color Updated",
      description: "Color has been updated successfully",
    });
  };
  
  const deleteColor = (id: string) => {
    // Check if any products are using this color
    const productsWithColor = products.filter(p => p.colorId === id);
    
    if (productsWithColor.length > 0) {
      toast({
        variant: "destructive",
        title: "Cannot Delete Color",
        description: "This color is in use by products",
      });
      return;
    }
    
    setColors(prevColors => prevColors.filter(c => c.id !== id));
    
    toast({
      title: "Color Deleted",
      description: "Color has been deleted successfully",
    });
  };
  
  // Smell Functions
  const addSmell = (smell: Omit<Smell, 'id'>) => {
    const newSmell: Smell = {
      ...smell,
      id: Date.now().toString()
    };
    
    setSmells(prevSmells => [...prevSmells, newSmell]);
    
    toast({
      title: "Smell Added",
      description: `${smell.name} has been added successfully`,
    });
  };
  
  const updateSmell = (id: string, smell: Partial<Smell>) => {
    setSmells(prevSmells => 
      prevSmells.map(s => 
        s.id === id ? { ...s, ...smell } : s
      )
    );
    
    toast({
      title: "Smell Updated",
      description: "Smell has been updated successfully",
    });
  };
  
  const deleteSmell = (id: string) => {
    // Check if any products are using this smell
    const productsWithSmell = products.filter(p => p.smellId === id);
    
    if (productsWithSmell.length > 0) {
      toast({
        variant: "destructive",
        title: "Cannot Delete Smell",
        description: "This smell is in use by products",
      });
      return;
    }
    
    setSmells(prevSmells => prevSmells.filter(s => s.id !== id));
    
    toast({
      title: "Smell Deleted",
      description: "Smell has been deleted successfully",
    });
  };
  
  // Delivery Option Functions
  const addDeliveryOption = (option: Omit<DeliveryOption, 'id'>) => {
    const newOption: DeliveryOption = {
      ...option,
      id: Date.now().toString()
    };
    
    setDeliveryOptions(prevOptions => [...prevOptions, newOption]);
    
    toast({
      title: "Delivery Option Added",
      description: `${option.name} has been added successfully`,
    });
  };
  
  const updateDeliveryOption = (id: string, option: Partial<DeliveryOption>) => {
    setDeliveryOptions(prevOptions => 
      prevOptions.map(o => 
        o.id === id ? { ...o, ...option } : o
      )
    );
    
    toast({
      title: "Delivery Option Updated",
      description: "Delivery option has been updated successfully",
    });
  };
  
  const deleteDeliveryOption = (id: string) => {
    setDeliveryOptions(prevOptions => prevOptions.filter(o => o.id !== id));
    
    toast({
      title: "Delivery Option Deleted",
      description: "Delivery option has been deleted successfully",
    });
  };
  
  // Delivery Zone Functions
  const addDeliveryZone = (zone: Omit<DeliveryZone, 'id'>) => {
    const newZone: DeliveryZone = {
      ...zone,
      id: Date.now().toString()
    };
    
    setDeliveryZones(prevZones => [...prevZones, newZone]);
    
    toast({
      title: "Delivery Zone Added",
      description: `${zone.name} has been added successfully`,
    });
  };
  
  const updateDeliveryZone = (id: string, zone: Partial<DeliveryZone>) => {
    setDeliveryZones(prevZones => 
      prevZones.map(z => 
        z.id === id ? { ...z, ...zone } : z
      )
    );
    
    toast({
      title: "Delivery Zone Updated",
      description: "Delivery zone has been updated successfully",
    });
  };
  
  const deleteDeliveryZone = (id: string) => {
    setDeliveryZones(prevZones => prevZones.filter(z => z.id !== id));
    
    toast({
      title: "Delivery Zone Deleted",
      description: "Delivery zone has been deleted successfully",
    });
  };
  
  // Import and Export Functions
  const importData = (data: any): boolean => {
    try {
      if (data.products) setProducts(data.products);
      if (data.categories) setCategories(data.categories);
      if (data.subcategories) setSubcategories(data.subcategories);
      if (data.sizes) setSizes(data.sizes);
      if (data.colors) setColors(data.colors);
      if (data.smells) setSmells(data.smells);
      if (data.deliveryOptions) setDeliveryOptions(data.deliveryOptions);
      if (data.deliveryZones) setDeliveryZones(data.deliveryZones);
      
      sonnerToast.success("Data imported successfully");
      return true;
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Import Error",
        description: "Failed to import data. Check the format and try again.",
        variant: "destructive"
      });
      return false;
    }
  };
  
  const exportData = () => {
    return {
      products,
      categories,
      subcategories,
      sizes,
      colors,
      smells,
      deliveryOptions,
      deliveryZones
    };
  };
  
  return (
    <ProductContext.Provider value={{
      products,
      categories,
      subcategories,
      sizes,
      colors,
      smells,
      deliveryOptions,
      deliveryZones,
      
      addProduct,
      updateProduct,
      deleteProduct,
      
      addCategory,
      updateCategory,
      deleteCategory,
      
      addSubcategory,
      updateSubcategory,
      deleteSubcategory,
      
      addSize,
      updateSize,
      deleteSize,
      
      addColor,
      updateColor,
      deleteColor,
      
      addSmell,
      updateSmell,
      deleteSmell,
      
      addDeliveryOption,
      updateDeliveryOption,
      deleteDeliveryOption,
      
      addDeliveryZone,
      updateDeliveryZone,
      deleteDeliveryZone,
      
      importData,
      exportData
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
