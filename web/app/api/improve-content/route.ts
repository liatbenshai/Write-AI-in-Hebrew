import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

type Body = { text: string; dnaExamples?: Array<{ before: string; after: string; comment?: string }>; rephrase?: boolean; synonyms?: string[] }

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    let body: Body
    try { body = await req.json() } catch { body = JSON.parse(await req.text()) }
    if (!body?.text) return NextResponse.json({ error: 'Missing text' }, { status: 400 })
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'Missing ANTHROPIC_API_KEY' }, { status: 500 })

    const client = new Anthropic({ apiKey })

    const userDna = Array.isArray(body.dnaExamples) && body.dnaExamples.length > 0
      ? `דוגמאות אישיות (לפני→אחרי+הערות):\n${body.dnaExamples.slice(-5).map((ex, i) => `#${i+1}\nלפני: ${ex.before}\nאחרי: ${ex.after}\nהערות: ${ex.comment || ''}`).join('\n\n')}`
      : ''

    const system = `את עורכת לשון ומומחית עברית ישראלית בכירה. תפקידך: להפוך טקסטים של AI (שהם "עברית שהיא בעצם אנגלית מתורגמת") לעברית תקנית, ספרותית וטבעית.`

    const instruction = [
      '## עקרונות יסוד:',
      '1. תמציתיות - אל תשתמש ב-10 מילים כשאפשר ב-5',
      '2. בהירות - כל משפט ברור מיד',
      '3. משפטים קצרים - עד 2-3 שורות',
      '4. הימנע מ-"אשר" מיותר',
      '5. סדר מילים עברי טבעי',
      '',
      '## תקן את הבעיות הנפוצות של AI:',
      '',
      '### משפטים ארוכים:',
      '❌ משפט של 4+ שורות',
      '✅ חלק ל-2-3 משפטים קצרים',
      '',
      '### "אשר" מופרז (הבעיה הגדולה ביותר!):',
      '❌ "הצדדים אשר... עורך הדין אשר... השירותים אשר..."',
      '✅ רק "אשר" נחוץ, אחרת: "ש", "המפורטים", "כאמור", "הנ"ל"',
      'דוגמה: "השירותים אשר יפורטו" → "השירותים המפורטים להלן"',
      '',
      '### "את" שגוי (שגיאה קריטית!):',
      '❌ "נבקש את לדחות" (לעולם לא "את" לפני פועל!)',
      '❌ "עורך הדין יעשה את הטיפול" (מיותר)',
      '✅ "נבקש לדחות"',
      '✅ "עורך הדין יטפל"',
      '',
      '### אנגליציזמים:',
      '❌ "בנוסף לכך" → ✅ "נוסף על כך"',
      '❌ "באופן כזה" → ✅ "כך" או "באופן זה"',
      '❌ "הדבר הזה" → ✅ "דבר זה"',
      '❌ "יש לציין כי" → ✅ "יצוין"',
      '',
      '### חזרות מיותרות:',
      '❌ "בגין השירותים המשפטיים שפורטו בסעיף 1"',
      '✅ "בגין השירותים כאמור" או "בגין השירותים הנ"ל"',
      '',
      '### ביטויים סטנדרטיים - השתמש כמו שהם:',
      '✅ "כמפורט להלן" (לא "כמפורט למטה")',
      '✅ "כאמור לעיל"',
      '✅ "הצדדים מסכימים כדלקמן:"',
      '✅ "למען הסר ספק"',
      '✅ "בכפוף לאמור"',
      '',
      userDna,
      '',
      'דוגמה:',
      'לפני: "הצדדים אשר מגיעים לכאן מסכימים כי עורך הדין אשר שמו נזכר לעיל יספק שירותים אשר יכללו..."',
      'אחרי: "הצדדים מסכימים כדלקמן: עו"ד בן-שי יספק שירותים משפטיים הכוללים..."',
      '',
      'החזר JSON: {"improvedText": "...", "changes": ["הסרת 3 מילות אשר", "קיצור משפט"], "qualityScore": 8}',
    ].filter(Boolean).join('\n')

    // Stage 1: smart chunking for long texts
    const splitParagraphs = (t: string): string[] => {
      const paras = t.replace(/\r/g, '').split(/\n{2,}/).map(p => p.trim()).filter(Boolean)
      const out: string[] = []
      for (const p of paras) {
        if (p.length <= 1200) { out.push(p); continue }
        // further split by sentence boundaries
        const sentences = p.split(/(?<=[\.?\!])\s+/)
        let buf = ''
        for (const s of sentences) {
          if ((buf + ' ' + s).trim().length > 900 && buf) { out.push(buf.trim()); buf = s }
          else { buf = (buf ? buf + ' ' : '') + s }
        }
        if (buf.trim()) out.push(buf.trim())
      }
      return out
    }

    const improveChunk = async (chunk: string, priorContext: string): Promise<{ text: string; changes: string[] }> => {
      const user = `קונטקסט קודם (לשמירת עקביות מונחים וסגנון):\n${priorContext}\n\nפסקה לתיקון:\n${chunk}`
      const resp = await client.messages.create({
        model: process.env.CLAUDE_MODEL || 'claude-3-haiku-20240307',
        max_tokens: 1200,
        temperature: 0.3,
        system,
        messages: [{ role: 'user', content: `${instruction}\n\n${user}` }],
      })
      const first = resp?.content?.[0] as any
      const raw = (first?.text ?? '').toString().trim().replace(/^```[a-zA-Z]*\n?/, '').replace(/```\s*$/, '')
      try {
        const obj = JSON.parse(raw)
        return { text: String(obj.improvedText || ''), changes: Array.isArray(obj.changes) ? obj.changes : [] }
      } catch {
        return { text: raw, changes: [] }
      }
    }

    const paragraphs = splitParagraphs(body.text || '')
    let improvedAll: string[] = []
    let allChanges: string[] = []
    let contextTail = ''
    if (paragraphs.length > 1) {
      for (const para of paragraphs) {
        const { text: imp, changes } = await improveChunk(para, contextTail)
        improvedAll.push(imp)
        allChanges = allChanges.concat(changes)
        contextTail = (contextTail + ' ' + imp).slice(-600)
      }
    } else {
      const { text: imp, changes } = await improveChunk(body.text, '')
      improvedAll.push(imp)
      allChanges = changes
    }

    const txt = improvedAll.join('\n\n')
    const before = body.text || ''
    const changedCount = allChanges.length || Math.max(0, Math.round(Math.abs(txt.length - before.length) / 50))
    const anglicisms = [/יש לציין כי/, /בנוסף לכך/, /באופן אשר/]
    const connectors = [/לכן/, /עם זאת/, /כמו כן/, /מצד שני/]
    let delta = 5
    anglicisms.forEach(r => { if (r.test(before) && !r.test(txt)) delta += 1 })
    connectors.forEach(r => { if (r.test(txt)) delta += 0.5 })
    const score = Math.min(10, Math.max(1, Math.round(delta + Math.min(3, changedCount * 0.5))))
    return NextResponse.json({ improvedText: txt, changes: allChanges, qualityScore: score, improvements: changedCount })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
}


