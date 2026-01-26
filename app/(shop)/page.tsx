import { getProducts } from '@/lib/supabase/queries'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

export default async function HomePage() {
  const featuredProducts = await getProducts(true)
  const allProducts = await getProducts()

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 rounded-2xl bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 p-12 border border-gray-700 shadow-lg">
          <h1 className="mb-4 text-5xl font-bold text-white">Perseva Store'a Hoş Geldiniz</h1>
          <p className="mb-6 text-xl text-gray-200">
            Kaliteli ürünler, uygun fiyatlar
          </p>
          <Link 
            href="/products"
            className="inline-block rounded-lg bg-white px-8 py-3 font-semibold text-gray-900 transition-all hover:bg-gray-100 hover:scale-105 shadow-md"
          >
            Ürünleri Keşfet
          </Link>
        </div>
        
        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-6 text-3xl font-bold text-white">Öne Çıkan Ürünler</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.slice(0, 4).map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
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
                    <div className="flex h-full items-center justify-center text-gray-400">
                      Görsel Yok
                    </div>
                  )}
                  {product.is_featured && (
                    <div className="absolute right-2 top-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-3 py-1 text-xs font-bold text-white shadow-md z-10">
                      ÖNE ÇIKAN
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="mb-2 font-semibold text-gray-900 line-clamp-2 group-hover:text-gray-700 transition-colors">{product.name}</h3>
                  {product.short_description && (
                    <p className="mb-3 text-sm text-gray-600 line-clamp-2">
                      {product.short_description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-gray-900">
                      {formatPrice(product.base_price)}
                    </p>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      Stok: {product.stock_quantity}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      
        {/* All Products */}
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white">Tüm Ürünler</h2>
            <Link 
              href="/products"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Tümünü Gör →
            </Link>
          </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {allProducts.slice(0, 8).map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
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
                  <div className="flex h-full items-center justify-center text-gray-400">
                    Görsel Yok
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="mb-2 font-semibold text-gray-900 line-clamp-2 group-hover:text-gray-700 transition-colors">{product.name}</h3>
                {product.short_description && (
                  <p className="mb-3 text-sm text-gray-600 line-clamp-2">
                    {product.short_description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-gray-900">
                    {formatPrice(product.base_price)}
                  </p>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Stok: {product.stock_quantity}
                  </span>
                </div>
              </div>
            </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
