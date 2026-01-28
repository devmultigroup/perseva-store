import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProducts } from '@/lib/supabase/queries'
import { formatPrice } from '@/lib/utils'
import { getDictionary, hasLocale } from '../dictionaries'
import { getLocalizedPath } from '@/lib/i18n'
import { siteConfig } from '@/config/site'

export async function generateStaticParams() {
  return [{ lang: 'tr' }, { lang: 'en' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)

  return {
    title: lang === 'tr' ? 'Ana Sayfa' : 'Home',
    description: dict.shop.home.subtitle,
    openGraph: {
      title: `${siteConfig.name}`,
      description: dict.shop.home.subtitle,
      images: [{ url: siteConfig.ogImage }],
    },
  }
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const dict = await getDictionary(lang)

  const featuredProducts = await getProducts(true)
  const allProducts = await getProducts()

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12 rounded-2xl bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 p-12 border border-gray-700 shadow-lg">
          <h1 className="mb-4 text-5xl font-bold text-white">{dict.shop.home.title}</h1>
          <p className="mb-6 text-xl text-gray-200">{dict.shop.home.subtitle}</p>
          <Link
            href={getLocalizedPath('/products', lang)}
            className="inline-block rounded-lg bg-white px-8 py-3 font-semibold text-gray-900 transition-all hover:bg-gray-100 hover:scale-105 shadow-md"
          >
            {dict.shop.home.cta}
          </Link>
        </div>

        {featuredProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-6 text-3xl font-bold text-white">{dict.shop.home.featured}</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.slice(0, 4).map((product) => (
                <Link
                  key={product.id}
                  href={getLocalizedPath(`/products/${product.slug}`, lang)}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg hover:border-gray-300"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        unoptimized={product.images[0].startsWith('http') && !product.images[0].includes('supabase')}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">No Image</div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="mb-2 font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                    <p className="text-lg font-bold text-gray-900">{formatPrice(product.base_price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white">{dict.shop.home.allProducts}</h2>
            <Link
              href={getLocalizedPath('/products', lang)}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              {dict.common.viewAll} →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {allProducts.slice(0, 8).map((product) => (
              <Link
                key={product.id}
                href={getLocalizedPath(`/products/${product.slug}`, lang)}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg hover:border-gray-300"
              >
                <div className="p-5">
                  <h3 className="mb-2 font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                  <p className="text-lg font-bold text-gray-900">{formatPrice(product.base_price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

