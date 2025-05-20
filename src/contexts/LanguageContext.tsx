import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

// English translations
const enTranslations: Record<string, string> = {
  // General
  "app.title": "Profile Customizer",
  "app.description": "Create and customize your personal profile",
  
  // Navigation
  "nav.home": "Home",
  "nav.login": "Login",
  "nav.profile": "My Profile",
  "nav.logout": "Logout",
  
  // Home Page
  "home.welcome": "Welcome to Profile Customizer",
  "home.tagline": "Create and customize your personal profile with your preferred theme and colors",
  "home.getStarted": "Get Started",
  "home.features": "Features",
  "home.feature1": "Multiple themes and color schemes",
  "home.feature2": "Personalized profile creation",
  "home.feature3": "Full multilingual support",
  "home.featureDesc1": "Customize your profile with different themes and color schemes that match your personality.",
  "home.featureDesc2": "Create a personalized profile that represents who you are and what you love.",
  "home.featureDesc3": "Use the app in your preferred language with complete RTL support for Arabic.",
  
  // Login Page
  "login.title": "Login to your account",
  "login.description": "Sign in to your account",
  "login.email": "Email",
  "login.password": "Password",
  "login.submit": "Login",
  "login.rememberMe": "Remember me",
  "login.noAccount": "Don't have an account?",
  "login.createAccount": "Create one",
  "login.required": "Login Required",
  "login.pleaseLogin": "Please log in to access this page",
  
  // Signup Page
  "signup.title": "Create New Account",
  "signup.description": "Register for a new account",
  "signup.submit": "Sign Up",
  "signup.haveAccount": "Already have an account? Log in",
  
  // Profile Page
  "profile.title": "My Profile",
  "profile.name": "Name",
  "profile.namePlaceholder": "Enter your name",
  "profile.vibe": "Vibe/Theme",
  "profile.vibeTechie": "Techie",
  "profile.vibeArtist": "Artist",
  "profile.vibeExplorer": "Explorer",
  "profile.colorScheme": "Color Scheme",
  "profile.colorNeonSunset": "Neon Sunset",
  "profile.colorForestGreens": "Forest Greens",
  "profile.colorOceanBlues": "Ocean Blues",
  "profile.bio": "Short Bio",
  "profile.bioPlaceholder": "Tell us a bit about yourself...",
  "profile.save": "Save Profile",
  "profile.updated": "Profile updated successfully!",
  
  // Vibes taglines
  "vibe.techie": "Innovating the future with code",
  "vibe.artist": "Creating beauty in every stroke",
  "vibe.explorer": "Discovering new horizons",
  
  // Common
  "common.loading": "Loading...",
  "common.saving": "Saving...",
  
  // Errors
  "error.login": "Invalid username or password",
  "error.required": "This field is required",
  "error.save": "Failed to save profile",
  "error.auth": "Authentication Error",
  "error.loginRequired": "You must be logged in to access this page",
  "error.invalidEmail": "Please enter a valid email address",
  "error.passwordLength": "Password must be at least 6 characters",
  "error.invalidCredentials": "Invalid login credentials",
  "error.userExists": "User already registered",
  "error.signup": "Failed to sign up. Please try again.",
  "error.emailNotConfirmed": "Email not confirmed, but you can still use the app",
  "error.invalidEmailDomain": "Email domain is not allowed",
  "error.serverError": "Server error. Please try again later",
  "error.networkError": "Network error. Please check your connection",
  "error.unknownError": "An unknown error occurred",
  
  // NotFound Page
  "notFound.message": "Page not found",
  "notFound.description": "We couldn't find the page you were looking for.",
  "notFound.backToHome": "Back to home"
};

