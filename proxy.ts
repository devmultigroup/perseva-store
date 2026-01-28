import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const locales = ['tr', 'en'] as const;
const defaultLocale: (typeof locales)[number] = 'tr';

function getLocale(request: NextRequest): string {
  // Check if locale exists in pathname
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return pathname.split('/')[1] || defaultLocale;
  }

  // Try to get locale from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    // Simple detection: check if 'en' is preferred
    if (acceptLanguage.toLowerCase().includes('en')) {
      return 'en';
    }
  }

  return defaultLocale;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip locale handling for API routes, static files, etc.
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|webp)$/)
  ) {
    // Continue with existing auth logic
  } else {
    // Check if pathname already has locale
    const pathnameHasLocale = locales.some(
      (locale) =>
        pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (!pathnameHasLocale) {
      // Redirect to add locale
      const locale = getLocale(request);
      const newUrl = new URL(`/${locale}${pathname}`, request.url);
      newUrl.search = request.nextUrl.search;
      return NextResponse.redirect(newUrl);
    }
  }
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: Record<string, unknown>) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Extract locale from pathname for lang-aware redirects
  const pathSegments = pathname.split('/').filter(Boolean);
  const detectedLocale =
    pathSegments[0] &&
    locales.includes(pathSegments[0] as (typeof locales)[number])
      ? pathSegments[0]
      : defaultLocale;

  // Admin rotalarını koru (lang-aware)
  if (pathname.includes('/admin')) {
    // Giriş yapmamış kullanıcıyı login sayfasına yönlendir (401 - Unauthorized durumu)
    if (!user) {
      const loginUrl = new URL(`/${detectedLocale}/login`, request.url);
      loginUrl.searchParams.set(
        'redirectTo',
        pathname + request.nextUrl.search
      );
      loginUrl.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(loginUrl);
    }

    // Admin kontrolü (kullanıcının role'ünü kontrol et)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // Customer veya role'ü olmayan kullanıcı admin sayfalarına giremesin (403 - Forbidden durumu)
    if (!profile || profile.role !== 'admin') {
      const forbiddenUrl = new URL(`/${detectedLocale}`, request.url);
      forbiddenUrl.searchParams.set('error', 'forbidden');
      return NextResponse.redirect(forbiddenUrl);
    }
  }

  // Dashboard rotalarını koru (lang-aware)
  if (pathname.includes('/orders') || pathname.includes('/profile')) {
    if (!user) {
      return NextResponse.redirect(
        new URL(`/${detectedLocale}/login`, request.url)
      );
    }
  }

  // Giriş yapmış kullanıcıyı auth sayfalarından yönlendir (lang-aware)
  if ((pathname.includes('/login') || pathname.includes('/register')) && user) {
    return NextResponse.redirect(new URL(`/${detectedLocale}`, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Şu yollar hariç tüm istekleri eşleştir:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public klasöründeki dosyalar
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
