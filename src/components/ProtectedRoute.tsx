
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { t } = useLanguage();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="container px-4 py-8 mx-auto max-w-4xl">
        <Card className="p-8 space-y-4 animate-pulse">
          <div className="flex items-center justify-center mb-6">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
          </div>
          <Skeleton className="h-12 w-3/4 mx-auto mb-8" />
          <Skeleton className="h-64 w-full" />
          <div className="flex justify-end">
            <Skeleton className="h-10 w-32" />
          </div>
        </Card>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    toast({
      title: t("login.required"),
      description: t("login.pleaseLogin"),
      variant: "destructive",
    });
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
