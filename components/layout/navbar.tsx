import Link from 'next/link'
import { mainNav } from '@/config/navigation'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          Perseva Store
        </Link>
        
        <nav className="flex items-center gap-6">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-900 transition-colors hover:text-gray-600"
            >
              {item.title}
            </Link>
          ))}
          
          <Link
            href="/cart"
            className="ml-4 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Sepet
          </Link>
        </nav>
      </div>
    </header>
  )
}
