
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AutoArtisanLogo } from "@/components/autoartisan-logo";
import { Button } from "@/components/ui/button";
import { Home, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/i18n-context";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        toast({ title: t('logoutSuccessTitle'), description: t('logoutSuccessDesc') });
        router.push('/auth/login');
      } else {
        const data = await response.json();
        toast({ title: t('logoutErrorTitle'), description: data.message || t('logoutErrorDescDefault'), variant: 'destructive' });
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast({ title: t('logoutErrorTitle'), description: t('logoutErrorDescNetwork'), variant: 'destructive' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <header className="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/admin" className="flex items-center gap-2">
            <AutoArtisanLogo className="h-8" />
            <span className="font-semibold text-lg">{t('adminTitle')}</span>
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
          {t('adminFooterText', { year: new Date().getFullYear().toString() })}
        </div>
      </footer>
    </div>
  );
}
