import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    poll_id,
    option_id,
    country,
    device_type,
    browser_lang,
    age_group,
    gender,
    phone,
  } = body;

  const { error } = await supabase.from('votes').insert({
    poll_id,
    option_id,
    country: country || 'SK',
    device_type: device_type || 'desktop',
    browser_lang: browser_lang || 'sk',
    age_group,
    gender,
    phone: phone || null,
  });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
