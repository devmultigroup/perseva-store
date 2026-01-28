import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Ürün adı gerekli'),
  slug: z.string().min(1, 'Slug gerekli'),
  description: z.string().optional(),
  short_description: z.string().optional(),
  base_price: z.number().positive('Fiyat pozitif olmalı'),
  stock_quantity: z.number().int().nonnegative('Stok negatif olamaz'),
  category_id: z.string().uuid('Geçerli bir kategori seçin').nullable(),
  images: z.array(z.string().url('Geçerli bir URL girin')).default([]),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
});

export const productVariantSchema = z.object({
  product_id: z.string().uuid('Geçerli bir ürün seçin'),
  name: z.string().min(1, 'Varyant adı gerekli'),
  sku: z.string().optional(),
  price_modifier: z.number().default(0),
  stock_quantity: z.number().int().nonnegative('Stok negatif olamaz'),
  is_active: z.boolean().default(true),
});

export const categorySchema = z.object({
  name: z.string().min(1, 'Kategori adı gerekli'),
  slug: z.string().min(1, 'Slug gerekli'),
  description: z.string().optional(),
  sort_order: z.number().int().optional(),
  is_active: z.boolean().default(true),
});

export type ProductFormData = z.infer<typeof productSchema>;
export type ProductVariantFormData = z.infer<typeof productVariantSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
