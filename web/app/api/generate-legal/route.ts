import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

type GenBody = {
  brief: string
  dnaExamples?: Array<{ before: string; after: string }>
}

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    let body: GenBody
    try { body = await req.json() } catch { body = JSON.parse(await req.text()) }
    if (!body?.brief) return NextResponse.json({ error: 'Missing brief' }, { status: 400 })

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'Missing ANTHROPIC_API_KEY' }, { status: 500 })

    const client = new Anthropic({ apiKey })
    const dna = Array.isArray(body.dnaExamples) && body.dnaExamples.length
      ? `דוגמאות אישיות:\n${body.dnaExamples.slice(-3).map((x,i)=>`#${i+1}\nלפני: ${x.before}\nאחרי: ${x.after}`).join('\n\n')}`
      : ''

    const system = 'את/ה מחבר/ת מסמכים משפטיים בעברית תקנית לפי דין ישראלי. הימנע/י מהמצאות; אם חסר מידע, בקש/י הבהרה.'
    const instruction = `מטרה: טיוטת כתב טענות בעברית תקנית, רשמית ומדויקת.\nמינוח: משפטי ישראלי, מבנה פסקאות ורשימות מסודר.\n${dna}\nכלול/י כותרות, טענות, סעדים וסיכום. אם חסר מידע - ציין/י במפורש.`
    const user = `בריף:\n${body.brief}`

    const resp = await client.messages.create({
      model: process.env.CLAUDE_MODEL || 'claude-3-haiku-20240307',
      max_tokens: 3000,
      temperature: 0.2,
      system,
      messages: [{ role: 'user', content: `${instruction}\n\n${user}` }],
    })
    const first = resp?.content?.[0] as any
    const content = first?.text || ''
    return NextResponse.json({ content })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}


