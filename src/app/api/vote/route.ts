import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { poll_id, option_id, country, device_type, browser_lang, age_group, gender } = body

  const { error } = await supabase.from('votes').insert({
    poll_id,
    option_id,
    country: country || 'SK',
    device_type: device_type || 'desktop',
    browser_lang: browser_lang || 'sk',
    age_group,
    gender,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}