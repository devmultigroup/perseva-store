import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/supabase/queries';
import { getDictionary, hasLocale } from '../../../dictionaries';
import { ProductDetail } from '@/components/product-detail';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const product = await getProductBySlug(slug);

  return <ProductDetail product={product} dict={dict} />;
}
