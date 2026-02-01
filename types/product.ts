// Product Types

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number | null;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  category_id: string | null;
  base_price: number;
  images: string[] | null;
  is_active: boolean;
  is_featured: boolean;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  sku: string | null;
  price_modifier: number;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  /** Varyant bazlı görseller (örn. renk); seçilince galeride bunlar gösterilir */
  images?: string[] | null;
}

export interface ProductWithVariants extends Product {
  variants: ProductVariant[];
  category?: Category;
}
