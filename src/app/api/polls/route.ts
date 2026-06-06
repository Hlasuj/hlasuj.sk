import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/auth';

const POLL_SELECT = `
  id,
  question,
  active,
  collect_phone,
  starts_at,
  ends_at,
  phone_retention_days,
  poll_options (
    id,
    text,
    position
  )
`;

export async function GET(req: NextRequest) {
  const isAdmin = req.nextUrl.searchParams.get('admin') === 'true';

  if (isAdmin && !checkAdminAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (isAdmin) {
    const { data, error } = await supabase
      .from('polls')
      .select(POLL_SELECT)
      .order('created_at', { ascending: false });
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  // Voter view: active polls within schedule window
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('polls')
    .select(POLL_SELECT)
    .eq('active', true)
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .or(`ends_at.is.null,ends_at.gte.${now}`)
    .order('created_at', { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  // Fallback: if no active polls, return the most recently expired poll (read-only)
  if (data.length === 0) {
    const { data: fallback } = await supabase
      .from('polls')
      .select(POLL_SELECT)
      .eq('active', true)
      .not('ends_at', 'is', null)
      .lt('ends_at', now)
      .order('ends_at', { ascending: false })
      .limit(1);

    if (fallback?.length) {
      return NextResponse.json(fallback.map((p) => ({ ...p, expired: true })));
    }
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!checkAdminAuth(req))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const {
    question,
    options,
    active,
    collect_phone,
    starts_at,
    ends_at,
    phone_retention_days,
  } = await req.json();
  if (!question || !options || options.length < 2)
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

  const { data: poll, error: pollError } = await supabase
    .from('polls')
    .insert({
      question,
      active: active ?? false,
      collect_phone: collect_phone ?? false,
      starts_at: starts_at || null,
      ends_at: ends_at || null,
      phone_retention_days: phone_retention_days ?? null,
    })
    .select()
    .single();

  if (pollError)
    return NextResponse.json({ error: pollError.message }, { status: 500 });

  const optRows = options.map((text: string, i: number) => ({
    poll_id: poll.id,
    text,
    position: i,
  }));

  const { error: optError } = await supabase
    .from('poll_options')
    .insert(optRows);
  if (optError)
    return NextResponse.json({ error: optError.message }, { status: 500 });

  return NextResponse.json({ id: poll.id });
}
