import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkAdminAuth } from '@/lib/auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAdminAuth(req))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const {
    question,
    active,
    collect_phone,
    starts_at,
    ends_at,
    phone_retention_days,
    options,
  } = await req.json();

  if (
    question !== undefined ||
    active !== undefined ||
    collect_phone !== undefined ||
    starts_at !== undefined ||
    ends_at !== undefined ||
    phone_retention_days !== undefined
  ) {
    const updates: Record<string, unknown> = {};
    if (question !== undefined) updates.question = question;
    if (active !== undefined) updates.active = active;
    if (collect_phone !== undefined) updates.collect_phone = collect_phone;
    if (starts_at !== undefined) updates.starts_at = starts_at || null;
    if (ends_at !== undefined) updates.ends_at = ends_at || null;
    if (phone_retention_days !== undefined)
      updates.phone_retention_days = phone_retention_days ?? null;

    const { error } = await supabase.from('polls').update(updates).eq('id', id);
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (options !== undefined) {
    const { error: delError } = await supabase
      .from('poll_options')
      .delete()
      .eq('poll_id', id);
    if (delError)
      return NextResponse.json({ error: delError.message }, { status: 500 });

    const optRows = options.map((text: string, i: number) => ({
      poll_id: id,
      text,
      position: i,
    }));
    const { error: insError } = await supabase
      .from('poll_options')
      .insert(optRows);
    if (insError)
      return NextResponse.json({ error: insError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAdminAuth(req))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const { error } = await supabase.from('polls').delete().eq('id', id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
