import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold">404</h1>
        <h2 className="mb-4 text-2xl font-bold">Sayfa Bulunamadı</h2>
        <p className="mb-6 text-gray-600">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <Link href="/">
          <Button>Ana Sayfaya Dön</Button>
        </Link>
      </div>
    </div>
  )
}
