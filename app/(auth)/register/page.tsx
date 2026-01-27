'use client'

import { useActionState } from 'react'
import { signup } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AuthCard } from '@/components/ui/auth-card'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(signup, null)

  useEffect(() => {
    if (state?.success) {
      router.push('/')
      router.refresh()
    }
  }, [state, router])

  return (
    <AuthCard
      title="Kayıt Ol"
      description="Yeni hesap oluşturun"
      errorMessage={state?.error}
      footerText="Zaten hesabınız var mı?"
      footerLinkHref="/login"
      footerLinkLabel="Giriş Yap"
    >
      <form action={formAction} className="space-y-5">
        <div>
          <label htmlFor="full_name" className="mb-2 block text-sm font-medium text-gray-700">
            Ad Soyad
          </label>
          <Input
            id="full_name"
            name="full_name"
            type="text"
            required
            placeholder="Adınız Soyadınız"
            disabled={isPending}
          />
        </div>

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
            placeholder="En az 6 karakter"
            disabled={isPending}
          />
          <p className="mt-1 text-xs text-gray-500">Şifre en az 6 karakter olmalıdır</p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-700">
            Şifre Tekrar
          </label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            placeholder="Şifrenizi tekrar girin"
            disabled={isPending}
          />
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending ? 'Kayıt oluşturuluyor...' : 'Kayıt Ol'}
        </Button>
      </form>
    </AuthCard>
  )
}
