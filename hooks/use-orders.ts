'use client';

import useSWR from 'swr';
import { createClient } from '@/lib/supabase/client';
import type { OrderWithItems } from '@/types';
import { useAuthContext } from '@/store/auth-context';

async function fetchOrders(userId: string): Promise<OrderWithItems[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export function useOrders() {
  const { user } = useAuthContext();

  const { data, isLoading, error, mutate } = useSWR<OrderWithItems[]>(
    user ? ['orders', user.id] : null,
    ([, userId]) => fetchOrders(userId as string)
  );

  return {
    orders: data || [],
    loading: isLoading,
    error: error?.message ?? null,
    refetch: mutate,
  };
}
