'use client';

import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';

type CartSummaryDict = {
  itemsCount: string;
  subtotal: string;
  clearCart: string;
  checkout: string;
};

interface CartSummaryProps {
  itemCount: number;
  total: number;
  dict: CartSummaryDict;
  onClearCart: () => Promise<unknown>;
  onCheckout?: () => void;
  clearCartDisabled?: boolean;
}

export function CartSummary({
  itemCount,
  total,
  dict,
  onClearCart,
  onCheckout,
  clearCartDisabled = false,
}: CartSummaryProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        {dict.subtotal}
      </h3>
      <dl className="space-y-2">
        <div className="flex justify-between text-sm">
          <dt className="text-gray-600">{dict.itemsCount}</dt>
          <dd className="font-medium text-gray-900">{itemCount}</dd>
        </div>
        <div className="flex justify-between border-t border-gray-100 pt-3">
          <dt className="font-medium text-gray-900">{dict.subtotal}</dt>
          <dd className="text-lg font-semibold text-gray-900">
            {formatPrice(total)}
          </dd>
        </div>
      </dl>
      <div className="mt-6 flex flex-col gap-2">
        {onCheckout && (
          <Button size="lg" className="w-full" onClick={onCheckout}>
            {dict.checkout}
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          disabled={clearCartDisabled}
          onClick={() => onClearCart()}
        >
          {dict.clearCart}
        </Button>
      </div>
    </div>
  );
}
