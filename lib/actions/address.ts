'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createAddress(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Oturum açmanız gerekiyor')
  }
  
  const isDefault = formData.get('is_default') === 'true'
  
  // If this is set as default, unset other defaults
  if (isDefault) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', user.id)
  }
  
  const address = {
    user_id: user.id,
    label: formData.get('label') as string || null,
    full_name: formData.get('full_name') as string,
    address_line1: formData.get('address_line1') as string,
    address_line2: formData.get('address_line2') as string || null,
    city: formData.get('city') as string,
    state: formData.get('state') as string || null,
    postal_code: formData.get('postal_code') as string,
    country: formData.get('country') as string || 'Turkey',
    phone: formData.get('phone') as string,
    is_default: isDefault,
  }
  
  const { data, error } = await supabase
    .from('addresses')
    .insert(address)
    .select()
    .single()
  
  if (error) throw error
  
  revalidatePath('/profile')
  revalidatePath('/checkout')
  return data
}

export async function updateAddress(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Oturum açmanız gerekiyor')
  }
  
  const isDefault = formData.get('is_default') === 'true'
  
  // If this is set as default, unset other defaults
  if (isDefault) {
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', user.id)
      .neq('id', id)
  }
  
  const updates = {
    label: formData.get('label') as string || null,
    full_name: formData.get('full_name') as string,
    address_line1: formData.get('address_line1') as string,
    address_line2: formData.get('address_line2') as string || null,
    city: formData.get('city') as string,
    state: formData.get('state') as string || null,
    postal_code: formData.get('postal_code') as string,
    country: formData.get('country') as string || 'Turkey',
    phone: formData.get('phone') as string,
    is_default: isDefault,
  }
  
  const { data, error } = await supabase
    .from('addresses')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()
  
  if (error) throw error
  
  revalidatePath('/profile')
  revalidatePath('/checkout')
  return data
}

export async function deleteAddress(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Oturum açmanız gerekiyor')
  }
  
  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
  
  if (error) throw error
  
  revalidatePath('/profile')
  revalidatePath('/checkout')
}

export async function setDefaultAddress(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Oturum açmanız gerekiyor')
  }
  
  // Unset all defaults
  await supabase
    .from('addresses')
    .update({ is_default: false })
    .eq('user_id', user.id)
  
  // Set this as default
  const { data, error } = await supabase
    .from('addresses')
    .update({ is_default: true })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()
  
  if (error) throw error
  
  revalidatePath('/profile')
  revalidatePath('/checkout')
  return data
}
