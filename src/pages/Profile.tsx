
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const { t, dir } = useLanguage();
  const { user } = useAuth();
  
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
    <div className="container px-4 py-8 mx-auto" dir={dir}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('profile.name')}</Label>
                  <Input
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    placeholder={t('profile.namePlaceholder')}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="vibe">{t('profile.vibe')}</Label>
                  <Select
                    value={profileData.vibe}
                    onValueChange={(value) => handleSelectChange('vibe', value)}
                  >
                    <SelectTrigger id="vibe">
                      <SelectValue placeholder={t('profile.vibe')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="techie">{t('profile.vibeTechie')}</SelectItem>
                      <SelectItem value="artist">{t('profile.vibeArtist')}</SelectItem>
                      <SelectItem value="explorer">{t('profile.vibeExplorer')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="colorScheme">{t('profile.colorScheme')}</Label>
                  <Select
                    value={profileData.colorScheme}
                    onValueChange={(value) => handleSelectChange('colorScheme', value)}
                  >
                    <SelectTrigger id="colorScheme">
                      <SelectValue placeholder={t('profile.colorScheme')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="neonSunset">{t('profile.colorNeonSunset')}</SelectItem>
                      <SelectItem value="forestGreens">{t('profile.colorForestGreens')}</SelectItem>
                      <SelectItem value="oceanBlues">{t('profile.colorOceanBlues')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">{t('profile.bio')}</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    placeholder={t('profile.bioPlaceholder')}
                    rows={4}
                  />
                </div>
                
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? t('common.saving') : t('profile.save')}
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
              borderColor: themeStyles.accent,
              borderWidth: '2px',
            }} 
            className="h-full flex flex-col"
          >
            <CardHeader className="text-center">
              <div className="text-6xl mb-2">{vibeIcons[profileData.vibe]}</div>
              <CardTitle className="text-2xl" style={{ color: themeStyles.accent }}>
                {profileData.name || t('profile.namePlaceholder')}
              </CardTitle>
              <div className="mt-2 text-sm opacity-80">
                {t(`vibe.${profileData.vibe}`)}
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
              <div className="bg-black bg-opacity-20 p-4 rounded-lg my-4">
                {profileData.bio || t('profile.bioPlaceholder')}
              </div>
              
              <div className="mt-auto text-sm opacity-70 text-center pt-4">
                @{user?.email?.split('@')[0] || 'username'} · {new Date().toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
