'use client';

import { cn } from '@/lib/utils';
import type { ProductVariant } from '@/types';

export interface ProductVariantsProps {
  variants: ProductVariant[];
  basePrice: number;
  selectedVariantId: string | null;
  onSelectVariant: (variantId: string | null) => void;
  labels?: {
    variants?: string;
    price?: string;
    stock?: string;
    outOfStock?: string;
  };
  className?: string;
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(value);
}

export function ProductVariants({
  variants,
  basePrice,
  selectedVariantId,
  onSelectVariant,
  labels = {},
  className,
}: ProductVariantsProps) {
  const {
    variants: variantsLabel = 'Varyantlar',
    stock: stockLabel = 'Stok',
    outOfStock = 'Tükendi',
  } = labels;

  if (!variants?.length) return null;

  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="text-sm font-medium text-gray-700">{variantsLabel}</h3>
      <ul className="flex flex-wrap gap-2" role="listbox" aria-label={variantsLabel}>
        {variants.map((v) => {
          const price = basePrice + (v.price_modifier || 0);
          const inStock = v.stock_quantity > 0;
          const isSelected = selectedVariantId === v.id;

          return (
            <li key={v.id}>
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                aria-disabled={!inStock}
                disabled={!inStock}
                onClick={() => onSelectVariant(isSelected ? null : v.id)}
                className={cn(
                  'rounded-lg border-2 px-4 py-2 text-left text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
                  isSelected
                    ? 'border-gray-900 bg-gray-50 font-medium'
                    : 'border-gray-200 bg-white hover:border-gray-400',
                  !inStock && 'opacity-70'
                )}
              >
                <span className="block font-medium">{v.name}</span>
                <span className="text-gray-600">{formatPrice(price)}</span>
                {inStock ? (
                  <span className="mt-0.5 block text-xs text-gray-500">
                    {stockLabel}: {v.stock_quantity}
                  </span>
                ) : (
                  <span className="mt-0.5 block text-xs text-red-600">
                    {outOfStock}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
