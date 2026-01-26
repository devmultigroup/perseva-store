import Link from 'next/link'
import { siteConfig } from '@/config/site'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-bold text-gray-900">{siteConfig.name}</h3>
            <p className="text-sm text-gray-600">{siteConfig.description}</p>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-bold text-gray-900">Hızlı Bağlantılar</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Ürünler
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Kategoriler
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Siparişlerim
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-bold text-gray-900">İletişim</h3>
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} {siteConfig.name}. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
