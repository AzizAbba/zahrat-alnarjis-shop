
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
  // Add missing property used in CheckoutPage
  cart: any[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setItems(JSON.parse(storedCart));
    }
  }, []);
  
  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);
  
  // Add a product to the cart
  const addToCart = (product: Product, quantity = 1) => {
    setItems(prevItems => {
      // Check if item already exists in cart
      const existingItem = prevItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Update quantity if item exists
        return prevItems.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        // Add new item if it doesn't exist
        return [...prevItems, { product, quantity }];
      }
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };
  
  // Remove a product from the cart
  const removeFromCart = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart",
    });
  };
  
  // Update the quantity of a product in the cart
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };
  
  // Clear the entire cart
  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };
  
  // Calculate the total number of items in the cart
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  
  // Calculate the total price of all items in the cart
  const totalPrice = items.reduce(
    (total, item) => total + (item.product.price * item.quantity), 
    0
  );
  
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
