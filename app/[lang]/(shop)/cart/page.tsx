import { notFound } from 'next/navigation';
import { getDictionary, hasLocale } from '../../dictionaries';
import { CartContent } from '@/components/cart';

export default async function CartPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  return <CartContent lang={lang as 'tr' | 'en'} dict={dict} />;
}
