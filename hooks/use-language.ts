'use client';

import { useEffect, useState } from 'react';
import type { Locale } from '@/lib/dictionaries';

const COOKIE_NAME = 'NEXT_LOCALE';
const DEFAULT_LOCALE: Locale = 'tr';

/**
 * Client-side hook to get current language from cookies.
 * İlk render'da varsayılan 'tr', sonra effect ile cookie'den güncellenir.
 * Böylece SSR ve ilk client render aynı kalır, hydration hatası olmaz.
 */
export function useLanguage(): Locale {
  const [lang, setLang] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const readCookie = () => {
      if (typeof document === 'undefined') return;

      const cookieValue = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${COOKIE_NAME}=`))
        ?.split('=')[1];

      if (cookieValue === 'tr' || cookieValue === 'en') {
        setLang(cookieValue);
      }
    };

    readCookie();

    const handleLanguageChange = () => {
      readCookie();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('language-change', handleLanguageChange);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('language-change', handleLanguageChange);
      }
    };
  }, []);

  return lang;
}
