'use client'

import { useActionState } from 'react'
import { login } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AuthCard } from '@/components/ui/auth-card'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(login, null)

  useEffect(() => {
    if (state?.success) {
      router.push('/')
      router.refresh()
    }
  }, [state, router])

  return (
    <AuthCard
      title="Giriş Yap"
      description="Hesabınıza giriş yapın"
      errorMessage={state?.error}
      footerText="Hesabınız yok mu?"
      footerLinkHref="/register"
      footerLinkLabel="Kayıt Ol"
    >
      <form action={formAction} className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
            E-posta
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="ornek@email.com"
            disabled={isPending}
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
            Şifre
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            disabled={isPending}
          />
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </Button>
      </form>
    </AuthCard>
  )
}
