'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { CartItemWithProduct } from '@/types'
import { useAuth } from './use-auth'

export function useCartDB() {
  const [items, setItems] = useState<CartItemWithProduct[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      setItems([])
      setLoading(false)
      return
    }

    const fetchCart = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('cart_items')
          .select('*, product:products(*), variant:product_variants(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setItems(data || [])
      } catch (err) {
        console.error('Failed to fetch cart:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCart()

    // Subscribe to cart changes
    const supabase = createClient()
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
          fetchCart()
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [user])

  const total = items.reduce((sum, item) => {
    const basePrice = item.product.base_price
    const variantModifier = item.variant?.price_modifier || 0
    const itemPrice = basePrice + variantModifier
    return sum + itemPrice * item.quantity
  }, 0)

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return { items, loading, total, itemCount }
}
