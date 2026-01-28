import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/supabase/queries';
import { getDictionary, hasLocale } from '../../../dictionaries';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const product = await getProductBySlug(slug);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>
      <p className="mb-6 text-gray-600">{product.short_description}</p>
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="text-sm text-gray-500">
          {dict.common.description ?? 'Description'}
        </div>
        <div className="mt-2 whitespace-pre-wrap">{product.description}</div>
      </div>
    </div>
  );
}
