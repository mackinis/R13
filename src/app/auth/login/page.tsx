
"use client";

import { useState, type FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AutoArtisanLogo } from '@/components/autoartisan-logo';
import Link from 'next/link';
import { useLanguage } from '@/contexts/i18n-context';
import { auth } from '@/lib/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import type { StoreSettings } from '@/lib/data';
import { getStoreSettings } from '@/lib/data';
import { Loader2 } from 'lucide-react';


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getStoreSettings();
        setStoreSettings(settings);
      } catch (error) {
        console.error("Failed to fetch store settings for login page:", error);
      }
    };
    fetchSettings();
  }, []);


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    console.log('[LoginPage] Submitting login form with Firebase Auth...');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('[LoginPage] Firebase sign-in successful.');
      toast({ title: t('loginSuccessTitle'), description: t('loginSuccessDescPanelRedirect') });
      
      console.log(`[LoginPage] Attempting to redirect to: /panel`);
      // Add a small delay to allow Firebase auth state to propagate if needed
      setTimeout(() => {
        console.log(`[LoginPage] Executing router.push('/panel') now.`);
        router.push('/panel');
      }, 300);

    } catch (error: any) {
      let errorMessage = t('loginErrorDescDefault');
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            errorMessage = t('loginErrorDescInvalidCredentials');
            break;
          case 'auth/invalid-email':
            errorMessage = t('contactFormErrorEmailInvalid');
            break;
          case 'auth/too-many-requests':
            errorMessage = t('loginErrorDescTooManyRequests');
            break;
          default:
            errorMessage = t('loginErrorDescFirebase', { code: error.code, message: error.message });
        }
      } else if (error instanceof Error && error.message.includes('fetch')) {
         errorMessage = t('loginErrorDescNetwork');
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error('[LoginPage] Login error caught in outer try-catch:', error);
      toast({
        title: t('loginErrorTitle'),
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <AutoArtisanLogo storeSettings={storeSettings ?? undefined} width={190} height={40} />
          </div>
          <CardTitle className="text-2xl">{t('loginPageTitle')}</CardTitle>
          <CardDescription>
            {t('loginPageSubtitlePanel', { storeName: storeSettings?.storeName || t('defaultStoreName') })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">{t('emailLabel')}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('passwordLabel')}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : t('loginButton')}
            </Button>
          </form>
        </CardContent>
         <CardFooter className="flex-col items-center text-sm">
           <p className="text-muted-foreground">
            {t('forgotPasswordPrompt')}{' '}
            <Link href="#" className="text-primary hover:underline">
              {t('contactSupportLink')}
            </Link>
          </p>
           <Link href="/" className="mt-4 text-primary hover:underline">
              {t('backToSiteLink')}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
