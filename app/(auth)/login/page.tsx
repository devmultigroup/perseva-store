import { getDictionary, type Locale } from '@/lib/dictionaries';
import { getLanguage } from '@/lib/i18n-server';
import { LoginForm } from '@/components/auth/login-form';

export default async function LoginPage() {
  const lang = await getLanguage();
  const dict = await getDictionary(lang);
  return <LoginForm lang={lang as Locale} dict={dict} />;
}
