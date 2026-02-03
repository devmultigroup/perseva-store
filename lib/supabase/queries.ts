import { createClient } from './server';
import type {
  Product,
  ProductVariant,
  ProductWithVariants,
  Category,
  OrderWithItems,
  Address,
  CartItemWithProduct,
  Profile,
} from '@/types';

// ==================== PRODUCTS ====================

export async function getProducts(featured?: boolean) {
  const supabase = await createClient();
  let query = supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (featured) {
    query = query.eq('is_featured', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Product[];
}

export async function getProductsWithVariants(featured?: boolean) {
  const supabase = await createClient();
  let query = supabase
    .from('products')
    .select('*, category:categories(*), variants:product_variants(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (featured) {
    query = query.eq('is_featured', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as ProductWithVariants[];
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*), variants:product_variants(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) throw error;
  return data as ProductWithVariants;
}

export async function getProductById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, variants:product_variants(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as ProductWithVariants;
}

// ==================== PRODUCT VARIANTS ====================

export async function getProductVariants(productId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', productId)
    .eq('is_active', true)
    .order('name');

  if (error) throw error;
  return data as ProductVariant[];
}

// ==================== CATEGORIES ====================

export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data as Category[];
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*, products!products_category_id_fkey(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) throw error;
  return data;
}

// ==================== ORDERS ====================

export async function getUserOrders(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as OrderWithItems[];
}

export async function getOrderById(orderId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', orderId)
    .single();

  if (error) throw error;
  return data as OrderWithItems;
}

// ==================== CART ====================

export async function getCartItems(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('cart_items')
    .select('*, product:products(*), variant:product_variants(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as CartItemWithProduct[];
}

export async function addToCart(
  userId: string,
  productId: string,
  variantId?: string,
  quantity = 1
) {
  const supabase = await createClient();

  // Check if item already exists
  const { data: existing } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .eq('variant_id', variantId || null)
    .single();

  if (existing) {
    // Update quantity
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    // Insert new item
    const { data, error } = await supabase
      .from('cart_items')
      .insert({
        user_id: userId,
        product_id: productId,
        variant_id: variantId,
        quantity,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', cartItemId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeFromCart(cartItemId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId);

  if (error) throw error;
}

export async function clearCart(userId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId);

  if (error) throw error;
}

// ==================== ADDRESSES ====================

export async function getUserAddresses(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false });

  if (error) throw error;
  return data as Address[];
}

export async function getDefaultAddress(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .eq('is_default', true)
    .single();

  if (error) return null;
  return data as Address;
}

// ==================== PROFILE ====================

export async function getProfile(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as Profile;
}
