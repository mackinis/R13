
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AutoArtisanLogo } from "@/components/autoartisan-logo";
import { Button } from "@/components/ui/button";
import { Home, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/i18n-context";
import { auth } from '@/lib/firebaseConfig';
import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import type { StoreSettings } from '@/lib/data';
import { getStoreSettings } from '@/lib/data';


export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoadingSettings(true);
        const settings = await getStoreSettings();
        setStoreSettings(settings);
      } catch (error) {
        console.error("Failed to fetch store settings for panel layout:", error);
      } finally {
        setIsLoadingSettings(false);
      }
    };
    fetchSettings();
  }, []);

  const handleLogout = async () => {
    console.log('[PanelLayout] Attempting logout...');
    try {
      await signOut(auth);
      console.log('[PanelLayout] Firebase client-side signOut successful.');
      toast({ title: t('logoutSuccessTitle'), description: t('logoutSuccessDesc') });
    } catch (error: any) {
      console.error('[PanelLayout] Firebase signOut error:', error);
      let errorMessage = t('logoutErrorDescFirebase', { code: error.code || 'UNKNOWN', message: error.message || 'Unknown error' });
      toast({ title: t('logoutErrorTitle'), description: errorMessage, variant: 'destructive' });
    } finally {
      router.push('/auth/login');
    }
  };

  const displayStoreName = isLoadingSettings ? t('loadingStoreSettings') : (storeSettings?.storeName || t('adminPanelTitle'));


  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <header className="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/panel" className="flex items-center gap-2">
            <AutoArtisanLogo storeSettings={storeSettings ?? undefined} />
            <span className="font-semibold text-lg">{displayStoreName}</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" passHref>
              <Button variant="outline" size="sm">
                <Home className="h-4 w-4 mr-2" />
                {t('viewSiteButton')}
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              {t('logoutButton')}
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-grow p-4 md:p-6 lg:p-8">{children}</main>
      <footer className="border-t bg-background py-4">
        <div className="container text-center text-sm text-muted-foreground">
          {t('adminFooterText', { storeName: displayStoreName, year: new Date().getFullYear().toString() })}
        </div>
      </footer>
    </div>
  );
}
