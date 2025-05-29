
"use client";

import { getFooterContent, type FooterConfig, type StoreSettings } from '@/lib/data';
import Link from 'next/link';
import { Facebook, Instagram, Mail, Phone, MapPin, Loader2, Youtube } from 'lucide-react';
import { AutoArtisanLogo } from '../autoartisan-logo';
import { useLanguage } from '@/contexts/i18n-context';
import { useEffect, useState } from 'react';
import type React from 'react';

// Custom SVG for X icon
const XIcon = ({ size = 24, className }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-label="X social media icon"
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

// Improved Custom SVG for YouTube icon
const YouTubeIcon = ({ size = 24, className }: { size?: number; className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    aria-label="YouTube social media icon"
  >
    <path d="M21.582,6.186 C21.327,5.281 20.719,4.673 19.814,4.418 C18.283,4 12,4 12,4 C12,4 5.717,4 4.186,4.418 C3.281,4.673 2.673,5.281 2.418,6.186 C2,7.717 2,12 2,12 C2,12 2,16.283 2.418,17.814 C2.673,18.719 3.281,19.327 4.186,19.582 C5.717,20 12,20 12,20 C12,20 18.283,20 19.814,19.582 C20.719,19.327 21.327,18.719 21.582,17.814 C22,16.283 22,12 22,12 C22,12 22,7.717 21.582,6.186 Z M10,15.464 L10,8.536 L16,12 L10,15.464 Z" />
  </svg>
);


const iconMap: Record<string, React.ElementType> = {
  Facebook: Facebook,
  Instagram: Instagram,
  X: XIcon,
  Twitter: XIcon, // For potential legacy entries or if admin uses "Twitter"
  YouTube: Youtube,
};

interface FooterProps {
  storeSettings: StoreSettings | null;
}

export function Footer({ storeSettings }: FooterProps) {
  const { t } = useLanguage();
  const [config, setConfig] = useState<FooterConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const fetchedConfig = await getFooterContent();
        setConfig(fetchedConfig);
      } catch (error) {
        console.error("Error fetching footer config:", error);
        setConfig({
          copyrightText: `${new Date().getFullYear()} ${storeSettings?.storeName || t('defaultStoreName')}`,
          socialLinks: [],
          contactInfo: {
            address: t('siteContactAddress'),
            phone: t('siteContactPhone'),
            email: t('siteContactEmail'),
            mapQuery: t('siteContactAddress')
          }
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [t, storeSettings?.storeName]);

  if (loading) {
    return (
      <footer className="bg-secondary/50 text-secondary-foreground border-t">
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-2 text-muted-foreground">Loading footer...</p>
        </div>
      </footer>
    );
  }

  const siteContactEmail = config?.contactInfo?.email || t('siteContactEmail');
  const siteContactPhone = config?.contactInfo?.phone || t('siteContactPhone');
  const siteContactAddress = config?.contactInfo?.address || t('siteContactAddress');
  
  const coreCopyrightText = config?.copyrightText || `${new Date().getFullYear()} ${storeSettings?.storeName || t('defaultStoreName')}`;
  const fullCopyrightText = `© ${coreCopyrightText}. ${t('footerAllRightsReserved')}`;
  
  const socialLinks = config?.socialLinks || [];


  return (
    <footer className="bg-secondary/50 text-secondary-foreground border-t">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">

          <div className="mb-8 md:mb-0 flex items-center justify-center">
            <Link href="/" className="inline-block">
              <AutoArtisanLogo storeSettings={storeSettings} width={280} height={70} />
            </Link>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">{t('footerQuickLinks')}</h3>
            <ul className="space-y-2">
              <li><Link href="/cars" className="hover:text-primary transition-colors">{t('navAllCars')}</Link></li>
              <li><Link href="/#about" className="hover:text-primary transition-colors">{t('footerAboutUsLink')}</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">{t('navContact')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">{t('contactUsButton')}</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Mail size={16} className="mr-2 text-primary" />
                <a href={`mailto:${siteContactEmail}`} className="hover:text-primary transition-colors">{siteContactEmail}</a>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2 text-primary" />
                <a href={`tel:${siteContactPhone.replace(/\D/g, '')}`} className="hover:text-primary transition-colors">{siteContactPhone}</a>
              </li>
               <li className="flex items-start">
                <MapPin size={16} className="mr-2 mt-1 text-primary flex-shrink-0" />
                <span className="whitespace-pre-line">{siteContactAddress}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">{t('footerFollowUs')}</h3>
            {socialLinks.length > 0 ? (
              <div className="flex space-x-4">
                {socialLinks.map((link) => {
                  const IconComponent = iconMap[link.platform] || null;
                  return (
                    <Link key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer"
                       className="text-muted-foreground hover:text-primary transition-colors"
                       aria-label={link.platform}
                    >
                      {IconComponent ? <IconComponent size={24} /> : <span>{link.platform}</span>}
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t('noSocialLinksConfigured')}</p>
            )}
          </div>

        </div>
        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">{fullCopyrightText}</p>
        </div>
      </div>
    </footer>
  );
}
