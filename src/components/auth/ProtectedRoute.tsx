
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  superAdminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false, 
  superAdminOnly = false 
}) => {
  const { isAuthenticated, isAdmin, isSuperAdmin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "You must be logged in to access this page",
      });
    } else if (requireAdmin && !isAdmin) {
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "This area is restricted to administrators only",
      });
    } else if (superAdminOnly && !isSuperAdmin) {
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "This area is restricted to super administrators only",
      });
    }
  }, [isAuthenticated, isAdmin, isSuperAdmin, requireAdmin, superAdminOnly]);

  // Check authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check admin access if required
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Check super admin access if required
  if (superAdminOnly && !isSuperAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // If all checks pass, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
