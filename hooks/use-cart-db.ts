'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { CartItemWithProduct } from '@/types'
import { useAuthContext } from '@/store/auth-context'

export function useCartDB() {
  const [items, setItems] = useState<CartItemWithProduct[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuthContext()

  const fetchCart = useCallback(async () => {
    if (!user) {
      setItems([])
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/cart')
      
      if (!response.ok) {
        throw new Error('Failed to fetch cart')
      }

      const data = await response.json()
      setItems(data || [])
    } catch (err) {
      console.error('Failed to fetch cart:', err)
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchCart()

    if (!user) return

    // Subscribe to cart changes (realtime)
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
  }, [user, fetchCart])

  const addItem = async (productId: string, variantId?: string, quantity = 1) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, variant_id: variantId, quantity }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Sepete eklenemedi')
      }

      await fetchCart()
      return { success: true }
    } catch (error) {
      console.error('Add to cart error:', error)
      throw error
    }
  }

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      const response = await fetch(`/api/cart/${cartItemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Sepet güncellenemedi')
      }

      await fetchCart()
      return { success: true }
    } catch (error) {
      console.error('Update cart error:', error)
      throw error
    }
  }

  const removeItem = async (cartItemId: string) => {
    try {
      const response = await fetch(`/api/cart/${cartItemId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Sepetten silinemedi')
      }

      await fetchCart()
      return { success: true }
    } catch (error) {
      console.error('Remove from cart error:', error)
      throw error
    }
  }

  const clearCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Sepet temizlenemedi')
      }

      await fetchCart()
      return { success: true }
    } catch (error) {
      console.error('Clear cart error:', error)
      throw error
    }
  }

  const total = items.reduce((sum, item) => {
    const basePrice = item.product.base_price
    const variantModifier = item.variant?.price_modifier || 0
    const itemPrice = basePrice + variantModifier
    return sum + itemPrice * item.quantity
  }, 0)

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return { 
    items, 
    loading, 
    total, 
    itemCount,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    refetch: fetchCart,
  }
}
