'use client'

import { useActionState } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signup } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AuthCard } from '@/components/ui/auth-card'
import { getLocalizedPath } from '@/lib/i18n'
import type { Locale } from '@/app/[lang]/dictionaries'

type Dict = {
  auth: {
    register: {
      title: string
      description: string
      fullName: string
      email: string
      password: string
      confirmPassword: string
      passwordHint: string
      submit: string
      submitting: string
      hasAccount: string
      login: string
    }
  }
}

export function RegisterForm({ lang, dict }: { lang: Locale; dict: Dict }) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(signup, null)

  useEffect(() => {
    if (state?.success) {
      router.push(getLocalizedPath('/', lang))
      router.refresh()
    }
  }, [state, router, lang])

  return (
    <AuthCard
      title={dict.auth.register.title}
      description={dict.auth.register.description}
      errorMessage={state?.error}
      footerText={dict.auth.register.hasAccount}
      footerLinkHref={getLocalizedPath('/login', lang)}
      footerLinkLabel={dict.auth.register.login}
    >
      <form action={formAction} className="space-y-5">
        <div>
          <label htmlFor="full_name" className="mb-2 block text-sm font-medium text-gray-700">
            {dict.auth.register.fullName}
          </label>
          <Input id="full_name" name="full_name" type="text" required disabled={isPending} />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
            {dict.auth.register.email}
          </label>
          <Input id="email" name="email" type="email" required disabled={isPending} />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
            {dict.auth.register.password}
          </label>
          <Input id="password" name="password" type="password" required disabled={isPending} />
          <p className="mt-1 text-xs text-gray-500">{dict.auth.register.passwordHint}</p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-700">
            {dict.auth.register.confirmPassword}
          </label>
          <Input id="confirmPassword" name="confirmPassword" type="password" required disabled={isPending} />
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending ? dict.auth.register.submitting : dict.auth.register.submit}
        </Button>
      </form>
    </AuthCard>
  )
}

