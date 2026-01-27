import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/cart - Kullanıcının sepetini getir
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      )
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select('*, product:products(*), variant:product_variants(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Cart fetch error:', error)
    return NextResponse.json(
      { error: 'Sepet yüklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

// POST /api/cart - Sepete item ekle
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { product_id, variant_id, quantity = 1 } = body

    if (!product_id) {
      return NextResponse.json(
        { error: 'product_id gereklidir' },
        { status: 400 }
      )
    }

    // Check if item already exists
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', product_id)
      .eq('variant_id', variant_id || null)
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
        .select('*, product:products(*), variant:product_variants(*)')
        .single()

      if (error) throw error
      return NextResponse.json(data)
    } else {
      // Insert new item
      const { data, error } = await supabase
        .from('cart_items')
        .insert({ 
          user_id: user.id, 
          product_id, 
          variant_id: variant_id || null, 
          quantity 
        })
        .select('*, product:products(*), variant:product_variants(*)')
        .single()

      if (error) throw error
      return NextResponse.json(data, { status: 201 })
    }
  } catch (error) {
    console.error('Cart add error:', error)
    return NextResponse.json(
      { error: 'Sepete eklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

// DELETE /api/cart - Tüm sepeti temizle
export async function DELETE() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      )
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cart clear error:', error)
    return NextResponse.json(
      { error: 'Sepet temizlenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}
