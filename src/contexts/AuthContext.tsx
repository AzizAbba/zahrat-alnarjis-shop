
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

// Define user types
export type UserRole = 'customer' | 'admin' | 'superadmin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phoneNumber?: string;
  address?: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

export interface Admin {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'superadmin';
  name: string;
  isSuperAdmin: boolean;
  isAdmin: boolean;
}

// Context interface
interface AuthContextType {
  user: User | null;
  admins: Admin[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  login: (email: string, password: string) => boolean;
  adminLogin: (username: string, password: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, password: string, phoneNumber?: string, address?: string) => boolean;
  removeAdmin: (id: string) => void;
  updateUser: (user: Partial<User>) => void;
  // Only define addAdmin once with the more flexible signature
  addAdmin: (adminData: Partial<Admin> | string, password?: string, name?: string, role?: 'admin' | 'superadmin') => boolean;
  // Add missing methods and properties used in AdminUsersPage
  adminUsers: Admin[];
  updateAdmin: (admin: Admin) => void;
  deleteAdmin: (id: string) => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default admin
const DEFAULT_ADMIN: Admin = {
  id: '1',
  username: 'admin',
  password: 'admin123',
  role: 'superadmin',
  name: 'Super Admin',
  isSuperAdmin: true,
  isAdmin: true
};

// Mock users for development
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Test User',
    email: 'user@example.com',
    role: 'customer',
    phoneNumber: '123456789',
    address: 'Test Address, City',
    isAdmin: false,
    isSuperAdmin: false
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State
  const [user, setUser] = useState<User | null>(null);
  const [admins, setAdmins] = useState<Admin[]>([]);
  
  // Load from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedAdmins = localStorage.getItem('admins');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (storedAdmins) {
      setAdmins(JSON.parse(storedAdmins));
    } else {
      // Initialize with default admin
      setAdmins([DEFAULT_ADMIN]);
      localStorage.setItem('admins', JSON.stringify([DEFAULT_ADMIN]));
    }
  }, []);
  
  // Save to localStorage when state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);
  
  useEffect(() => {
    if (admins.length > 0) {
      localStorage.setItem('admins', JSON.stringify(admins));
    }
  }, [admins]);
  
  // Login function
  const login = (email: string, password: string): boolean => {
    // In a real app, this would validate against a server
    // For demo, we'll use mock data and localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const userWithoutPassword = { 
        ...foundUser,
        isAdmin: false,
        isSuperAdmin: false
      };
      delete userWithoutPassword.password;
      
      setUser(userWithoutPassword);
      toast({
        title: "Login successful",
        description: `Welcome back, ${userWithoutPassword.name}!`,
      });
      return true;
    }
    
    toast({
      variant: "destructive",
      title: "Login failed",
      description: "Invalid email or password",
    });
    return false;
  };
  
  // Admin login
  const adminLogin = (username: string, password: string): boolean => {
    const foundAdmin = admins.find(a => a.username === username && a.password === password);
    
    if (foundAdmin) {
      // Create a user object from admin data
      const adminUser: User = {
        id: foundAdmin.id,
        name: foundAdmin.name,
        email: username,
        role: foundAdmin.role,
        isAdmin: true,
        isSuperAdmin: foundAdmin.role === 'superadmin'
      };
      
      setUser(adminUser);
      toast({
        title: "Admin Login successful",
        description: `Welcome back, ${foundAdmin.name}!`,
      });
      return true;
    }
    
    toast({
      variant: "destructive",
      title: "Login failed",
      description: "Invalid admin credentials",
    });
    return false;
  };
  
  // Register function
  const register = (name: string, email: string, password: string, phoneNumber?: string, address?: string): boolean => {
    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some((u: any) => u.email === email)) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Email already in use",
      });
      return false;
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In a real app, this would be hashed
      role: 'customer' as UserRole,
      phoneNumber,
      address,
      isAdmin: false,
      isSuperAdmin: false
    };
    
    // Save to localStorage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Login the user
    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;
    setUser(userWithoutPassword);
    
    toast({
      title: "Registration successful",
      description: "Your account has been created",
    });
    return true;
  };
  
  // Combined addAdmin function that handles both object input and individual parameters
  const addAdmin = (
    adminData: Partial<Admin> | string,
    password?: string,
    name?: string,
    role?: 'admin' | 'superadmin'
  ): boolean => {
    // If it's an object with all properties already set
    if (typeof adminData === 'object' && adminData.username) {
      // Check if username already exists
      if (admins.some(a => a.username === adminData.username)) {
        toast({
          variant: "destructive",
          title: "Failed to add admin",
          description: "Username already in use",
        });
        return false;
      }
      
      // Make sure isSuperAdmin and isAdmin flags are set
      const newAdmin: Admin = {
        ...adminData as Admin, // Cast to Admin to access properties
        isAdmin: true,
        isSuperAdmin: adminData.isSuperAdmin || adminData.role === 'superadmin'
      };
      
      // Update state
      setAdmins([...admins, newAdmin as Admin]);
      
      toast({
        title: "Admin added successfully",
        description: `${newAdmin.name} has been added as ${newAdmin.role}`,
      });
      return true;
    }
    
    // Older signature (username, password, name, role)
    const username = adminData as string;
    
    // Check if username already exists
    if (admins.some(a => a.username === username)) {
      toast({
        variant: "destructive",
        title: "Failed to add admin",
        description: "Username already in use",
      });
      return false;
    }
    
    // Create new admin
    const newAdmin: Admin = {
      id: Date.now().toString(),
      username,
      password: password || '',
      name: name || '',
      role: role || 'admin',
      isSuperAdmin: role === 'superadmin',
      isAdmin: true
    };
    
    // Update state
    setAdmins([...admins, newAdmin]);
    
    toast({
      title: "Admin added successfully",
      description: `${name} has been added as ${role}`,
    });
    return true;
  };
  
  // Update admin function
  const updateAdmin = (updatedAdmin: Admin) => {
    setAdmins(prevAdmins => 
      prevAdmins.map(admin => 
        admin.id === updatedAdmin.id ? updatedAdmin : admin
      )
    );
    
    toast({
      title: "Admin updated",
      description: "Admin has been updated successfully",
    });
  };
  
  // Remove admin
  const removeAdmin = (id: string) => {
    // Cannot remove the last admin
    if (admins.length <= 1) {
      toast({
        variant: "destructive",
        title: "Cannot remove admin",
        description: "At least one admin must exist",
      });
      return;
    }
    
    // Filter out the admin
    setAdmins(admins.filter(admin => admin.id !== id));
    
    toast({
      title: "Admin removed",
      description: "Admin has been removed successfully",
    });
  };
  
  // Alias for removeAdmin to match usage in AdminUsersPage
  const deleteAdmin = removeAdmin;
  
  // Logout function
  const logout = () => {
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };
  
  // Update user function
  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    
    // If this is a customer, also update in the users array
    if (user.role === 'customer') {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((u: any) => 
        u.id === user.id ? { ...u, ...userData } : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
  };
  
  // Computed properties
  const isAuthenticated = !!user;
  const isAdmin = !!user && (user.role === 'admin' || user.role === 'superadmin');
  const isSuperAdmin = !!user && user.role === 'superadmin';
  
  return (
    <AuthContext.Provider value={{
      user,
      admins,
      isAuthenticated,
      isAdmin,
      isSuperAdmin,
      login,
      adminLogin,
      logout,
      register,
      addAdmin,
      removeAdmin,
      updateUser,
      // Additional properties for AdminUsersPage
      adminUsers: admins,
      updateAdmin,
      deleteAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
