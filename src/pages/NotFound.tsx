
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Home, AlertCircle } from 'lucide-react';

const NotFound = () => {
  const { t, dir } = useLanguage();
  
  return (
    <div 
      className="container flex items-center justify-center min-h-[80vh] px-4" 
      dir={dir}
      style={{ 
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(var(--primary) / 0.03), transparent 70%)'
      }}
    >
      <div className="text-center max-w-md mx-auto">
        <div className="inline-flex items-center justify-center p-4 bg-muted/50 rounded-full mb-6">
          <AlertCircle className="h-10 w-10 text-muted-foreground/70" />
        </div>
        <h1 className="text-6xl font-bold mb-3 text-foreground/90">404</h1>
        <p className="text-xl mb-8 text-muted-foreground">
          {t('notFound.message') || 'Page not found'}
        </p>
        <p className="text-muted-foreground mb-8">
          {t('notFound.description') || "We couldn't find the page you were looking for."}
        </p>
        <Button 
          asChild
          size="lg"
          className="gap-2"
        >
          <Link to="/">
            <Home className="h-4 w-4" />
            {t('notFound.backToHome') || 'Back to home'}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
