'use client'

import { useParams, usePathname, useRouter } from 'next/navigation'
import { getLocalizedPath, removeLocaleFromPath } from '@/lib/i18n'
import type { Locale } from '@/app/[lang]/dictionaries'

const locales: { code: Locale; label: string }[] = [
  { code: 'tr', label: 'TR' },
  { code: 'en', label: 'EN' },
]

export function LanguageSwitcher() {
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const currentLang = (params?.lang as Locale) || 'tr'

  const handleLanguageChange = (newLang: Locale) => {
    if (newLang === currentLang) return

    // Remove current locale from pathname
    const pathWithoutLocale = removeLocaleFromPath(pathname)
    // Add new locale
    const newPath = getLocalizedPath(pathWithoutLocale, newLang)
    router.push(newPath)
  }

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
  )
}
