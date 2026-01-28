import { z } from 'zod';

const addressDataSchema = z.object({
  full_name: z.string(),
  address_line1: z.string(),
  address_line2: z.string().optional(),
  city: z.string(),
  state: z.string().optional(),
  postal_code: z.string(),
  country: z.string(),
  phone: z.string(),
});

export const createOrderSchema = z.object({
  shipping_address: addressDataSchema,
  billing_address: addressDataSchema,
  notes: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'pending',
    'paid',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ]),
  payment_status: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
});

export type CreateOrderData = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusData = z.infer<typeof updateOrderStatusSchema>;
