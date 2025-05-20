
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<{success: boolean, error?: string}>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // First check for existing session
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setSession(session);
          setUser(session.user);
          console.log("Session found and restored:", session.user.email);
        } else {
          console.log("No existing session found");
        }
      } catch (error) {
        console.error("Error loading auth session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Initialize auth
    initializeAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        if (event === 'SIGNED_IN') {
          toast({
            title: "Login successful",
            description: `Welcome back!`,
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Logged out",
            description: "You have been successfully logged out.",
          });
          navigate('/');
        } else if (event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
          toast({
            title: "Account updated",
            description: "Your account has been updated.",
          });
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [toast, navigate]);
  
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };
  
  const signup = async (email: string, password: string): Promise<{success: boolean, error?: string}> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      
      if (error) {
        console.error('Signup error:', error);
        return { success: false, error: error.message };
      }
      
      // Success - Set user and session manually immediately after signup
      if (data.user) {
        // If a session is returned, set it (happens when email confirmation is not required)
        if (data.session) {
          setSession(data.session);
          setUser(data.user);
          
          toast({
            title: "Signup successful",
            description: "Your account has been created.",
          });
          
          // Redirect to profile page
          navigate('/my-profile');
        } else {
          // Even if email verification is required, we'll still set the user state
          // to avoid the protected route redirecting back to login
          setUser(data.user);
          
          toast({
            title: "Verification required",
            description: "Please check your email to verify your account. However, you can start using the app now.",
          });
          
          // Redirect to profile page
          navigate('/my-profile');
        }
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  };
  
  const logout = async (): Promise<void> => {
    try {
      // Set loading state to prevent multiple logout attempts
      if (isLoggingOut) return;
      setIsLoggingOut(true);
      console.log("Attempting to logout...");
      
      // First manually clear the session state immediately
      // This ensures UI reflects logout regardless of API success
      setSession(null);
      setUser(null);
      
      try {
        // Try global signout first (works when session exists)
        await supabase.auth.signOut({ scope: 'global' });
        console.log("Successful global signout");
      } catch (error) {
        // If global signout fails, try basic signout
        console.error("Global signout failed, attempting basic signout");
        try {
          await supabase.auth.signOut();
          console.log("Successful basic signout");
        } catch (innerError) {
          console.error("Basic signout also failed:", innerError);
          // Continue with navigation even if both API calls fail
          // Since we already cleared the state manually
        }
      } finally {
        toast({
          title: "Logged out",
          description: "You have been successfully logged out.",
        });
        
        // Always navigate to home on logout
        navigate('/');
      }
    } catch (error) {
      console.error('Unexpected logout error:', error);
      toast({
        title: "Logout failed",
        description: "There was an unexpected issue logging out. Please try again.",
        variant: "destructive"
      });
    } finally {
      // Ensure loading state is reset
      setIsLoggingOut(false);
    }
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session,
        login,
        signup,
        logout, 
        isAuthenticated: !!user, // This ensures we consider a user authenticated as long as user state is set
        isLoading: isLoading || isLoggingOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
