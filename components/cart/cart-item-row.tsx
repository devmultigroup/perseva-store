'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { CartItemWithProduct } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type CartItemDict = {
  remove: string;
  quantity: string;
};

interface CartItemRowProps {
  item: CartItemWithProduct;
  dict: CartItemDict;
  productHref: string;
  onQuantityChange: (cartItemId: string, quantity: number) => Promise<unknown>;
  onRemove: (cartItemId: string) => Promise<unknown>;
}

function getUnitPrice(item: CartItemWithProduct): number {
  const base = item.product.base_price;
  const modifier = item.variant?.price_modifier ?? 0;
  return base + modifier;
}

export function CartItemRow({
  item,
  dict,
  productHref,
  onQuantityChange,
  onRemove,
}: CartItemRowProps) {
  const [updating, setUpdating] = useState(false);
  const [removing, setRemoving] = useState(false);

  const unitPrice = getUnitPrice(item);
  const lineTotal = unitPrice * item.quantity;
  const imageUrl =
    item.variant?.images && item.variant.images.length > 0
      ? item.variant.images[0]
      : item.product.images && item.product.images.length > 0
        ? item.product.images[0]
        : null;

  const handleQuantityChange = async (newQty: number) => {
    if (newQty < 1) return;
    setUpdating(true);
    try {
      await onQuantityChange(item.id, newQty);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await onRemove(item.id);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-4 border-b border-gray-100 py-4 last:border-b-0 sm:flex-row sm:items-center',
        (updating || removing) && 'opacity-60'
      )}
    >
      <Link
        href={productHref}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-28 sm:w-28"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.product.name}
            fill
            className="object-cover"
            sizes="112px"
            unoptimized={
              imageUrl.startsWith('http') &&
              (!imageUrl.includes('supabase') ||
                imageUrl.includes('placehold.co'))
            }
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
            No image
          </div>
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          href={productHref}
          className="font-medium text-gray-900 hover:text-gray-600"
        >
          {item.product.name}
        </Link>
        {item.variant?.name && (
          <p className="mt-0.5 text-sm text-gray-500">{item.variant.name}</p>
        )}
        <p className="mt-1 text-sm font-medium text-gray-700">
          {formatPrice(unitPrice)} × {item.quantity}
        </p>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 px-0"
            disabled={updating || item.quantity <= 1}
            onClick={() => handleQuantityChange(item.quantity - 1)}
            aria-label={dict.quantity}
          >
            −
          </Button>
          <span className="min-w-[2rem] text-center text-sm font-medium">
            {item.quantity}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 px-0"
            disabled={updating}
            onClick={() => handleQuantityChange(item.quantity + 1)}
            aria-label={dict.quantity}
          >
            +
          </Button>
        </div>

        <p className="w-24 text-right text-sm font-semibold text-gray-900 sm:w-28">
          {formatPrice(lineTotal)}
        </p>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-red-600 hover:bg-red-50 hover:text-red-700"
          disabled={removing}
          onClick={handleRemove}
          aria-label={dict.remove}
        >
          {dict.remove}
        </Button>
      </div>
    </div>
  );
}
