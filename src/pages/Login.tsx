
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  const { login } = useAuth();
  const { t, dir } = useLanguage();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError(t('error.required'));
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        // Handle sign up with Supabase
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (signUpError) {
          throw signUpError;
        }
        
        // If signup successful, automatically log them in
        const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          throw signInError;
        }
        
        if (session) {
          navigate('/my-profile');
        }
      } else {
        // Handle sign in with Supabase
        const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          throw signInError;
        }
        
        if (session) {
          navigate('/my-profile');
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || t('error.login'));
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
  };
  
  return (
    <div className="container flex items-center justify-center min-h-[80vh]" dir={dir}>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isSignUp ? t('signup.title') : t('login.title')}</CardTitle>
          <CardDescription>
            {isSignUp ? t('signup.description') : t('login.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">{t('login.email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{t('login.password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading 
                ? t('common.loading') 
                : isSignUp 
                  ? t('signup.submit') 
                  : t('login.submit')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={toggleAuthMode}>
            {isSignUp ? t('signup.haveAccount') : t('login.noAccount')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
