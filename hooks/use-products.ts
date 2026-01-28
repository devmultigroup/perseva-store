'use client';

import useSWR from 'swr';
import { createClient } from '@/lib/supabase/client';
import type { Product, ProductWithVariants } from '@/types';

async function fetchProducts(
  _key: string,
  featured?: boolean
): Promise<Product[]> {
  const supabase = createClient();
  let query = supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (featured) {
    query = query.eq('is_featured', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

async function fetchProduct(
  _key: string,
  slug: string
): Promise<ProductWithVariants | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*), variants:product_variants(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) throw error;
  return data;
}

export function useProducts(featured?: boolean) {
  const { data, isLoading, error } = useSWR<Product[]>(
    ['products', featured ?? null],
    ([key, feat]) => fetchProducts(key as string, feat as boolean | undefined)
  );

  return {
    products: data || [],
    loading: isLoading,
    error: error?.message ?? null,
  };
}

export function useProduct(slug: string) {
  const { data, isLoading, error } = useSWR<ProductWithVariants | null>(
    slug ? ['product', slug] : null,
    ([key, s]) => fetchProduct(key as string, s as string)
  );

  return {
    product: data ?? null,
    loading: isLoading,
    error: error?.message ?? null,
  };
}
