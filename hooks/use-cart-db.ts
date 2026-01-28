'use client';

import { useEffect, useCallback } from 'react';
import useSWR from 'swr';
import { createClient } from '@/lib/supabase/client';
import type { CartItemWithProduct } from '@/types';
import { useAuthContext } from '@/store/auth-context';

const cartFetcher = async (): Promise<CartItemWithProduct[]> => {
  const response = await fetch('/api/cart');
  if (!response.ok) throw new Error('Failed to fetch cart');
  return response.json();
};

export function useCartDB() {
  const { user } = useAuthContext();

  const {
    data: items = [],
    isLoading: loading,
    mutate,
  } = useSWR<CartItemWithProduct[]>(user ? '/api/cart' : null, cartFetcher);

  // Subscribe to realtime cart changes
  useEffect(() => {
    if (!user) return;

    const supabase = createClient();
    const channel = supabase
      .channel('cart_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cart_items',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          mutate();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user, mutate]);

  const addItem = useCallback(
    async (productId: string, variantId?: string, quantity = 1) => {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          variant_id: variantId,
          quantity,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Sepete eklenemedi');
      }

      // SWR will deduplicate with the realtime subscription's mutate()
      await mutate();
      return { success: true };
    },
    [mutate]
  );

  const updateQuantity = useCallback(
    async (cartItemId: string, quantity: number) => {
      const response = await fetch(`/api/cart/${cartItemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Sepet güncellenemedi');
      }

      await mutate();
      return { success: true };
    },
    [mutate]
  );

  const removeItem = useCallback(
    async (cartItemId: string) => {
      // Optimistic update: remove item immediately from UI
      const optimisticItems = items.filter((item) => item.id !== cartItemId);
      mutate(optimisticItems, false);

      try {
        const response = await fetch(`/api/cart/${cartItemId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Sepetten silinemedi');
        }

        await mutate();
        return { success: true };
      } catch (error) {
        // Revert on failure
        await mutate();
        throw error;
      }
    },
    [items, mutate]
  );

  const clearCart = useCallback(async () => {
    // Optimistic update: clear immediately
    mutate([], false);

    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Sepet temizlenemedi');
      }

      await mutate();
      return { success: true };
    } catch (error) {
      // Revert on failure
      await mutate();
      throw error;
    }
  }, [mutate]);

  const total = items.reduce((sum, item) => {
    const basePrice = item.product.base_price;
    const variantModifier = item.variant?.price_modifier || 0;
    const itemPrice = basePrice + variantModifier;
    return sum + itemPrice * item.quantity;
  }, 0);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    loading,
    total,
    itemCount,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    refetch: mutate,
  };
}
