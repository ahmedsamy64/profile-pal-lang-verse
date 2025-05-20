
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserCheck, Save, Palette, UserIcon, RefreshCw } from 'lucide-react';

type VibeType = 'techie' | 'artist' | 'explorer';
type ColorSchemeType = 'neonSunset' | 'forestGreens' | 'oceanBlues';

interface ProfileData {
  name: string;
  vibe: VibeType;
  colorScheme: ColorSchemeType;
  bio: string;
}

interface ThemeStyles {
  backgroundColor: string;
  color: string;
  accent: string;
}

const vibeIcons: Record<VibeType, string> = {
  techie: '💻',
  artist: '🎨',
  explorer: '🧭',
};

const Profile = () => {
  const { t, dir, language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    vibe: 'techie',
    colorScheme: 'neonSunset',
    bio: '',
  });
  
  // Load profile data from Supabase on component mount
  useEffect(() => {
    if (!user) return;
    
    const loadProfileData = async () => {
      setIsLoading(true);
      try {
        // Fetch profile data from Supabase
        const { data, error } = await supabase
          .from('profiles')
          .select('name, vibe, color_scheme, bio')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }
        
        if (data) {
          setProfileData({
            name: data.name || '',
            vibe: (data.vibe as VibeType) || 'techie',
            colorScheme: (data.color_scheme as ColorSchemeType) || 'neonSunset',
            bio: data.bio || '',
          });
        }
      } catch (error) {
        console.error('Failed to load profile data', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfileData();
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: t('error.auth'),
        description: t('error.loginRequired'),
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Save to Supabase
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: profileData.name,
          vibe: profileData.vibe,
          color_scheme: profileData.colorScheme,
          bio: profileData.bio,
          updated_at: new Date().toISOString(),
        });
        
      if (error) throw error;
      
      toast({
        title: t('profile.updated'),
        description: new Date().toLocaleTimeString(),
      });
    } catch (error) {
      console.error('Failed to save profile', error);
      toast({
        title: t('error.save'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Determine styles based on selected vibe and color scheme
  const getThemeStyles = (): ThemeStyles => {
    let styles: ThemeStyles = {
      backgroundColor: '',
      color: '',
      accent: '',
    };
    
    // Apply color scheme
    switch (profileData.colorScheme) {
      case 'neonSunset':
        styles = {
          backgroundColor: 'rgb(26, 31, 44)',
          color: 'white',
          accent: 'rgb(254, 198, 161)',
        };
        break;
      case 'forestGreens':
        styles = {
          backgroundColor: 'rgb(34, 34, 34)',
          color: 'white',
          accent: 'rgb(242, 252, 226)',
        };
        break;
      case 'oceanBlues':
        styles = {
          backgroundColor: 'rgb(26, 31, 44)',
          color: 'white',
          accent: 'rgb(14, 165, 233)',
        };
        break;
    }
    
    return styles;
  };
  
  const themeStyles = getThemeStyles();
  
  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl" dir={dir}>
      {/* Authentication Status Banner */}
      <div className="mb-8">
        <Card className={`overflow-hidden transition-all border-0 shadow-md ${isAuthenticated ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' : 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20'}`}>
          <CardContent className="p-5 flex items-center gap-3">
            <div className={`rounded-full flex items-center justify-center h-10 w-10 ${isAuthenticated ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'}`}>
              <UserCheck className="h-5 w-5" />
            </div>
            <div className="flex-1">
              {isAuthenticated ? (
                <>
                  <p className="font-medium text-lg">
                    {t('profile.authenticatedAs')}:
                    <span className="ml-1 font-semibold">{user?.email}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {user?.email_confirmed_at 
                      ? t('profile.emailVerified') 
                      : t('profile.emailNotVerified')}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-medium text-lg">
                    {t('profile.notAuthenticated')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('error.loginRequired')}
                  </p>
                </>
              )}
            </div>
            <Badge variant="outline" className={`ml-auto py-1.5 px-3 ${isAuthenticated ? 'bg-green-100 text-green-800 dark:bg-green-800/40 dark:text-green-200 border-green-200 dark:border-green-700' : 'bg-amber-100 text-amber-800 dark:bg-amber-800/40 dark:text-amber-200 border-amber-200 dark:border-amber-700'}`}>
              {isAuthenticated ? t('profile.authenticated') : t('profile.guest')}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Form */}
        <div>
          <Card className="shadow-md border border-border/40 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary/80 to-indigo-500"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-primary" />
                {t('profile.title')}
              </CardTitle>
              <CardDescription>{t('profile.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">{t('profile.name')}</Label>
                  <Input
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    placeholder={t('profile.namePlaceholder')}
                    required
                    dir={dir}
                    className="input-focus-ring"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="vibe" className="text-sm font-medium">{t('profile.vibe')}</Label>
                  <Select
                    value={profileData.vibe}
                    onValueChange={(value) => handleSelectChange('vibe', value)}
                    dir={dir}
                  >
                    <SelectTrigger id="vibe" className="input-focus-ring">
                      <SelectValue placeholder={t('profile.vibe')} />
                    </SelectTrigger>
                    <SelectContent dir={dir}>
                      <SelectItem value="techie">{t('profile.vibeTechie')}</SelectItem>
                      <SelectItem value="artist">{t('profile.vibeArtist')}</SelectItem>
                      <SelectItem value="explorer">{t('profile.vibeExplorer')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="colorScheme" className="text-sm font-medium">{t('profile.colorScheme')}</Label>
                  <Select
                    value={profileData.colorScheme}
                    onValueChange={(value) => handleSelectChange('colorScheme', value)}
                    dir={dir}
                  >
                    <SelectTrigger id="colorScheme" className="input-focus-ring">
                      <SelectValue placeholder={t('profile.colorScheme')} />
                    </SelectTrigger>
                    <SelectContent dir={dir}>
                      <SelectItem value="neonSunset">{t('profile.colorNeonSunset')}</SelectItem>
                      <SelectItem value="forestGreens">{t('profile.colorForestGreens')}</SelectItem>
                      <SelectItem value="oceanBlues">{t('profile.colorOceanBlues')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm font-medium">{t('profile.bio')}</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    placeholder={t('profile.bioPlaceholder')}
                    rows={4}
                    dir={dir}
                    className="resize-none input-focus-ring"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full relative overflow-hidden group"
                >
                  <span className="absolute inset-0 w-3 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 group-hover:animate-[shimmer_1s_ease-in-out_infinite] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="relative flex items-center justify-center gap-2">
                    {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {isLoading ? t('common.loading') : t('profile.save')}
                  </span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        {/* Preview Profile */}
        <div>
          <Card 
            style={{ 
              backgroundColor: themeStyles.backgroundColor, 
              color: themeStyles.color,
              boxShadow: `0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 4px 10px -5px rgba(0, 0, 0, 0.1)`
            }} 
            className="h-full flex flex-col relative overflow-hidden border-0"
          >
            <div className="absolute top-0 right-0 left-0 h-32 bg-gradient-to-b from-black/30 to-transparent"></div>
            <CardHeader className="text-center pt-10 relative z-10">
              <div className="text-6xl mb-2">{vibeIcons[profileData.vibe]}</div>
              <CardTitle className="text-3xl font-bold" style={{ color: themeStyles.accent }}>
                {profileData.name || t('profile.namePlaceholder')}
              </CardTitle>
              <div className="mt-2 text-sm opacity-80">
                {t(`vibe.${profileData.vibe}`)}
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between p-6">
              <div 
                className="bg-black/20 backdrop-blur-sm p-6 rounded-lg my-4 border border-opacity-20"
                style={{ borderColor: themeStyles.accent }} 
                dir={dir}
              >
                <div 
                  className="text-lg font-medium mb-2 flex items-center gap-2"
                  style={{ color: themeStyles.accent }}
                >
                  <Palette className="h-4 w-4" />
                  {t('profile.bio')}
                </div>
                <p className="text-base leading-relaxed">
                  {profileData.bio || t('profile.bioPlaceholder')}
                </p>
              </div>
              
              <div className="mt-auto text-sm text-center pt-4 opacity-70 flex flex-col gap-1">
                <div 
                  className="backdrop-blur-sm py-2 px-4 rounded-full mx-auto inline-block"
                  style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
                >
                  @{user?.email?.split('@')[0] || 'username'}
                </div>
                <div>{new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : undefined)}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
