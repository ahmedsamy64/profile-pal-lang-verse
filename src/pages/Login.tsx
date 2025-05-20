
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  const { login, signup, isAuthenticated, isLoading: authLoading } = useAuth();
  const { t, dir, language } = useLanguage();
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/my-profile');
    }
  }, [isAuthenticated, authLoading, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError(getText('error.required'));
      return;
    }
    
    // Email validation - simple check for @ symbol
    if (!email.includes('@')) {
      setError(getText('error.invalidEmail'));
      return;
    }
    
    // Password validation - at least 6 characters
    if (password.length < 6) {
      setError(getText('error.passwordLength'));
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        // Handle signup - the navigation is handled in the AuthContext
        const { success, error: signupError } = await signup(email, password);
        
        if (!success) {
          throw new Error(signupError || getText('error.signup'));
        }
        
        // No need to navigate here as it's handled in the AuthContext
        setError('');
      } else {
        // Handle sign in
        const success = await login(email, password);
        
        if (!success) {
          throw new Error(getText('error.invalidCredentials'));
        }
        
        // On successful login
        setError('');
        navigate('/my-profile');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      
      // Provide user-friendly error messages
      if (err.message.includes('Email address') && err.message.includes('is invalid')) {
        setError(getText('error.invalidEmail'));
      } else if (err.message.includes('Password should be at least')) {
        setError(getText('error.passwordLength'));
      } else if (err.message.includes('Invalid login credentials')) {
        setError(getText('error.invalidCredentials'));
      } else if (err.message.includes('User already registered')) {
        setError(getText('error.userExists'));
      } else {
        setError(err.message || getText('error.login'));
      }
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
      case 'error.invalidEmail':
        return language === 'ar' ? 'يرجى إدخال عنوان بريد إلكتروني صالح' : 'Please enter a valid email address';
      case 'error.invalidEmailDomain':
        return language === 'ar' ? 'نطاق البريد الإلكتروني غير صالح. يرجى استخدام بريد إلكتروني مختلف' : 'Email domain is not accepted. Please use a different email address';
      case 'error.passwordLength':
        return language === 'ar' ? 'يجب أن تكون كلمة المرور 6 أحرف على الأقل' : 'Password must be at least 6 characters';
      case 'error.invalidCredentials':
        return language === 'ar' ? 'بيانات الاعتماد غير صالحة' : 'Invalid login credentials';
      case 'error.userExists':
        return language === 'ar' ? 'المستخدم مسجل بالفعل' : 'User already registered';
      case 'error.login':
        return language === 'ar' ? 'خطأ في تسجيل الدخول' : 'Login error';
      case 'error.signup':
        return language === 'ar' ? 'فشل في التسجيل. يرجى المحاولة مرة أخرى.' : 'Failed to sign up. Please try again.';
      case 'common.loading':
        return language === 'ar' ? 'جاري التحميل...' : 'Loading...';
      default:
        return key;
    }
  };
  
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
      'error.invalidEmail': 'Please enter a valid email address',
      'error.invalidEmailDomain': 'Email domain is not accepted. Please use a different email address',
      'error.passwordLength': 'Password must be at least 6 characters',
      'error.invalidCredentials': 'Invalid login credentials',
      'error.userExists': 'User already registered',
      'error.signup': 'Failed to sign up. Please try again.',
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
      'error.invalidEmail': 'يرجى إدخال عنوان بريد إلكتروني صالح',
      'error.invalidEmailDomain': 'نطاق البريد الإلكتروني غير صالح. يرجى استخدام بريد إلكتروني مختلف',
      'error.passwordLength': 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
      'error.invalidCredentials': 'بيانات الاعتماد غير صالحة',
      'error.userExists': 'المستخدم مسجل بالفعل',
      'error.signup': 'فشل في التسجيل. يرجى المحاولة مرة أخرى.',
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
