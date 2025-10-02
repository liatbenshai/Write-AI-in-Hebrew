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

    const system = `את עורכת דין ישראלית ותיקה ומנוסה בכתיבת מסמכים משפטיים לבתי משפט בישראל.

תפקידך: לזהות טקסטים שנכתבו על ידי AI (Claude, ChatGPT, Gemini) - שהם "עברית שהיא בעצם אנגלית מתורגמת" - ולהפוך אותם לעברית משפטית אמיתית, תמציתית וטבעית כפי שנכתבת בפועל במסמכים משפטיים ישראליים.`

    const instruction = [
      '## כללי הזהב לעברית משפטית:',
      '1. תמציתיות - אל תשתמש ב-10 מילים כשאפשר ב-5',
      '2. בהירות - כל משפט צריך להיות ברור מיד',
      '3. משפטים קצרים - עד 2-3 שורות מקסימום',
      '4. הימנע מ-"אשר" מיותר - רק כשבאמת נחוץ',
      '5. שימוש נכון ב-"את" - לעולם לא לפני פועל!',
      '',
      '## בעיות נפוצות של AI שחייבות לתקן:',
      '',
      '### משפטים ארוכים מדי:',
      '❌ משפט של 4+ שורות עם הרבה "אשר"',
      '✅ חלק ל-2-3 משפטים קצרים וברורים',
      '',
      '### שימוש מופרז ב-"אשר":',
      '❌ "הצדדים אשר... לעורך הדין אשר... השירותים אשר..."',
      '✅ השאר רק "אשר" נחוץ, השתמש ב-"ש", "המפורטים", "כאמור"',
      '',
      '### שימוש שגוי ב-"את":',
      '❌ "נבקש מבית המשפט את לדחות" (לעולם לא "את" לפני פועל!)',
      '❌ "עורך הדין יעשה את הטיפול" (מיותר)',
      '✅ "נבקש מבית המשפט לדחות"',
      '✅ "עורך הדין יטפל בעניין"',
      '',
      '### אנגליציזמים:',
      '❌ "בנוסף לכך" → ✅ "נוסף על כך" או "יתרה מזאת"',
      '❌ "באופן כזה" → ✅ "באופן זה" או "כך"',
      '❌ "הדבר הזה" → ✅ "דבר זה"',
      '❌ "יש לציין כי" → ✅ "יצוין" או "ראוי לציין"',
      '❌ "אני רוצה לבקש" → ✅ "הנני מבקש/ת"',
      '',
      '### מונחים משפטיים נכונים:',
      '✅ שכר-טרחה (לא "שכר עבודה")',
      '✅ בא-כוח, ב"כ (לא "נציג משפטי")',
      '✅ התובע/ת (לא "המתלונן/ת" בתיק אזרחי)',
      '✅ כתב תביעה (לא "תלונה")',
      '✅ התנגדות (לא "אובייקציה")',
      '✅ עיזבון (לא "ירושה" בהקשר משפטי)',
      '',
      '### ביטויים משפטיים סטנדרטיים - השתמש כמו שהם:',
      '✅ "כמפורט להלן"',
      '✅ "כאמור לעיל"',
      '✅ "למען הסר ספק"',
      '✅ "ככל שיידרש"',
      '✅ "בכפוף לאמור"',
      '✅ "מבלי לגרוע מהאמור"',
      '✅ "הצדדים מסכימים כדלקמן:"',
      '✅ "בגין השירותים"',
      '',
      '### חלוקה לסעיפים:',
      '✅ כשיש כמה נושאים - חלק לסעיפים ממוספרים (.1, .2, .3)',
      '✅ תת-סעיפים: א., ב., ג.',
      '✅ כל סעיף = רעיון אחד ברור',
      '',
      '### שימוש ב-"כאמור" במקום חזרה:',
      '❌ "בגין השירותים המשפטיים שפורטו בסעיף 1"',
      '✅ "בגין השירותים כאמור בסעיף 1"',
      '',
      userDna,
      '',
      '## דוגמה מלאה:',
      'לפני: "הצדדים אשר מגיעים לכאן מסכימים כי עורך הדין אשר שמו נזכר לעיל יספק שירותים אשר יכללו ייצוג..."',
      'אחרי: "הצדדים מסכימים כדלקמן: .1 עו"ד בן-שי יספק שירותים משפטיים הכוללים ייצוג משפטי מלא."',
      '',
      'החזר JSON: {"improvedText": "...", "changes": ["הסרת אשר מיותר", "קיצור משפטים"], "qualityScore": 8}',
    ].filter(Boolean).join('\n')

    // Stage 1: smart chunking for long texts (legal)
    const splitParagraphs = (t: string): string[] => {
      const paras = t.replace(/\r/g, '').split(/\n{2,}/).map(p => p.trim()).filter(Boolean)
      const out: string[] = []
      for (const p of paras) {
        if (p.length <= 1200) { out.push(p); continue }
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
      const user = `קונטקסט קודם (לשמירת עקביות מונחים משפטיים וסגנון):\n${priorContext}\n\nפסקה לתיקון:\n${chunk}`
      const resp = await client.messages.create({
        model: process.env.CLAUDE_MODEL || 'claude-3-haiku-20240307',
        max_tokens: 1200,
        temperature: 0.2,
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
    const legalPref = [/בהתאם ל/, /ככל ש/, /למען הסר ספק/, /לעניין זה/]
    const anglicisms = [/יש לציין כי/, /בנוסף לכך/, /באופן אשר/]
    let delta = 6
    anglicisms.forEach(r => { if (r.test(before) && !r.test(txt)) delta += 1 })
    legalPref.forEach(r => { if (r.test(txt)) delta += 0.5 })
    const score = Math.min(10, Math.max(1, Math.round(delta + Math.min(3, changedCount * 0.5))))
    return NextResponse.json({ improvedText: txt, changes: allChanges, qualityScore: score, improvements: changedCount })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
}


