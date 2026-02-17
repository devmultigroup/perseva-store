import { cookies } from 'next/headers';
import type { Locale } from '@/lib/dictionaries';

const COOKIE_NAME = 'NEXT_LOCALE';
const DEFAULT_LOCALE: Locale = 'tr';

/**
 * Gets the current language from cookies or defaults to 'tr'
 * Use this in Server Components ONLY
 */
export async function getLanguage(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get(COOKIE_NAME)?.value;

  if (locale === 'tr' || locale === 'en') {
    return locale;
  }

  return DEFAULT_LOCALE;
}
