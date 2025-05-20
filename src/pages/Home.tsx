
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User, Palette, Globe } from 'lucide-react';

const Home = () => {
  const { t, dir } = useLanguage();
  
  return (
    <div className="container px-4 py-12 mx-auto max-w-7xl" dir={dir}>
      <div className="flex flex-col items-center justify-center text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          {t('home.welcome')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-prose">
          {t('home.tagline')}
        </p>
        <div className="mt-8">
          <Button asChild size="lg">
            <Link to="/login">{t('home.getStarted')}</Link>
          </Button>
        </div>
      </div>
      
      <div className="my-12">
        <h2 className="text-2xl font-bold text-center mb-8">{t('home.features')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="mb-4 flex justify-center">
                <Palette className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('home.feature1')}</h3>
              <p className="text-muted-foreground">
                Customize your profile with different themes and color schemes that match your personality.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="mb-4 flex justify-center">
                <User className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('home.feature2')}</h3>
              <p className="text-muted-foreground">
                Create a personalized profile that represents who you are and what you love.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="mb-4 flex justify-center">
                <Globe className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('home.feature3')}</h3>
              <p className="text-muted-foreground">
                Use the app in your preferred language with complete RTL support for Arabic.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
