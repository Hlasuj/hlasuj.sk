import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const pollId = req.nextUrl.searchParams.get('poll_id');

  let query = supabase
    .from('votes')
    .select(
      'poll_id, option_id, timestamp, country, device_type, browser_lang, age_group, gender'
    )
    .order('timestamp', { ascending: false });

  if (pollId) query = query.eq('poll_id', pollId);

  const { data, error } = await query;
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
