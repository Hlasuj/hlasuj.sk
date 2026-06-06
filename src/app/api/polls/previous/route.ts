import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const now = new Date().toISOString();

  const { data: polls, error } = await supabase
    .from('polls')
    .select(
      `
      id,
      question,
      ends_at,
      poll_options (
        id,
        text,
        position
      )
    `
    )
    .eq('active', true)
    .not('ends_at', 'is', null)
    .lt('ends_at', now)
    .order('ends_at', { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  // Attach vote counts per option
  const pollIds = (polls ?? []).map((p) => p.id);
  if (pollIds.length === 0) return NextResponse.json([]);

  const { data: votes, error: vError } = await supabase
    .from('votes')
    .select('poll_id, option_id')
    .in('poll_id', pollIds);

  if (vError)
    return NextResponse.json({ error: vError.message }, { status: 500 });

  const countMap: Record<string, number> = {};
  for (const v of votes ?? []) {
    countMap[v.option_id] = (countMap[v.option_id] ?? 0) + 1;
  }

  const result = (polls ?? []).map((p) => ({
    ...p,
    poll_options: p.poll_options
      .sort(
        (a: { position: number }, b: { position: number }) =>
          a.position - b.position
      )
      .map((o: { id: string; text: string; position: number }) => ({
        ...o,
        votes: countMap[o.id] ?? 0,
      })),
  }));

  return NextResponse.json(result);
}
