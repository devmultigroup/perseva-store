'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { AddressData } from '@/types';

function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `ORD-${year}${month}-${random}`;
}

export async function createOrder(
  shippingAddress: AddressData,
  billingAddress: AddressData,
  notes?: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Oturum açmanız gerekiyor');
  }

  // Get cart items
  const { data: cartItems, error: cartError } = await supabase
    .from('cart_items')
    .select('*, product:products(*), variant:product_variants(*)')
    .eq('user_id', user.id);

  if (cartError) throw cartError;
  if (!cartItems || cartItems.length === 0) {
    throw new Error('Sepetiniz boş');
  }

  // Calculate totals
  let subtotal = 0;
  const orderItems = cartItems.map((item) => {
    const productPrice = item.product.base_price;
    const variantModifier = item.variant?.price_modifier || 0;
    const unitPrice = productPrice + variantModifier;
    const total = unitPrice * item.quantity;

    subtotal += total;

    return {
      product_id: item.product_id,
      variant_id: item.variant_id,
      product_name: item.product.name,
      variant_name: item.variant?.name || null,
      unit_price: unitPrice,
      quantity: item.quantity,
      total: total,
    };
  });

  const shippingCost = 50; // Sabit kargo ücreti - dinamik yapılabilir
  const taxRate = 0.18; // KDV %18
  const tax = subtotal * taxRate;
  const total = subtotal + shippingCost + tax;

  // Create order
  const orderNumber = generateOrderNumber();

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: user.id,
      status: 'pending',
      subtotal,
      shipping_cost: shippingCost,
      tax,
      total,
      shipping_address: shippingAddress,
      billing_address: billingAddress,
      payment_status: 'pending',
      notes: notes || null,
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // Create order items
  const orderItemsWithOrderId = orderItems.map((item) => ({
    ...item,
    order_id: order.id,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsWithOrderId);

  if (itemsError) throw itemsError;

  // Clear cart
  await supabase.from('cart_items').delete().eq('user_id', user.id);

  revalidatePath('/cart');
  revalidatePath('/orders');

  return order;
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
  paymentStatus?: string
) {
  const supabase = await createClient();

  const updates: {
    status: string;
    updated_at: string;
    payment_status?: string;
  } = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (paymentStatus) {
    updates.payment_status = paymentStatus;
  }

  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;

  revalidatePath('/admin/orders');
  revalidatePath('/orders');
  revalidatePath(`/orders/${orderId}`);

  return data;
}

export async function cancelOrder(orderId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Oturum açmanız gerekiyor');
  }

  // Get order to verify ownership
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (orderError) throw orderError;
  if (order.user_id !== user.id) {
    throw new Error('Bu siparişi iptal etme yetkiniz yok');
  }

  // Only allow cancellation if order is pending or paid
  if (!['pending', 'paid'].includes(order.status)) {
    throw new Error('Bu sipariş artık iptal edilemez');
  }

  const { data, error } = await supabase
    .from('orders')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;

  revalidatePath('/orders');
  revalidatePath(`/orders/${orderId}`);

  return data;
}
