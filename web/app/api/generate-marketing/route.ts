import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

type GenBody = {
  topic: string
  audience?: { persona?: string; tone?: string }
  dnaExamples?: Array<{ before: string; after: string }>
}

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    let body: GenBody
    try { body = await req.json() } catch { body = JSON.parse(await req.text()) }
    if (!body?.topic) return NextResponse.json({ error: 'Missing topic' }, { status: 400 })

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'Missing ANTHROPIC_API_KEY' }, { status: 500 })

    const client = new Anthropic({ apiKey })
    const dna = Array.isArray(body.dnaExamples) && body.dnaExamples.length
      ? `דוגמאות אישיות:\n${body.dnaExamples.slice(-3).map((x,i)=>`#${i+1}\nלפני: ${x.before}\nאחרי: ${x.after}`).join('\n\n')}`
      : ''

    const sys = 'את/ה יוצר/ת תוכן שיווקי בעברית ישראלית טבעית, בהירה ומשכנעת, ללא קלישאות.'
    const aud = body.audience?.persona ? `פרסונה: ${body.audience.persona}.` : ''
    const t = body.audience?.tone ? `טון: ${body.audience.tone}.` : ''
    const instruction = `מטרה: מאמר/פסקאות שיווק בעברית ישראלית. ${aud} ${t}\nהימנע/י מתרגומית, רווחי פיסוק תקינים, RTL תקין.\n${dna}\nכלול/י פתיח, תועלות, הוכחות חברתיות וקריאה לפעולה.`
    const user = `נושא: ${body.topic}`

    const resp = await client.messages.create({
      model: process.env.CLAUDE_MODEL || 'claude-3-haiku-20240307',
      max_tokens: 2000,
      temperature: 0.3,
      system: sys,
      messages: [{ role: 'user', content: `${instruction}\n\n${user}` }],
    })
    const first = resp?.content?.[0] as any
    const content = first?.text || ''
    return NextResponse.json({ content })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}


