'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { mainNav } from '@/config/navigation';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { getLocalizedPath } from '@/lib/i18n';
import type { Locale } from '@/app/[lang]/dictionaries';
import { useAuthContext } from '@/store/auth-context';
import { logout } from '@/lib/actions/auth';

export function Navbar() {
  const params = useParams();
  const lang = (params?.lang as Locale) || 'tr';
  const { user, loading } = useAuthContext();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href={getLocalizedPath('/', lang)}
          className="text-2xl font-bold text-gray-900"
        >
          Perseva Store
        </Link>

        <nav className="flex items-center gap-6">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={getLocalizedPath(item.href, lang)}
              className="text-sm font-medium text-gray-900 transition-colors hover:text-gray-600"
            >
              {item.title}
            </Link>
          ))}

          <Link
            href={getLocalizedPath('/cart', lang)}
            className="ml-4 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Sepet
          </Link>

          {!loading && user && (
            <form action={logout}>
              <button
                type="submit"
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100"
              >
                Logout
              </button>
            </form>
          )}

          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
