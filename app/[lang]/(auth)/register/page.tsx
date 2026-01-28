import { notFound } from 'next/navigation';
import { getDictionary, hasLocale, type Locale } from '../../dictionaries';
import { RegisterForm } from '@/components/auth/register-form';

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  return <RegisterForm lang={lang as Locale} dict={dict} />;
}
