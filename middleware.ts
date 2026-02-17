import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const COOKIE_NAME = 'NEXT_LOCALE';
const locales = ['tr', 'en'] as const;
const defaultLocale: (typeof locales)[number] = 'tr';

function getLocaleFromRequest(request: NextRequest): string {
  // 1. Check cookie first
  const cookieLocale = request.cookies.get(COOKIE_NAME)?.value;
  if (cookieLocale === 'tr' || cookieLocale === 'en') {
    return cookieLocale;
  }

  // 2. Try Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    if (acceptLanguage.toLowerCase().includes('en')) {
      return 'en';
    }
  }

  return defaultLocale;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip locale handling for API routes, static files, etc.
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|webp)$/)
  ) {
    // Continue with existing auth logic only
  } else {
    // Remove locale prefix from URL if present (redirect to clean URL)
    const pathnameHasLocale = locales.some(
      (locale) =>
        pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) {
      // Extract locale and path without locale
      const segments = pathname.split('/').filter(Boolean);
      const localeSegment = segments[0];
      const restOfPath = '/' + segments.slice(1).join('/');
      const cleanPath = restOfPath === '/' ? '/' : restOfPath;

      // Set cookie with detected locale
      const locale =
        localeSegment === 'tr' || localeSegment === 'en'
          ? localeSegment
          : defaultLocale;

      const response = NextResponse.redirect(new URL(cleanPath, request.url));
      response.cookies.set(COOKIE_NAME, locale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        sameSite: 'lax',
      });
      return response;
    }

    // Ensure cookie is set (for first-time visitors)
    const locale = getLocaleFromRequest(request);
    const response = NextResponse.next();

    if (!request.cookies.get(COOKIE_NAME)) {
      response.cookies.set(COOKIE_NAME, locale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        sameSite: 'lax',
      });
    }

    // Continue with auth logic
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

    // Admin routes protection
    if (pathname.includes('/admin')) {
      if (!user) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set(
          'redirectTo',
          pathname + request.nextUrl.search
        );
        loginUrl.searchParams.set('error', 'unauthorized');
        return NextResponse.redirect(loginUrl);
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        const forbiddenUrl = new URL('/', request.url);
        forbiddenUrl.searchParams.set('error', 'forbidden');
        return NextResponse.redirect(forbiddenUrl);
      }
    }

    // Dashboard routes protection
    if (pathname.includes('/orders') || pathname.includes('/profile')) {
      if (!user) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    // Redirect authenticated users away from auth pages
    if (
      (pathname.includes('/login') || pathname.includes('/register')) &&
      user
    ) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return response;
  }

  // For API routes, just handle auth
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

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
