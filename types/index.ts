// Database Types - Supabase Schema'ya göre

// Profiles (extends auth.users)
export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  role: 'customer' | 'admin'
  created_at: string
  updated_at: string
}

// Categories
export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  sort_order: number | null
  is_active: boolean
  created_at: string
}

// Products
export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  category_id: string | null
  base_price: number
  images: string[] | null
  is_active: boolean
  is_featured: boolean
  stock_quantity: number
  created_at: string
  updated_at: string
}

// Product Variants (sizes, colors)
export interface ProductVariant {
  id: string
  product_id: string
  name: string // e.g. "Small", "Red"
  sku: string | null
  price_modifier: number // ekstra fiyat (+/-)
  stock_quantity: number
  is_active: boolean
  created_at: string
}

// Addresses
export interface Address {
  id: string
  user_id: string
  label: string | null // "Home", "Work"
  full_name: string
  address_line1: string
  address_line2: string | null
  city: string
  state: string | null
  postal_code: string
  country: string
  phone: string
  is_default: boolean
  created_at: string
}

// Address as JSONB in orders
export interface AddressData {
  full_name: string
  address_line1: string
  address_line2?: string
  city: string
  state?: string
  postal_code: string
  country: string
  phone: string
}

// Orders
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

// Order Items
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

// Cart Items (server-side persistence)
export interface CartItem {
  id: string
  user_id: string
  product_id: string
  variant_id: string | null
  quantity: number
  created_at: string
  updated_at: string
}

// Extended types with relations
export interface CartItemWithProduct extends CartItem {
  product: Product
  variant?: ProductVariant
}

export interface ProductWithVariants extends Product {
  variants: ProductVariant[]
  category?: Category
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[]
}

// UI Types
export interface NavItem {
  title: string
  href: string
  disabled?: boolean
  external?: boolean
}

// Client-side cart item (for Context API)
export interface ClientCartItem {
  product: Product
  variant?: ProductVariant
  quantity: number
}
