export const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const

export const ORDER_STATUS_LABELS = {
  pending: 'Beklemede',
  paid: 'Ödendi',
  processing: 'İşleniyor',
  shipped: 'Kargoya Verildi',
  delivered: 'Teslim Edildi',
  cancelled: 'İptal Edildi',
} as const

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const

export const PAYMENT_STATUS_LABELS = {
  pending: 'Bekliyor',
  paid: 'Ödendi',
  failed: 'Başarısız',
  refunded: 'İade Edildi',
} as const

export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
} as const

export const USER_ROLES_LABELS = {
  customer: 'Müşteri',
  admin: 'Yönetici',
} as const

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export const ITEMS_PER_PAGE = 12

// Shipping
export const DEFAULT_SHIPPING_COST = 50 // TRY
export const FREE_SHIPPING_THRESHOLD = 500 // TRY

// Tax
export const TAX_RATE = 0.18 // 18% KDV
