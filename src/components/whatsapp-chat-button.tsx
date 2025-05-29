
"use client";

import React, { useState, useEffect } from 'react';
import { getChatWidgetSettings, type ChatWidgetSettings, DEFAULT_CHAT_WIDGET_SETTINGS } from '@/lib/data';
import { useLanguage } from '@/contexts/i18n-context';
import { Loader2 } from 'lucide-react'; // Import Loader2 for loading state
import Image from 'next/image'; // For custom icon URL if it's an external image optimized by Next

// Default WhatsApp SVG Icon (Path only, fill will be 'currentColor')
const DefaultWhatsAppSvg = ({ size }: { size: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    fill="currentColor"
    style={{ width: `${size}px`, height: `${size}px` }}
    aria-hidden="true"
  >
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 .3h-.1c-70.7 0-130.4 57.2-130.4 130.4 0 24.4 6.9 48.2 19.9 68.7L70.2 428.9l68.5-18.4c19.7 11.9 42.9 18.2 67.1 18.2h.1c70.7 0 130.4-57.2 130.4-130.4 0-73.2-59.7-130.4-130.5-130.4zM301.5 319.1c-1.3-2.1-4.8-3.4-10.3-6.2s-32.4-16-37.4-17.8c-5-1.8-8.7-2.7-12.3 2.7s-14.1 17.8-17.3 21.5c-3.2 3.7-6.4 4.2-11.8 1.4s-23.1-8.5-44-27.1c-16.3-14.4-27.4-32.2-32.1-37.8s-.9-8.7 1.8-11.4c2.4-2.4 5.3-6.2 8-8.2s3.7-3.7 5.5-6.2c1.8-2.4.9-4.7-.4-6.2s-12.3-29.6-16.9-40.4c-4.6-10.8-9.3-9.3-12.9-9.5s-7.3-.2-11.1-.2h-3.3c-3.7 0-9.7 1.4-14.8 6.9s-19.1 18.6-19.1 45.3c0 26.7 19.5 52.5 22.3 56.2 2.8 3.7 38.3 58.4 93.5 81.6 13.8 5.8 24.8 9.3 33.2 11.9 11.8 3.7 22.7 3.1 31.2 1.8s28.7-11.8 32.8-23.1c4.1-11.3 4.1-20.8 2.8-23.1z"/>
  </svg>
);

export function WhatsAppChatButton() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<ChatWidgetSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      setIsLoading(true);
      try {
        const fetchedSettings = await getChatWidgetSettings();
        setSettings(fetchedSettings);
      } catch (error) {
        console.error("Error fetching chat widget settings:", error);
        setSettings(DEFAULT_CHAT_WIDGET_SETTINGS); // Fallback to defaults on error
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  if (isLoading) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="rounded-full w-14 h-14 p-0 shadow-lg bg-muted flex items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!settings || !settings.isChatEnabled || !settings.phoneNumber) {
    return null; // Don't render if chat is disabled or no phone number
  }

  const { customIconUrl, iconSize, phoneNumber, defaultMessage } = settings;
  
  const whatsappLink = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(defaultMessage || t('chatButtonDefaultMessage'))}`;
  
  const displayIconSize = iconSize || DEFAULT_CHAT_WIDGET_SETTINGS.iconSize; // Ensure there's a fallback size

  const renderIcon = () => {
    if (customIconUrl) {
      // For next/image, ensure the hostname is whitelisted in next.config.js if it's an external URL
      // Using a simple <img> tag here for more flexibility with arbitrary URLs from admin,
      // as whitelisting all possible hostnames for next/image can be cumbersome.
      return (
        <img 
          src={customIconUrl} 
          alt={t('chatButtonLabel')} 
          style={{ width: `${displayIconSize}px`, height: `${displayIconSize}px`, objectFit: 'contain' }}
          onError={(e) => { 
            console.warn(`Failed to load custom chat icon: ${customIconUrl}`);
            // Optionally fallback to default icon if custom one fails to load by re-rendering
            // This would require a state change, e.g. setCustomIconFailed(true)
            // For simplicity, we let it show the browser's broken image icon for now.
            (e.target as HTMLImageElement).style.display = 'none'; // Hide broken image
             // A more robust solution would be to render the default SVG here
          }}
        />
      );
    }
    return <DefaultWhatsAppSvg size={displayIconSize} />;
  };

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label={t('chatButtonLabel')}
    >
      <div
        className="rounded-full w-14 h-14 p-0 shadow-lg hover:scale-105 transition-transform flex items-center justify-center bg-green-500 hover:bg-green-600 text-white"
        aria-hidden="true"
      >
        {renderIcon()}
      </div>
    </a>
  );
}

    