
"use client"; 

import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { AutoArtisanLogo } from '@/components/autoartisan-logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogIn } from 'lucide-react'; 
import { LanguageSwitcher } from '@/components/language-switcher';
import { useLanguage } from '@/contexts/i18n-context';
import type { StoreSettings } from '@/lib/data';

interface HeaderProps {
  storeSettings: StoreSettings | null;
}

export function Header({ storeSettings }: HeaderProps) {
  const { t } = useLanguage();

  const navItems = [
    { href: '/', label: t('navHome') },
    { href: '/cars', label: t('navAllCars') },
    { href: '/contact', label: t('navContact') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <AutoArtisanLogo storeSettings={storeSettings ?? undefined} />
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Mobile Menu */}
        <div className="md:hidden flex items-center">
           <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">{t('toggleMenuSrOnly')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Link href="/" className="mb-6 flex items-center">
                 <AutoArtisanLogo storeSettings={storeSettings ?? undefined} />
              </Link>
              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
                {/* Login icon for mobile menu is also removed to enforce access via /panel attempt */}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="flex-1 flex justify-center md:hidden">
            <Link href="/" className="flex items-center space-x-2">
              <AutoArtisanLogo storeSettings={storeSettings ?? undefined} />
            </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          {/* Login icon button removed from desktop header as well */}
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
