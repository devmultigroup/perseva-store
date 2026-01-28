'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { loginSchema, registerSchema } from '@/schemas/auth.schema';

type AuthActionState = { error?: string; success?: boolean } | null;

export async function login(prevState: AuthActionState, formData: FormData) {
  const supabase = await createClient();

  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const parsed = loginSchema.safeParse(raw);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    const message = firstError?.message ?? 'Geçersiz giriş bilgileri';
    return { error: message };
  }

  const { error, data: authData } = await supabase.auth.signInWithPassword(
    parsed.data
  );

  if (error) {
    // Türkçe hata mesajları
    let errorMessage = error.message;
    if (error.message.includes('Invalid login credentials')) {
      errorMessage = 'E-posta veya şifre hatalı';
    } else if (error.message.includes('Email not confirmed')) {
      errorMessage = 'E-posta adresinizi doğrulamanız gerekiyor';
    }
    return { error: errorMessage };
  }

  if (authData?.user) {
    revalidatePath('/', 'layout');
    return { success: true };
  }

  return { error: 'Giriş yapılamadı' };
}

export async function signup(prevState: AuthActionState, formData: FormData) {
  const supabase = await createClient();

  const raw = {
    full_name: formData.get('full_name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  };

  const parsed = registerSchema.safeParse(raw);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    const message = firstError?.message ?? 'Geçersiz kayıt bilgileri';
    return { error: message };
  }

  const { full_name, email, password } = parsed.data;

  const { error, data: authData } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
      },
    },
  });

  if (error) {
    let errorMessage = error.message;
    if (error.message.includes('already registered')) {
      errorMessage = 'Bu e-posta adresi zaten kayıtlı';
    } else if (error.message.includes('Password')) {
      errorMessage = 'Şifre çok zayıf';
    }
    return { error: errorMessage };
  }

  if (authData?.user) {
    revalidatePath('/', 'layout');
    return { success: true };
  }

  return { error: 'Kayıt oluşturulamadı' };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}
