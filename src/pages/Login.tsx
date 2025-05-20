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
  
  // Check if the translation key exists in the language context
  const getText = (key: string): string => {
    // If the translation is available, use it
    if (translations[language][key]) {
      return t(key);
    }
    // Otherwise provide fallback text
    switch (key) {
      case 'signup.title':
        return language === 'ar' ? 'إنشاء حساب جديد' : 'Create New Account';
      case 'signup.description':
        return language === 'ar' ? 'سجل للحصول على حساب جديد' : 'Register for a new account';
      case 'signup.submit':
        return language === 'ar' ? 'إنشاء حساب' : 'Sign Up';
      case 'signup.haveAccount':
        return language === 'ar' ? 'لديك حساب بالفعل؟ تسجيل الدخول' : 'Already have an account? Log in';
      case 'login.title':
        return language === 'ar' ? 'تسجيل الدخول' : 'Login';
      case 'login.description':
        return language === 'ar' ? 'قم بتسجيل الدخول إلى حسابك' : 'Sign in to your account';
      case 'login.submit':
        return language === 'ar' ? 'تسجيل الدخول' : 'Login';
      case 'login.noAccount':
        return language === 'ar' ? 'ليس لديك حساب؟ اشترك' : "Don't have an account? Sign up";
      case 'login.email':
        return language === 'ar' ? 'البريد الإلكتروني' : 'Email';
      case 'login.password':
        return language === 'ar' ? 'كلمة المرور' : 'Password';
      case 'error.required':
        return language === 'ar' ? 'جميع الحقول مطلوبة' : 'All fields are required';
      case 'error.login':
        return language === 'ar' ? 'خطأ في تسجيل الدخول' : 'Login error';
      case 'common.loading':
        return language === 'ar' ? 'جاري التحميل...' : 'Loading...';
      default:
        return key;
    }
  };
  
  // Extract language from context to use in the fallback function
  const { language } = useLanguage();
  
  // Access translations directly to check if keys exist
  const translations: Record<string, Record<string, string>> = {
    en: {
      'login.title': 'Login to your account',
      'login.email': 'Email',
      'login.password': 'Password',
      'login.submit': 'Login',
      'login.noAccount': "Don't have an account?",
      'signup.title': 'Create New Account',
      'signup.description': 'Register for a new account',
      'signup.submit': 'Sign Up',
      'signup.haveAccount': 'Already have an account? Log in',
      'error.required': 'All fields are required',
      'error.login': 'Login error',
      'common.loading': 'Loading...',
    },
    ar: {
      'login.title': 'تسجيل الدخول إلى حسابك',
      'login.email': 'البريد الإلكتروني',
      'login.password': 'كلمة المرور',
      'login.submit': 'تسجيل الدخول',
      'login.noAccount': 'ليس لديك حساب؟',
      'signup.title': 'إنشاء حساب جديد',
      'signup.description': 'سجل للحصول على حساب جديد',
      'signup.submit': 'إنشاء حساب',
      'signup.haveAccount': 'لديك حساب بالفعل؟ تسجيل الدخول',
      'error.required': 'جميع الحقول مطلوبة',
      'error.login': 'خطأ في تسجيل الدخول',
      'common.loading': 'جاري التحميل...',
    }
  };
  
  return (
    <div className="container flex items-center justify-center min-h-[80vh]" dir={dir}>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isSignUp ? getText('signup.title') : getText('login.title')}</CardTitle>
          <CardDescription>
            {isSignUp ? getText('signup.description') : getText('login.description')}
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
              <Label htmlFor="email">{getText('login.email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{getText('login.password')}</Label>
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
                ? getText('common.loading') 
                : isSignUp 
                  ? getText('signup.submit') 
                  : getText('login.submit')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={toggleAuthMode}>
            {isSignUp ? getText('signup.haveAccount') : getText('login.noAccount')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
