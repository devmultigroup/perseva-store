'use client';

import Link from 'next/link';
import { useCartDB } from '@/hooks/use-cart-db';
import { useParams } from 'next/navigation';
import type { Locale } from '@/app/[lang]/dictionaries';
import { getLocalizedPath } from '@/lib/i18n';

export default function CartPage() {
  const params = useParams();
  const lang = ((params?.lang as Locale) || 'tr') satisfies Locale;
  const { items, loading, total, itemCount, clearCart } = useCartDB();

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {lang === 'tr' ? 'Sepet' : 'Cart'}
        </h1>
        <Link
          className="text-sm text-gray-600 hover:underline"
          href={getLocalizedPath('/products', lang)}
        >
          {lang === 'tr' ? 'Ürünlere dön' : 'Back to products'}
        </Link>
      </div>

      {itemCount === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          {lang === 'tr' ? 'Sepetiniz boş' : 'Your cart is empty'}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="text-sm text-gray-600">
              {lang === 'tr' ? 'Ürün adedi' : 'Items'}: {itemCount}
            </div>
            <div className="text-sm text-gray-600">
              {lang === 'tr' ? 'Toplam' : 'Total'}: {total.toFixed(2)}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white">
            {items.map((it) => (
              <div
                key={it.id}
                className="flex items-center justify-between border-b p-4 last:border-b-0"
              >
                <div>
                  <div className="font-medium">{it.product.name}</div>
                  {it.variant?.name && (
                    <div className="text-sm text-gray-600">
                      {it.variant.name}
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-600">x{it.quantity}</div>
              </div>
            ))}
          </div>

          <button
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            onClick={() => clearCart()}
          >
            {lang === 'tr' ? 'Sepeti temizle' : 'Clear cart'}
          </button>
        </div>
      )}
    </div>
  );
}
