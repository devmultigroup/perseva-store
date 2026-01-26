'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Product, ProductVariant } from '@/types'

// ==================== PRODUCTS ====================

export async function createProduct(formData: FormData) {
  const supabase = await createClient()
  
  // Parse images array from form
  const imagesString = formData.get('images') as string
  const images = imagesString ? imagesString.split(',').map(url => url.trim()) : []
  
  const product = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string || null,
    short_description: formData.get('short_description') as string || null,
    base_price: parseFloat(formData.get('base_price') as string),
    stock_quantity: parseInt(formData.get('stock_quantity') as string),
    category_id: formData.get('category_id') as string || null,
    images: images,
    is_active: formData.get('is_active') === 'true',
    is_featured: formData.get('is_featured') === 'true',
  }
  
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single()
  
  if (error) throw error
  
  revalidatePath('/admin/products')
  revalidatePath('/products')
  return data
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const imagesString = formData.get('images') as string
  const images = imagesString ? imagesString.split(',').map(url => url.trim()) : []
  
  const updates = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string || null,
    short_description: formData.get('short_description') as string || null,
    base_price: parseFloat(formData.get('base_price') as string),
    stock_quantity: parseInt(formData.get('stock_quantity') as string),
    category_id: formData.get('category_id') as string || null,
    images: images,
    is_active: formData.get('is_active') === 'true',
    is_featured: formData.get('is_featured') === 'true',
    updated_at: new Date().toISOString(),
  }
  
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  
  revalidatePath('/admin/products')
  revalidatePath(`/products/${updates.slug}`)
  revalidatePath('/products')
  return data
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
  
  if (error) throw error
  
  revalidatePath('/admin/products')
  revalidatePath('/products')
}

// ==================== PRODUCT VARIANTS ====================

export async function createProductVariant(formData: FormData) {
  const supabase = await createClient()
  
  const variant = {
    product_id: formData.get('product_id') as string,
    name: formData.get('name') as string,
    sku: formData.get('sku') as string || null,
    price_modifier: parseFloat(formData.get('price_modifier') as string) || 0,
    stock_quantity: parseInt(formData.get('stock_quantity') as string),
    is_active: formData.get('is_active') === 'true',
  }
  
  const { data, error } = await supabase
    .from('product_variants')
    .insert(variant)
    .select()
    .single()
  
  if (error) throw error
  
  revalidatePath('/admin/products')
  return data
}

export async function updateProductVariant(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const updates = {
    name: formData.get('name') as string,
    sku: formData.get('sku') as string || null,
    price_modifier: parseFloat(formData.get('price_modifier') as string) || 0,
    stock_quantity: parseInt(formData.get('stock_quantity') as string),
    is_active: formData.get('is_active') === 'true',
  }
  
  const { data, error } = await supabase
    .from('product_variants')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  
  revalidatePath('/admin/products')
  return data
}

export async function deleteProductVariant(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('product_variants')
    .delete()
    .eq('id', id)
  
  if (error) throw error
  
  revalidatePath('/admin/products')
}

// ==================== CATEGORIES ====================

export async function createCategory(formData: FormData) {
  const supabase = await createClient()
  
  const category = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string || null,
    sort_order: parseInt(formData.get('sort_order') as string) || null,
    is_active: formData.get('is_active') === 'true',
  }
  
  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select()
    .single()
  
  if (error) throw error
  
  revalidatePath('/admin/categories')
  revalidatePath('/categories')
  return data
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const updates = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string || null,
    sort_order: parseInt(formData.get('sort_order') as string) || null,
    is_active: formData.get('is_active') === 'true',
  }
  
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  
  revalidatePath('/admin/categories')
  revalidatePath('/categories')
  return data
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)
  
  if (error) throw error
  
  revalidatePath('/admin/categories')
  revalidatePath('/categories')
}
