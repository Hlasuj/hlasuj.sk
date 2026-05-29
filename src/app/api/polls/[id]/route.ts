import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { question, active, collect_phone, options } = await req.json()

  if (question !== undefined || active !== undefined || collect_phone !== undefined) {
    const updates: Record<string, unknown> = {}
    if (question !== undefined) updates.question = question
    if (active !== undefined) updates.active = active
    if (collect_phone !== undefined) updates.collect_phone = collect_phone

    const { error } = await supabase.from('polls').update(updates).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (options !== undefined) {
    // Replace all options
    const { error: delError } = await supabase.from('poll_options').delete().eq('poll_id', id)
    if (delError) return NextResponse.json({ error: delError.message }, { status: 500 })

    const optRows = options.map((text: string, i: number) => ({
      poll_id: id,
      text,
      position: i,
    }))
    const { error: insError } = await supabase.from('poll_options').insert(optRows)
    if (insError) return NextResponse.json({ error: insError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { error } = await supabase.from('polls').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
