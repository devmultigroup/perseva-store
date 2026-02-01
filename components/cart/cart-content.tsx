'use client';

import Link from 'next/link';
import { useCartDB } from '@/hooks/use-cart-db';
import { useAuthContext } from '@/store/auth-context';
import { getLocalizedPath } from '@/lib/i18n';
import type { Locale } from '@/app/[lang]/dictionaries';
import { CartEmptyState } from '@/components/cart/cart-empty-state';
import { CartItemRow } from '@/components/cart/cart-item-row';
import { CartSummary } from '@/components/cart/cart-summary';

type CartContentDict = {
  common?: { loading?: string };
  shop?: {
    cart: {
      title: string;
      backToProducts: string;
      empty: string;
      emptyDescription: string;
      loginToView: string;
      login: string;
      itemsCount: string;
      subtotal: string;
      clearCart: string;
      checkout: string;
      remove: string;
      quantity: string;
    };
  };
};

interface CartContentProps {
  lang: Locale;
  dict: CartContentDict;
}

export function CartContent({ lang, dict }: CartContentProps) {
  const { user } = useAuthContext();
  const {
    items,
    loading,
    total,
    itemCount,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCartDB();

  const cartDict = dict.shop?.cart;
  if (!cartDict) throw new Error('Cart dictionary (shop.cart) is required');
  const productsHref = getLocalizedPath('/products', lang);
  const loginHref = getLocalizedPath('/login', lang);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">{cartDict.title}</h1>
        </div>
        <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-white py-24">
          <p className="text-gray-500">
            {dict.common?.loading ?? 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  const isEmpty = items.length === 0;
  const showLoginPrompt = !user && isEmpty;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{cartDict.title}</h1>
        <Link
          href={productsHref}
          className="text-sm font-medium text-gray-600 underline-offset-4 hover:underline"
        >
          {cartDict.backToProducts}
        </Link>
      </div>

      {isEmpty ? (
        <CartEmptyState
          dict={{
            empty: cartDict.empty,
            emptyDescription: cartDict.emptyDescription,
            backToProducts: cartDict.backToProducts,
            loginToView: cartDict.loginToView,
            login: cartDict.login,
          }}
          loginHref={loginHref}
          productsHref={productsHref}
          showLoginPrompt={showLoginPrompt}
        />
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white px-4 shadow-sm sm:px-6">
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  dict={{
                    remove: cartDict.remove,
                    quantity: cartDict.quantity,
                  }}
                  productHref={getLocalizedPath(
                    `/products/${item.product.slug}`,
                    lang
                  )}
                  onQuantityChange={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CartSummary
                itemCount={itemCount}
                total={total}
                dict={{
                  itemsCount: cartDict.itemsCount,
                  subtotal: cartDict.subtotal,
                  clearCart: cartDict.clearCart,
                  checkout: cartDict.checkout,
                }}
                onClearCart={clearCart}
                clearCartDisabled={items.length === 0}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