// Arabic translations
const arTranslations: Record<string, string> = {
  // General
  "app.title": "مخصص الملف الشخصي",
  "app.description": "إنشاء وتخصيص ملفك الشخصي",
  
  // Navigation
  "nav.home": "الرئيسية",
  "nav.login": "تسجيل الدخول",
  "nav.profile": "ملفي الشخصي",
  "nav.logout": "تسجيل الخروج",
  
  // Home Page
  "home.welcome": "مرحبًا بك في مخصص الملف الشخصي",
  "home.tagline": "إنشاء وتخصيص ملفك الشخصي بالمظهر والألوان المفضلة لديك",
  "home.getStarted": "ابدأ الآن",
  "home.features": "المميزات",
  "home.feature1": "سمات وألوان متعددة",
  "home.feature2": "إنشاء ملف شخصي مخصص",
  "home.feature3": "دعم كامل للغات المتعددة",
  "home.featureDesc1": "خصص ملفك الشخصي بسمات وألوان مختلفة تناسب شخصيتك.",
  "home.featureDesc2": "أنشئ ملفًا شخصيًا يعبر عنك وعما تحب.",
  "home.featureDesc3": "استخدم التطبيق باللغة المفضلة لديك مع دعم كامل للغة العربية.",
  
  // Login Page
  "login.title": "تسجيل الدخول إلى حسابك",
  "login.description": "قم بتسجيل الدخول إلى حسابك",
  "login.email": "البريد الإلكتروني",
  "login.password": "كلمة المرور",
  "login.submit": "تسجيل الدخول",
  "login.rememberMe": "تذكرني",
  "login.noAccount": "ليس لديك حساب؟",
  "login.createAccount": "إنشاء حساب",
  "login.required": "تسجيل الدخول مطلوب",
  "login.pleaseLogin": "يرجى تسجيل الدخول للوصول إلى هذه الصفحة",
  
  // Signup Page
  "signup.title": "إنشاء حساب جديد",
  "signup.description": "سجل للحصول على حساب جديد",
  "signup.submit": "إنشاء حساب",
  "signup.haveAccount": "لديك حساب بالفعل؟ تسجيل الدخول",
  
  // Profile Page
  "profile.title": "ملفي الشخصي",
  "profile.name": "الاسم",
  "profile.namePlaceholder": "أدخل اسمك",
  "profile.vibe": "الجو/السمة",
  "profile.vibeTechie": "تقني",
  "profile.vibeArtist": "فنان",
  "profile.vibeExplorer": "مستكشف",
  "profile.colorScheme": "نظام الألوان",
  "profile.colorNeonSunset": "غروب نيون",
  "profile.colorForestGreens": "خضرة الغابة",
  "profile.colorOceanBlues": "زرقة المحيط",
  "profile.bio": "نبذة قصيرة",
  "profile.bioPlaceholder": "أخبرنا قليلاً عن نفسك...",
  "profile.save": "حفظ الملف الشخصي",
  "profile.updated": "تم تحديث الملف الشخصي بنجاح!",
  
  // Vibes taglines
  "vibe.techie": "ابتكار المستقبل بالبرمجة",
  "vibe.artist": "إبداع الجمال في كل لمسة",
  "vibe.explorer": "اكتشاف آفاق جديدة",
  
  // Common
  "common.loading": "جاري التحميل...",
  "common.saving": "جاري الحفظ...",
  
  // Errors
  "error.login": "اسم المستخدم أو كلمة المرور غير صحيحة",
  "error.required": "هذا الحقل مطلوب",
  "error.save": "فشل في حفظ الملف الشخصي",
  "error.auth": "خطأ في المصادقة",
  "error.loginRequired": "يجب تسجيل الدخول للوصول إلى هذه الصفحة",
  "error.invalidEmail": "يرجى إدخال عنوان بريد إلكتروني صالح",
  "error.passwordLength": "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
  "error.invalidCredentials": "بيانات تسجيل الدخول غير صالحة",
  "error.userExists": "المستخدم مسجل بالفعل",
  "error.signup": "فشل في التسجيل. يرجى المحاولة مرة أخرى.",
  "error.emailNotConfirmed": "لم يتم تأكيد البريد الإلكتروني، ولكن يمكنك استخدام التطبيق",
  "error.invalidEmailDomain": "نطاق البريد الإلكتروني غير مسموح به",
  "error.serverError": "خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقًا",
  "error.networkError": "خطأ في الشبكة. يرجى التحقق من اتصالك",
  "error.unknownError": "حدث خطأ غير معروف",
  
  // NotFound Page
  "notFound.message": "الصفحة غير موجودة",
  "notFound.description": "لم نتمكن من العثور على الصفحة التي تبحث عنها.",
  "notFound.backToHome": "العودة إلى الصفحة الرئيسية"
};

const translations: Record<Language, Record<string, string>> = {
  en: enTranslations,
  ar: arTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    return savedLanguage || "en";
  });
  
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  };
  
  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);
  
  const t = (key: string): string => {
    return translations[language][key] || key;
  };
  
  const dir: "ltr" | "rtl" = language === "ar" ? "rtl" : "ltr";
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
