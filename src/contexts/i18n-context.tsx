
"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { en } from '@/locales/en';
import { es } from '@/locales/es';

type Locale = 'en' | 'es';
type Translations = typeof en; // Assuming 'en' has all keys

interface LanguageContextType {
  language: Locale;
  setLanguage: (language: Locale) => void;
  t: (key: keyof Translations, params?: Record<string, string | number>) => string;
  translations: Translations;
}

const translationsMap: Record<Locale, Translations> = {
  en,
  es,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Locale>('es'); // Default to Spanish

  useEffect(() => {
    // You could also try to detect browser language or load from localStorage here
    const storedLang = localStorage.getItem('app-lang') as Locale | null;
    if (storedLang && (storedLang === 'en' || storedLang === 'es')) {
      setLanguageState(storedLang);
    }
  }, []);

  const setLanguage = useCallback((lang: Locale) => {
    setLanguageState(lang);
    localStorage.setItem('app-lang', lang);
  }, []);

  const t = useCallback((key: keyof Translations, params?: Record<string, string | number>): string => {
    let text = translationsMap[language][key] || translationsMap['en'][key] || String(key); // Fallback to key if not found
    if (params) {
      Object.keys(params).forEach(paramKey => {
        text = text.replace(new RegExp(`{${paramKey}}`, 'g'), String(params[paramKey]));
      });
    }
    return text;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations: translationsMap[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

