'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  if (!data.email || !data.password) {
    return { error: 'E-posta ve şifre gereklidir' }
  }

  const { error, data: authData } = await supabase.auth.signInWithPassword(data)

  if (error) {
    // Türkçe hata mesajları
    let errorMessage = error.message
    if (error.message.includes('Invalid login credentials')) {
      errorMessage = 'E-posta veya şifre hatalı'
    } else if (error.message.includes('Email not confirmed')) {
      errorMessage = 'E-posta adresinizi doğrulamanız gerekiyor'
    }
    return { error: errorMessage }
  }

  if (authData?.user) {
    revalidatePath('/', 'layout')
    return { success: true }
  }

  return { error: 'Giriş yapılamadı' }
}

export async function signup(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('full_name') as string,
      },
    },
  }

  if (!data.email || !data.password || !data.options.data.full_name) {
    return { error: 'Tüm alanlar gereklidir' }
  }

  if (data.password.length < 6) {
    return { error: 'Şifre en az 6 karakter olmalıdır' }
  }

  const { error, data: authData } = await supabase.auth.signUp(data)

  if (error) {
    let errorMessage = error.message
    if (error.message.includes('already registered')) {
      errorMessage = 'Bu e-posta adresi zaten kayıtlı'
    } else if (error.message.includes('Password')) {
      errorMessage = 'Şifre çok zayıf'
    }
    return { error: errorMessage }
  }

  if (authData?.user) {
    revalidatePath('/', 'layout')
    return { success: true }
  }

  return { error: 'Kayıt oluşturulamadı' }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
