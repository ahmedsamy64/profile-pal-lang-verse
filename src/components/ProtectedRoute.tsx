
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  
  // Delayed check for authentication to allow auth state to stabilize
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Only show toast and redirect if we're not in a loading state
      toast({
        title: t("login.required"),
        description: t("login.pleaseLogin"),
        variant: "destructive",
      });
      setShouldRedirect(true);
    }
  }, [isLoading, isAuthenticated, t]);
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  if (shouldRedirect) {
    // Redirect to login with the intended destination
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // If authenticated or waiting for auth to stabilize, show content
  return <>{children}</>;
};

export default ProtectedRoute;
