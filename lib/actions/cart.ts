'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function addToCartAction(productId: string, variantId?: string, quantity = 1) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Oturum açmanız gerekiyor')
  }
  
  // Check if item already exists
  const { data: existing } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .eq('variant_id', variantId || null)
    .maybeSingle()
  
  if (existing) {
    // Update quantity
    const { data, error } = await supabase
      .from('cart_items')
      .update({ 
        quantity: existing.quantity + quantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id)
      .select()
      .single()
    
    if (error) throw error
    revalidatePath('/cart')
    return { success: true, data }
  } else {
    // Insert new item
    const { data, error } = await supabase
      .from('cart_items')
      .insert({ 
        user_id: user.id, 
        product_id: productId, 
        variant_id: variantId || null, 
        quantity 
      })
      .select()
      .single()
    
    if (error) throw error
    revalidatePath('/cart')
    return { success: true, data }
  }
}

export async function updateCartQuantityAction(cartItemId: string, quantity: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Oturum açmanız gerekiyor')
  }
  
  if (quantity <= 0) {
    return await removeFromCartAction(cartItemId)
  }
  
  const { data, error } = await supabase
    .from('cart_items')
    .update({ 
      quantity,
      updated_at: new Date().toISOString()
    })
    .eq('id', cartItemId)
    .eq('user_id', user.id)
    .select()
    .single()
  
  if (error) throw error
  
  revalidatePath('/cart')
  return { success: true, data }
}

export async function removeFromCartAction(cartItemId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Oturum açmanız gerekiyor')
  }
  
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId)
    .eq('user_id', user.id)
  
  if (error) throw error
  
  revalidatePath('/cart')
  return { success: true }
}

export async function clearCartAction() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Oturum açmanız gerekiyor')
  }
  
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id)
  
  if (error) throw error
  
  revalidatePath('/cart')
  return { success: true }
}
