import { getProductBySlug } from '@/lib/supabase/queries';
import { getDictionary } from '@/lib/dictionaries';
import { getLanguage } from '@/lib/i18n-server';
import { ProductDetail } from '@/components/product-detail';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lang = await getLanguage();
  const dict = await getDictionary(lang);
  const product = await getProductBySlug(slug);

  return <ProductDetail product={product} dict={dict} />;
}
