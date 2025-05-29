
"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import type { StoreSettings } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/i18n-context'; // Import useLanguage

interface AutoArtisanLogoProps {
  className?: string;
  storeSettings?: StoreSettings | null;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  [key: string]: any; // Allow other SVG or Image props
}

export function AutoArtisanLogo(props: AutoArtisanLogoProps) {
  const { 
    className, 
    storeSettings: propStoreSettings, 
    width: propWidth, 
    height: propHeight, 
    style: passedStyle, // Capture style separately
    ...restOfSvgProps 
  } = props;
  const { t } = useLanguage(); // Get t function

  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Initialize with propStoreSettings to avoid hydration issues if possible on initial server render
  const initialLogoUrl = propStoreSettings?.logoUrl;
  const [effectiveLogoUrl, setEffectiveLogoUrl] = useState<string | undefined>(initialLogoUrl);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && propStoreSettings) {
      const currentClientTheme = theme === 'system' ? systemTheme : theme;
      const newLogoUrl = (currentClientTheme === 'dark' && propStoreSettings.logoUrlDark) 
        ? propStoreSettings.logoUrlDark 
        : propStoreSettings.logoUrl;
      
      if (newLogoUrl !== effectiveLogoUrl) { // Only update if it actually changes
        setEffectiveLogoUrl(newLogoUrl);
        setHasError(false); // Reset error if URL changes
      }
    } else if (propStoreSettings && propStoreSettings.logoUrl !== effectiveLogoUrl) {
      // This handles initial prop set if it differs from default state
      setEffectiveLogoUrl(propStoreSettings.logoUrl);
      setHasError(false);
    } else if (!propStoreSettings) {
      setEffectiveLogoUrl(undefined); // No settings, no image
    }
  }, [mounted, theme, systemTheme, propStoreSettings, effectiveLogoUrl]);


  const displayWidth = Number(propWidth) || 190; 
  const displayHeight = Number(propHeight) || 40;
  const nameToDisplay = propStoreSettings?.storeName || t('defaultStoreName');

  if (effectiveLogoUrl && !hasError) {
    return (
      <Image
        key={effectiveLogoUrl} 
        src={effectiveLogoUrl}
        alt={t('logoAltText', { storeName: nameToDisplay })}
        width={displayWidth} 
        height={displayHeight}
        className={cn("object-contain", className)}
        style={{ width: `${displayWidth}px`, height: `${displayHeight}px`, ...passedStyle }} 
        onError={() => {
          console.warn(`Failed to load logo: ${effectiveLogoUrl}`);
          setHasError(true);
        }}
        priority 
        sizes={`${displayWidth}px`} 
      />
    );
  }

  // Fallback SVG rendering
  return (
    <svg
      width={displayWidth}
      height={displayHeight}
      viewBox={`0 0 ${displayWidth} ${displayHeight * 0.95}`} // Adjusted viewBox
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={passedStyle} // Apply the passed style here
      {...restOfSvgProps} // Spread other valid SVG props
    >
      {/* Simple fallback 'A' shape or similar */}
      <path d={`M${displayWidth*0.05} ${displayHeight*0.8} L${displayWidth*0.15} ${displayHeight*0.2} L${displayWidth*0.25} ${displayHeight*0.8} M${displayWidth*0.1} ${displayHeight*0.6} H${displayWidth*0.2}`} stroke="hsl(var(--primary))" strokeWidth="3" />
      <text x={displayWidth*0.3} y={displayHeight*0.65} fontFamily="var(--font-geist-sans), Arial, sans-serif" fontSize={displayHeight*0.5} className="fill-foreground font-semibold">
        {nameToDisplay}
      </text>
    </svg>
  );
}
