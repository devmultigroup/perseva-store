import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Giriş Yap',
  description: 'Perseva Store hesabınıza giriş yapın ve alışverişe devam edin.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Giriş Yap | Perseva Store',
    description: 'Hesabınıza giriş yapın ve alışverişe devam edin.',
    url: `${siteConfig.url}/login`,
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
