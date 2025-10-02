import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

type Body = {
  baseText: string
}

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    let body: Body
    try { body = await req.json() } catch { body = JSON.parse(await req.text()) }
    if (!body?.baseText) return NextResponse.json({ error: 'Missing baseText' }, { status: 400 })

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'Missing ANTHROPIC_API_KEY' }, { status: 500 })
    const client = new Anthropic({ apiKey })

    const system = 'את/ה עורך/ת דין ישראלי/ת מנוסה. הרחב/י טקסט בסיסי לניסוח משפטי עשיר ומקצועי — ללא הוספת עובדות חדשות.'

    // יעד אורך מינימלי: פי 3 מהמילים בקלט, אך לא פחות מסף בסיסי
    const countWords = (t: string) => (t.trim().match(/\S+/g)?.length || 0)
    const baseWords = countWords(body.baseText)
    const minWords = Math.max(180, Math.ceil(baseWords * 3))

    const instruction = `הנחיות הרחבה (ללא המצאה):
1) אין להמציא עובדות: השתמש/י אך ורק במה שמופיע בטקסט. אם חסר פרט — השאר/י placeholder בסוגריים מרובעים [תאריך], [סכום], [כתובת].
2) העשרת ניסוח משפטי: הפוך/הפכי משפטים פשוטים ללשון משפטית מקצועית; שלב/י ביטויים כגון "מכאן עולה כי", "מן האמור לעיל משתמע", "נמצא אפוא", "לאור האמור".
3) פסקאות ארוכות ומפורטות: בנה/י פסקאות רציפות, מחוברות לוגית, באורך כפול לפחות מהקלט (פי 2+), עם חיבורים משפטיים בין רעיונות.
4) מבנה מקצועי: חלק/י לכותרות משנה (עובדות; ניתוח; מסקנות; סעדים); מספור פסקאות; זרימה לוגית עובדות → ניתוח → מסקנה.
5) טיעונים כלליים בלבד: אל תצטט/י חוקים/תקנות/פסיקה ספציפיים. מותר להשתמש בנוסחים כלליים כגון "בהתאם לעקרונות המשפט האזרחי", "על פי עקרון תום הלב", "עקרונות הצדק וההגינות".
6) הרחבת טיעונים קיימים: פיתוח נימוקים מהעובדות שניתנו; ניתוח ההשלכות; הדגשת חומרת ההפרה; פיתוח טיעוני נזק — אך רק ממה שקיים.
7) הערות למחקר נוסף: בסוף המסמך הוסף/י סעיף נקודתי עם הצעות מחקר (למשל: "יש לבדוק תקדימים בנושא ___", "מומלץ לחפש פסיקה בנושא ___").
פורמט מבוקש:
כותרת: "נוסח מורחב (ללא הוספת עובדות)"
סעיפים ממוספרים תחת כותרות: עובדות; ניתוח; מסקנות; סעדים; הערות למחקר נוסף.
אורך יעד מינימלי לפלט: ${minWords} מילים (לפחות).`

    const user = `טקסט בסיסי להרחבה (לא להוסיף עובדות חדשות):\n${body.baseText}`
    const resp = await client.messages.create({
      model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20240620',
      max_tokens: 3000,
      temperature: 0.2,
      system,
      messages: [{ role: 'user', content: `${instruction}\n\n${user}` }],
    })

    const first = resp?.content?.[0] as any
    let text = (first?.text ?? '').toString().trim()

    let tries = 0
    while (countWords(text) < minWords && tries < 5) {
      const expandMore = await client.messages.create({
        model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20240620',
        max_tokens: 3000,
        temperature: 0.2,
        system,
        messages: [{
          role: 'user',
          content:
            `הרחב/י עוד ללא הוספת עובדות חדשות, הארך/האריכי פסקאות וחברי רעיונות משפטיים בצורה רציפה ומנומקת; הימנע/י מחזרה טקסטואלית. ` +
            `שמור/י על עקרונות כלליים בלבד (ללא חקיקה/פסיקה ספציפית). ` +
            `יעד אורך מינימלי כולל: ${minWords} מילים. ` +
            `המשך/המשיכי מאותו המקום, הוסף/י עומק והרחבות מבניות.\n\נהטקסט הקיים עד כה:\n${text}`,
        }],
      })
      const more = (expandMore?.content?.[0] as any)?.text?.toString()?.trim() || ''
      if (more) {
        text = text + "\n\n" + more
      } else {
        break
      }
      tries++
    }

    return NextResponse.json({ expandedText: text, minWords, actualWords: countWords(text) })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}

export async function GET() { return NextResponse.json({ ok: true }) }


