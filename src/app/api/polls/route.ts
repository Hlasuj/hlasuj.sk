import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  const { data: polls, error } = await supabase
    .from('polls')
    .select(`
      id,
      question,
      active,
      collect_phone,
      poll_options (
        id,
        text,
        position
      )
    `)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(polls)
}

export async function POST(req: NextRequest) {
  const { question, options, active, collect_phone } = await req.json()
  if (!question || !options || options.length < 2)
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })

  const { data: poll, error: pollError } = await supabase
    .from('polls')
    .insert({ question, active: active ?? false, collect_phone: collect_phone ?? false })
    .select()
    .single()

  if (pollError) return NextResponse.json({ error: pollError.message }, { status: 500 })

  const optRows = options.map((text: string, i: number) => ({
    poll_id: poll.id,
    text,
    position: i,
  }))

  const { error: optError } = await supabase.from('poll_options').insert(optRows)
  if (optError) return NextResponse.json({ error: optError.message }, { status: 500 })

  return NextResponse.json({ id: poll.id })
}
