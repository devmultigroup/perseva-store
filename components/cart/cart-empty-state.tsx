'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

type CartEmptyDict = {
  empty: string;
  emptyDescription: string;
  backToProducts: string;
  loginToView?: string;
  login?: string;
};

interface CartEmptyStateProps {
  dict: CartEmptyDict;
  loginHref: string;
  productsHref: string;
  showLoginPrompt?: boolean;
}

export function CartEmptyState({
  dict,
  loginHref,
  productsHref,
  showLoginPrompt = false,
}: CartEmptyStateProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm md:p-12">
      <div className="mx-auto max-w-sm space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">{dict.empty}</h2>
        <p className="text-gray-600">
          {showLoginPrompt && dict.loginToView
            ? dict.loginToView
            : dict.emptyDescription}
        </p>
        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-center">
          {showLoginPrompt && dict.login && (
            <Link
              href={loginHref}
              className={cn(
                'inline-flex h-11 items-center justify-center rounded-md px-8 font-medium text-white transition-colors focus-visible:ring-2 focus-visible:outline-none',
                'bg-black hover:bg-gray-800'
              )}
            >
              {dict.login}
            </Link>
          )}
          <Link
            href={productsHref}
            className={cn(
              'inline-flex h-11 items-center justify-center rounded-md border border-gray-300 px-8 font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
              'bg-white text-gray-900 hover:bg-gray-50'
            )}
          >
            {dict.backToProducts}
          </Link>
        </div>
      </div>
    </div>
  );
}
