# Schema Migration Guide

Projeniz artık Supabase şemasına %100 uyumlu! İşte değişiklikler ve yapmanız gerekenler:

## 🔄 Yapılan Değişiklikler

### 1. TypeScript Types (`types/index.ts`)
- ✅ Tüm tablolar için yeni type'lar eklendi
- ✅ `Profile` type güncellendi (`phone`, `role: customer/admin`)
- ✅ `Product` type güncellendi (`base_price`, `images[]`, `short_description`, `is_featured`, `stock_quantity`)
- ✅ `ProductVariant` type eklendi
- ✅ `Address` type eklendi
- ✅ `CartItem` (database) type eklendi
- ✅ `ClientCartItem` (localStorage) type eklendi
- ✅ `Order` ve `OrderItem` type'ları güncellendi

### 2. Schemas (`schemas/`)
- ✅ `product.schema.ts` - Yeni field'lar eklendi
- ✅ `product-variant.schema.ts` - Yeni eklendi
- ✅ `category.schema.ts` - Yeni eklendi
- ✅ `address.schema.ts` - Yeni eklendi
- ✅ `order.schema.ts` - Yeni eklendi

### 3. Queries (`lib/supabase/queries.ts`)
- ✅ Product queries güncellendi (variants ile)
- ✅ Cart queries eklendi (database)
- ✅ Address queries eklendi
- ✅ Order queries güncellendi

### 4. Server Actions
- ✅ `lib/actions/products.ts` - Variants dahil
- ✅ `lib/actions/cart.ts` - Database cart için
- ✅ `lib/actions/address.ts` - Yeni eklendi
- ✅ `lib/actions/orders.ts` - Yeni eklendi

### 5. Hooks
- ✅ `use-cart-db.ts` - Database cart için
- ✅ `use-addresses.ts` - Adres yönetimi
- ✅ `use-orders.ts` - Sipariş listesi
- ✅ `use-products.ts` - Güncellendi

### 6. Cart Context
- ✅ Variant desteği eklendi
- ✅ localStorage entegrasyonu
- ✅ `base_price` + `price_modifier` hesaplama

## 📋 Yapmanız Gerekenler

### 1. Supabase'de RLS Politikalarını Güncelle

```sql
-- Cart Items Policies
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cart" ON cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own cart" ON cart_items
  FOR ALL USING (auth.uid() = user_id);

-- Addresses Policies
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own addresses" ON addresses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own addresses" ON addresses
  FOR ALL USING (auth.uid() = user_id);

-- Product Variants Public Read
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON product_variants
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admin full access" ON product_variants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 2. Profiles Tablosu Role Güncellemesi

Mevcut kullanıcıların role değerini güncelle:

```sql
-- Varsayılan user role'ünü customer'a değiştir
UPDATE profiles SET role = 'customer' WHERE role = 'user';

-- Admin kullanıcılar için (manuel olarak)
UPDATE profiles SET role = 'admin' WHERE id = 'admin-user-id';
```

### 3. Products Tablosu Migration

Eğer mevcut verileriniz varsa:

```sql
-- price'dan base_price'a
ALTER TABLE products RENAME COLUMN price TO base_price;

-- stock'tan stock_quantity'ye
ALTER TABLE products RENAME COLUMN stock TO stock_quantity;

-- image_url'den images'a (array)
ALTER TABLE products ADD COLUMN images TEXT[];
UPDATE products SET images = ARRAY[image_url] WHERE image_url IS NOT NULL;
ALTER TABLE products DROP COLUMN image_url;

-- short_description ekle
ALTER TABLE products ADD COLUMN short_description TEXT;

-- is_featured ekle
ALTER TABLE products ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
```

### 4. Orders Tablosu Migration

```sql
-- Eksik kolonları ekle
ALTER TABLE orders ADD COLUMN order_number TEXT UNIQUE NOT NULL DEFAULT 'ORD-' || TO_CHAR(NOW(), 'YYYYMM') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
ALTER TABLE orders ADD COLUMN subtotal DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE orders ADD COLUMN shipping_cost DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE orders ADD COLUMN tax DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE orders ADD COLUMN payment_intent_id TEXT;
ALTER TABLE orders ADD COLUMN payment_status TEXT DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN notes TEXT;

-- shipping_address'i JSONB yap
ALTER TABLE orders ALTER COLUMN shipping_address TYPE JSONB USING shipping_address::JSONB;
ALTER TABLE orders ADD COLUMN billing_address JSONB;

-- total_amount'u total olarak rename et
ALTER TABLE orders RENAME COLUMN total_amount TO total;

-- Status enum güncelle (paid ekle)
-- Not: Enum güncellemesi için önce değerleri kontrol edin
```

### 5. Order Items Güncellemesi

```sql
-- Eksik kolonları ekle
ALTER TABLE order_items ADD COLUMN variant_id UUID REFERENCES product_variants(id);
ALTER TABLE order_items ADD COLUMN product_name TEXT NOT NULL DEFAULT '';
ALTER TABLE order_items ADD COLUMN variant_name TEXT;

-- Mevcut veriler için product_name'leri doldur
UPDATE order_items oi
SET product_name = p.name
FROM products p
WHERE oi.product_id = p.id AND oi.product_name = '';

-- total_price'ı total olarak rename et
ALTER TABLE order_items RENAME COLUMN total_price TO total;
```

## 🎯 Önemli Notlar

### Cart İmplementasyonu
Projede **iki tür cart** var:

1. **Client Cart** (`store/cart-context.tsx`)
   - localStorage kullanır
   - Misafir kullanıcılar için
   - Hızlı ve offline çalışır

2. **Database Cart** (`lib/actions/cart.ts`)
   - Supabase'de saklanır
   - Giriş yapmış kullanıcılar için
   - Cihazlar arası senkronizasyon

### Kullanım Örnekleri

#### Sepete Ürün Ekleme (Variant ile)
```typescript
// Client-side (Context)
const { addItem } = useCart()
addItem(product, variant, 1)

// Server-side (Database)
await addToCartAction(product.id, variant?.id, 1)
```

#### Adres Yönetimi
```typescript
const { addresses, defaultAddress } = useAddresses()
```

#### Sipariş Oluşturma
```typescript
await createOrder(shippingAddress, billingAddress, notes)
```

## 🚀 Sonraki Adımlar

1. **Test Et**: Tüm fonksiyonları test edin
2. **UI Oluştur**: Ürün detay, sepet, checkout sayfaları
3. **Ödeme Entegrasyonu**: Stripe/Iyzico ekle
4. **Admin Panel**: Product variant yönetimi
5. **Görseller**: Supabase Storage entegrasyonu

## 📚 Referanslar

- Types: `types/index.ts`
- Schemas: `schemas/*.ts`
- Queries: `lib/supabase/queries.ts`
- Actions: `lib/actions/*.ts`
- Hooks: `hooks/*.ts`
