
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Product } from '@/types/product';
import { useCart } from './CartContext';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  // Add missing properties that were referenced in other files
  totalPrice: number;
  date: string;
  customerInfo: {
    name: string;
    phone: string;
    address: string;
    notes?: string;
  };
}

interface OrderContextType {
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'status' | 'createdAt'>) => string;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  getOrderById: (id: string) => Order | undefined;
  getUserOrders: (email: string) => Order[];
  // Add missing method used in CheckoutPage
  addOrder: (order: any) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { clearCart } = useCart();
  
  // Load orders from localStorage on mount
  useEffect(() => {
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);
  
  // Save orders to localStorage when they change
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);
  
  // Create a new order
  const createOrder = (orderData: Omit<Order, 'id' | 'status' | 'createdAt'>): string => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    setOrders(prevOrders => [...prevOrders, newOrder]);
    
    // Clear the cart after creating an order
    clearCart();
    
    toast({
      title: "Order placed successfully",
      description: `Your order #${newOrder.id} has been received`,
    });
    
    return newOrder.id;
  };
  
  // Update the status of an order
  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === id ? { ...order, status } : order
      )
    );
    
    toast({
      title: "Order status updated",
      description: `Order #${id} is now ${status}`,
    });
  };
  
  // Get an order by its ID
  const getOrderById = (id: string): Order | undefined => {
    return orders.find(order => order.id === id);
  };
  
  // Get all orders for a specific user
  const getUserOrders = (email: string): Order[] => {
    return orders.filter(order => order.customerEmail === email);
  };
  
  // Add order function used in CheckoutPage
  const addOrder = (order: any) => {
    setOrders(prevOrders => [...prevOrders, order]);
  };
  
  return (
    <OrderContext.Provider value={{
      orders,
      createOrder,
      updateOrderStatus,
      getOrderById,
      getUserOrders,
      addOrder
    }}>
      {children}
    </OrderContext.Provider>
  );
};

// Hook for using order context
export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
