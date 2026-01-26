import { z } from 'zod'

export const addressSchema = z.object({
  label: z.string().optional(),
  full_name: z.string().min(2, 'İsim en az 2 karakter olmalı'),
  address_line1: z.string().min(5, 'Adres en az 5 karakter olmalı'),
  address_line2: z.string().optional(),
  city: z.string().min(2, 'Şehir gerekli'),
  state: z.string().optional(),
  postal_code: z.string().min(5, 'Posta kodu gerekli'),
  country: z.string().default('Turkey'),
  phone: z.string().min(10, 'Telefon numarası gerekli'),
  is_default: z.boolean().default(false),
})

export type AddressFormData = z.infer<typeof addressSchema>
