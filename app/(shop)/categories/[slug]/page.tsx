import Link from 'next/link';
import { getCategoryBySlug } from '@/lib/supabase/queries';
import { getDictionary } from '@/lib/dictionaries';
import { getLanguage } from '@/lib/i18n-server';
import { getLocalizedPath } from '@/lib/i18n';

type CategoryWithProducts = {
  name: string;
  description: string | null;
  products: Array<{
    id: string;
    name: string;
    slug: string;
    short_description: string | null;
  }>;
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lang = await getLanguage();
  await getDictionary(lang); // keep pattern consistent
  const category = (await getCategoryBySlug(slug)) as CategoryWithProducts;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">{category.name}</h1>
      {category.description && (
        <p className="mb-6 text-gray-600">{category.description}</p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {category.products?.map((p) => (
          <Link
            key={p.id}
            href={getLocalizedPath(`/products/${p.slug}`)}
            className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow"
          >
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm text-gray-600">{p.short_description}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
