import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: 'Kayıt Ol',
  description: 'Perseva Store\'da yeni hesap oluşturun ve özel fırsatları kaçırmayın.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Kayıt Ol | Perseva Store',
    description: 'Yeni hesap oluşturun ve özel fırsatları kaçırmayın.',
    url: `${siteConfig.url}/register`,
  },
}

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
