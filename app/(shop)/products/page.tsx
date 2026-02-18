import { getProductsWithVariants } from '@/lib/supabase/queries';
import { getLanguage } from '@/lib/i18n-server';
import { getLocalizedPath } from '@/lib/i18n';
import { ProductCard } from '@/components/product';

export default async function ProductsPage() {
  const lang = await getLanguage();
  const products = await getProductsWithVariants();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        {lang === 'tr' ? 'Ürünler' : 'Products'}
      </h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            productHref={getLocalizedPath(`/products/${product.slug}`)}
            showPrice
          />
        ))}
      </div>
    </div>
  );
}
