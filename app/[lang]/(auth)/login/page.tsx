import { notFound } from 'next/navigation';
import { getDictionary, hasLocale, type Locale } from '../../dictionaries';
import { LoginForm } from '@/components/auth/login-form';

export default async function LoginPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  return <LoginForm lang={lang as Locale} dict={dict} />;
}
