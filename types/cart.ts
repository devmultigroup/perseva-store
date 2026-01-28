// Cart Types

import type { Product, ProductVariant } from './product'

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  variant_id: string | null
  quantity: number
  created_at: string
  updated_at: string
}

export interface CartItemWithProduct extends CartItem {
  product: Product
  variant?: ProductVariant
}

// Client-side cart item (for Context API)
export interface ClientCartItem {
  product: Product
  variant?: ProductVariant
  quantity: number
}
