import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProducts } from '@/lib/supabase/queries'
import { getDictionary, hasLocale } from '../../dictionaries'
import { getLocalizedPath } from '@/lib/i18n'

export default async function ProductsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)
  const products = await getProducts()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">{lang === 'tr' ? 'Ürünler' : 'Products'}</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <Link
            key={p.id}
            href={getLocalizedPath(`/products/${p.slug}`, lang)}
            className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow"
          >
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm text-gray-600">{p.short_description}</div>
          </Link>
        ))}
      </div>
      <div className="mt-8 text-sm text-gray-500">{dict.common.viewAll}</div>
    </div>
  )
}

