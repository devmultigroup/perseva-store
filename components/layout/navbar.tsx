'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { mainNav } from '@/config/navigation';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { getLocalizedPath } from '@/lib/i18n';
import { useLanguage } from '@/hooks/use-language';
import { useAuthContext } from '@/store/auth-context';
import { createClient } from '@/lib/supabase/client';
import { revalidateAuth } from '@/lib/actions/auth';

export function Navbar() {
  const router = useRouter();
  const lang = useLanguage();
  const { user, loading } = useAuthContext();

  const labels =
    lang === 'en'
      ? {
          home: 'Home',
          products: 'Products',
          categories: 'Categories',
          cart: 'Cart',
          login: 'Sign In',
          logout: 'Sign Out',
        }
      : {
          home: 'Ana Sayfa',
          products: 'Ürünler',
          categories: 'Kategoriler',
          cart: 'Sepet',
          login: 'Giriş Yap',
          logout: 'Çıkış Yap',
        };

  const getNavTitle = (href: string) => {
    switch (href) {
      case '/':
        return labels.home;
      case '/products':
        return labels.products;
      case '/categories':
        return labels.categories;
      default:
        return href;
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    await revalidateAuth();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:changed'));
    }
    router.push(getLocalizedPath('/'));
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href={getLocalizedPath('/')}
          className="text-2xl font-bold text-gray-900"
        >
          Perseva Store
        </Link>

        <nav className="flex items-center gap-6">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={getLocalizedPath(item.href)}
              className="text-sm font-medium text-gray-900 transition-colors hover:text-gray-600"
            >
              {getNavTitle(item.href)}
            </Link>
          ))}

          <Link
            href={getLocalizedPath('/cart')}
            className="ml-4 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            {labels.cart}
          </Link>

          {!loading && !user && (
            <Link
              href={getLocalizedPath('/login')}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100"
            >
              {labels.login}
            </Link>
          )}
          {!loading && user && (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100"
            >
              {labels.logout}
            </button>
          )}

          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
