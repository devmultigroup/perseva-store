'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { OrderWithItems } from '@/types'
import { useAuth } from './use-auth'

export function useOrders() {
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      setOrders([])
      setLoading(false)
      return
    }

    const fetchOrders = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setOrders(data || [])
      } catch (err) {
        console.error('Failed to fetch orders:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  return { orders, loading }
}
