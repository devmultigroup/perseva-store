// Order Types

import type { AddressData } from './address'

export interface Order {
  id: string
  order_number: string
  user_id: string
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  subtotal: number
  shipping_cost: number
  tax: number
  total: number
  shipping_address: AddressData
  billing_address: AddressData
  payment_intent_id: string | null
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  notes: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  variant_id: string | null
  product_name: string // snapshot
  variant_name: string | null // snapshot
  unit_price: number
  quantity: number
  total: number
  created_at: string
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[]
}
