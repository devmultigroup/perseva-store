'use client';

import { useActionState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthCard } from '@/components/ui/auth-card';
import { getLocalizedPath } from '@/lib/i18n';
import type { Locale } from '@/lib/dictionaries';

type Dict = {
  auth: {
    login: {
      title: string;
      description: string;
      email: string;
      password: string;
      submit: string;
      submitting: string;
      noAccount: string;
      register: string;
    };
  };
};

export function LoginForm({ lang, dict }: { lang: Locale; dict: Dict }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(login, null);

  useEffect(() => {
    if (state?.success) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:changed'));
      }
      router.push(getLocalizedPath('/'));
      router.refresh();
    }
  }, [state, router, lang]);

  return (
    <AuthCard
      title={dict.auth.login.title}
      description={dict.auth.login.description}
      errorMessage={state?.error}
      footerText={dict.auth.login.noAccount}
      footerLinkHref={getLocalizedPath('/register')}
      footerLinkLabel={dict.auth.login.register}
    >
      <form action={formAction} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            {dict.auth.login.email}
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            disabled={isPending}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            {dict.auth.login.password}
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            disabled={isPending}
          />
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending ? dict.auth.login.submitting : dict.auth.login.submit}
        </Button>
      </form>
    </AuthCard>
  );
}
