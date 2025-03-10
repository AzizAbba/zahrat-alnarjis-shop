
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Product } from '@/types/product';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
  cart: any[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [itemCount, setItemCount] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
        // Reset corrupted cart data
        localStorage.removeItem('cart');
      }
    }
  }, []);
  
  // Calculate derived values whenever items change
  useEffect(() => {
    // Calculate total count of items
    const count = items.reduce((acc, item) => acc + item.quantity, 0);
    setItemCount(count);
    
    // Calculate total price
    const price = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    setTotalPrice(price);
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(items));
    
    // Log for debugging
    console.log("Cart updated:", { items, count, price });
  }, [items]);
  
  // Add a product to the cart
  const addToCart = (product: Product, quantity = 1) => {
    if (quantity <= 0) return;
    
    setItems(prevItems => {
      // Check if item already exists in cart
      const existingItem = prevItems.find(item => item.product.id === product.id);
      
      let newItems;
      if (existingItem) {
        // Update quantity if item exists
        newItems = prevItems.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        // Add new item if it doesn't exist
        newItems = [...prevItems, { product, quantity }];
      }
      
      // Debug log
      console.log("Adding to cart:", { product, quantity, newItems });
      
      return newItems;
    });
    
    toast({
      title: "أضيف إلى السلة",
      description: `تم إضافة ${product.arabicName || product.name} إلى سلة التسوق`,
    });
  };
  
  // Remove a product from the cart
  const removeFromCart = (productId: string) => {
    setItems(prevItems => {
      const newItems = prevItems.filter(item => item.product.id !== productId);
      console.log("Removing from cart:", { productId, newItems });
      return newItems;
    });
    
    toast({
      title: "تمت الإزالة من السلة",
      description: "تم إزالة المنتج من سلة التسوق",
    });
  };
  
  // Update the quantity of a product in the cart
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setItems(prevItems => {
      const newItems = prevItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      );
      console.log("Updating quantity:", { productId, quantity, newItems });
      return newItems;
    });
  };
  
  // Clear the entire cart
  const clearCart = () => {
    setItems([]);
    console.log("Cart cleared");
    toast({
      title: "تم مسح السلة",
      description: "تم إزالة جميع المنتجات من سلة التسوق",
    });
  };
  
  // Convert items to the format expected by the CheckoutPage
  const cart = items.map(item => ({
    id: item.product.id,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
    image: item.product.imageUrl
  }));
  
  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      itemCount,
      totalPrice,
      cart
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook for using cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
