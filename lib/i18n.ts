import type { Locale } from '@/app/[lang]/dictionaries';

/**
 * Creates a locale-aware path
 * @param path - Path without locale (e.g., '/products')
 * @param locale - Current locale (e.g., 'tr' or 'en')
 * @returns Locale-aware path (e.g., '/tr/products' or '/en/products')
 */
export function getLocalizedPath(path: string, locale: Locale): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `/${locale}/${cleanPath}`;
}

/**
 * Removes locale from path
 * @param path - Path with locale (e.g., '/tr/products')
 * @returns Path without locale (e.g., '/products')
 */
export function removeLocaleFromPath(path: string): string {
  const match = path.match(/^\/[a-z]{2}(\/.*)?$/);
  if (match) {
    return match[1] || '/';
  }
  return path;
}
