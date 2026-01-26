'use client'

import { useActionState } from 'react'
import { signup } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
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
    <div className="rounded-xl bg-white p-8 shadow-xl ring-1 ring-gray-200/50 backdrop-blur-sm">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Kayıt Ol</h1>
        <p className="text-sm text-gray-600">Yeni hesap oluşturun</p>
      </div>
      
      {state?.error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3">
          <p className="text-sm text-red-600">{state.error}</p>
        </div>
      )}
      
      <form action={formAction} className="space-y-5">
        <div>
          <label htmlFor="full_name" className="mb-2 block text-sm font-medium text-gray-700">
            Ad Soyad
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            placeholder="Adınız Soyadınız"
            disabled={isPending}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm transition-colors focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
            E-posta
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="ornek@email.com"
            disabled={isPending}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm transition-colors focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
            Şifre
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="En az 6 karakter"
            disabled={isPending}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm transition-colors focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-500">Şifre en az 6 karakter olmalıdır</p>
        </div>
        
        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending ? 'Kayıt oluşturuluyor...' : 'Kayıt Ol'}
        </Button>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">veya</span>
          </div>
        </div>
      </div>
      
      <p className="mt-6 text-center text-sm text-gray-600">
        Zaten hesabınız var mı?{' '}
        <Link href="/login" className="font-semibold text-black hover:text-gray-700 transition-colors">
          Giriş Yap
        </Link>
      </p>
    </div>
  )
}
