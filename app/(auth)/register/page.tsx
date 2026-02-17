import { getDictionary, type Locale } from '@/lib/dictionaries';
import { getLanguage } from '@/lib/i18n-server';
import { RegisterForm } from '@/components/auth/register-form';

export default async function RegisterPage() {
  const lang = await getLanguage();
  const dict = await getDictionary(lang);
  return <RegisterForm lang={lang as Locale} dict={dict} />;
}
