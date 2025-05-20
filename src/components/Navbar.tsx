
import { Link } from 'react-router-dom';
import { Globe, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const { isAuthenticated, logout, user, isLoading } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  
  const handleLogout = async () => {
    console.log("Logout button clicked");
    await logout();
  };
  
  return (
    <nav className="border-b w-full py-4 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          {t('app.title')}
        </Link>
        
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('en')}>
                <span className={language === 'en' ? 'font-bold' : ''}>English</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('ar')}>
                <span className={language === 'ar' ? 'font-bold' : ''}>العربية</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {isLoading ? (
            <Button variant="ghost" disabled>
              Loading...
            </Button>
          ) : isAuthenticated ? (
            <>
              <Button variant="ghost" asChild>
                <Link to="/my-profile">
                  <User className="h-4 w-4 mr-2" />
                  {user?.email || t('nav.profile')}
                </Link>
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLogout} 
                disabled={isLoading}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t('nav.logout')}
              </Button>
            </>
          ) : (
            <Button variant="default" asChild>
              <Link to="/login">{t('nav.login')}</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
