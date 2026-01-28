'use client';

import useSWR from 'swr';
import { createClient } from '@/lib/supabase/client';
import type { Address } from '@/types';
import { useAuthContext } from '@/store/auth-context';

async function fetchAddresses(userId: string): Promise<Address[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export function useAddresses() {
  const { user } = useAuthContext();

  const { data, isLoading, error, mutate } = useSWR<Address[]>(
    user ? ['addresses', user.id] : null,
    ([, userId]) => fetchAddresses(userId as string)
  );

  const addresses = data || [];
  const defaultAddress = addresses.find((addr) => addr.is_default);

  return {
    addresses,
    defaultAddress,
    loading: isLoading,
    error: error?.message ?? null,
    refetch: mutate,
  };
}
