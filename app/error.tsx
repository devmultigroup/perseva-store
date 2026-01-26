'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold">Bir şeyler yanlış gitti!</h2>
        <p className="mb-6 text-gray-600">
          Üzgünüz, bir hata oluştu. Lütfen tekrar deneyin.
        </p>
        <Button onClick={reset}>Tekrar Dene</Button>
      </div>
    </div>
  )
}
