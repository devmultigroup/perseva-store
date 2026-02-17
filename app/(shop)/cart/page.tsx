import { getDictionary } from '@/lib/dictionaries';
import { getLanguage } from '@/lib/i18n-server';
import { CartContent } from '@/components/cart';

export default async function CartPage() {
  const lang = await getLanguage();
  const dict = await getDictionary(lang);
  return <CartContent lang={lang as 'tr' | 'en'} dict={dict} />;
}
