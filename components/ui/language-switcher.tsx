'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/use-language';
import type { Locale } from '@/lib/dictionaries';

const COOKIE_NAME = 'NEXT_LOCALE';
const locales: { code: Locale; label: string }[] = [
  { code: 'tr', label: 'TR' },
  { code: 'en', label: 'EN' },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const currentLang = useLanguage();
  const [pendingLang, setPendingLang] = useState<Locale | null>(null);

  useEffect(() => {
    if (!pendingLang || pendingLang === currentLang) return;

    if (typeof document !== 'undefined') {
      // Cookie'yi effect içinde güncelle (lint için güvenli)
      document.cookie = `${COOKIE_NAME}=${pendingLang}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('language-change'));
    }

    // URL değişmeden dili uygulamak için sayfayı yenile
    router.refresh();
  }, [pendingLang, currentLang, router]);

  const handleLanguageChange = (newLang: Locale) => {
    if (newLang === currentLang) return;
    setPendingLang(newLang);
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white p-1">
      {locales.map((locale) => (
        <button
          key={locale.code}
          onClick={() => handleLanguageChange(locale.code)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            currentLang === locale.code
              ? 'bg-gray-900 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {locale.label}
        </button>
      ))}
    </div>
  );
}
