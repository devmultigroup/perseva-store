import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Admin rotalarını koru
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // Admin kontrolü (kullanıcının role'ünü kontrol et)
    // Bu kısmı Supabase'deki user metadata veya profiles tablosuna göre ayarlayın
    // Örnek: const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    // if (profile?.role !== 'admin') return NextResponse.redirect(new URL('/', request.url))
  }

  // Dashboard rotalarını koru
  if (request.nextUrl.pathname.startsWith('/orders') || 
      request.nextUrl.pathname.startsWith('/profile')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Giriş yapmış kullanıcıyı auth sayfalarından yönlendir
  if ((request.nextUrl.pathname.startsWith('/login') || 
       request.nextUrl.pathname.startsWith('/register')) && user) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
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
}
