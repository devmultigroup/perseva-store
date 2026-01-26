import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Kategoriler yüklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}
