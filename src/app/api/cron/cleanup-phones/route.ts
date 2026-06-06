import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get('authorization');

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();

  // Find polls where ends_at + phone_retention_days is in the past
  const { data: polls, error: pollsError } = await supabase
    .from('polls')
    .select('id, ends_at, phone_retention_days')
    .not('ends_at', 'is', null);

  if (pollsError)
    return NextResponse.json({ error: pollsError.message }, { status: 500 });

  const expiredPollIds = (polls ?? [])
    .filter((p) => {
      const retentionDays = p.phone_retention_days ?? 30;
      const cutoff = new Date(p.ends_at);
      cutoff.setDate(cutoff.getDate() + retentionDays);
      return cutoff < now;
    })
    .map((p) => p.id);

  if (expiredPollIds.length === 0) {
    return NextResponse.json({
      cleared: 0,
      message: 'No polls past retention period',
    });
  }

  const { data, error } = await supabase
    .from('votes')
    .update({ phone: null })
    .in('poll_id', expiredPollIds)
    .not('phone', 'is', null)
    .select('id');

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const cleared = data?.length ?? 0;
  console.log(
    `[cleanup-phones] Cleared ${cleared} phone numbers from ${expiredPollIds.length} expired polls`
  );

  return NextResponse.json({ cleared, polls: expiredPollIds.length });
}
