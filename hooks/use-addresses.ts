'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Address } from '@/types'
import { useAuth } from './use-auth'

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      setAddresses([])
      setLoading(false)
      return
    }

    const fetchAddresses = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('addresses')
          .select('*')
          .eq('user_id', user.id)
          .order('is_default', { ascending: false })
          .order('created_at', { ascending: false })

        if (error) throw error
        setAddresses(data || [])
      } catch (err) {
        console.error('Failed to fetch addresses:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAddresses()
  }, [user])

  const defaultAddress = addresses.find((addr) => addr.is_default)

  return { addresses, defaultAddress, loading }
}
