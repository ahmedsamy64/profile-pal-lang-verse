
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User, Palette, Globe } from 'lucide-react';

const Home = () => {
  const { t, dir } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10" dir={dir}>
      {/* Hero Section */}
      <div className="container px-4 py-16 mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <div className="inline-block p-2 px-4 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
            ✨ Profile Customizer
          </div>
          
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 leading-tight">
            {t('home.welcome')}
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-xl mx-auto mb-8">
            {t('home.tagline')}
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full shadow-lg hover:shadow-primary/20 transition-all">
              <Link to="/login">{t('home.getStarted')}</Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="container px-4 py-16 mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t('home.features')}</h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="overflow-hidden border-none shadow-xl shadow-primary/5 hover:shadow-primary/10 transition-all bg-card">
            <div className="h-2 bg-gradient-to-r from-techie-primary to-techie-secondary"></div>
            <CardContent className="p-8 text-center">
              <div className="mb-6 flex justify-center">
                <div className="p-4 rounded-full bg-primary/10 text-primary">
                  <Palette className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4">{t('home.feature1')}</h3>
              <p className="text-muted-foreground">
                {t('home.featureDesc1')}
              </p>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-none shadow-xl shadow-primary/5 hover:shadow-primary/10 transition-all bg-card">
            <div className="h-2 bg-gradient-to-r from-artist-primary to-artist-secondary"></div>
            <CardContent className="p-8 text-center">
              <div className="mb-6 flex justify-center">
                <div className="p-4 rounded-full bg-primary/10 text-primary">
                  <User className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4">{t('home.feature2')}</h3>
              <p className="text-muted-foreground">
                {t('home.featureDesc2')}
              </p>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border-none shadow-xl shadow-primary/5 hover:shadow-primary/10 transition-all bg-card">
            <div className="h-2 bg-gradient-to-r from-explorer-primary to-explorer-secondary"></div>
            <CardContent className="p-8 text-center">
              <div className="mb-6 flex justify-center">
                <div className="p-4 rounded-full bg-primary/10 text-primary">
                  <Globe className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4">{t('home.feature3')}</h3>
              <p className="text-muted-foreground">
                {t('home.featureDesc3')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Footer CTA */}
      <div className="container px-4 py-16 mx-auto max-w-7xl">
        <div className="bg-gradient-to-br from-primary/10 to-secondary/20 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            {t('home.welcome')}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('home.tagline')}
          </p>
          <Button asChild size="lg" className="rounded-full">
            <Link to="/login">{t('home.getStarted')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
