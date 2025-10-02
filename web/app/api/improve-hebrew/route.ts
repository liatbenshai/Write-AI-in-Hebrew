import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

function detectGenre(sample: string): 'legal'|'marketing'|'academic' {
  const s = (sample || '').toLowerCase()
  const legalHints = [/סעד/, /כתב טענות/, /בהתאם ל/, /תקנה/, /סעיף/, /חוזה/, /הנני/, /ערכאה/]
  const academicHints = [/מחקר/, /ממצא/, /שיטה/, /סקירה ספרותית/, /ביבליוגרפיה/, /הפניה\s*\[/]
  let scoreL = legalHints.reduce((a,r)=>a+(r.test(s)?1:0),0)
  let scoreA = academicHints.reduce((a,r)=>a+(r.test(s)?1:0),0)
  if (scoreL >= 2 && scoreL > scoreA) return 'legal'
  if (scoreA >= 2 && scoreA > scoreL) return 'academic'
  return 'marketing'
}

function isLegalStyle(text: string): boolean {
  const hasSecondPerson = /(אתם|אתה|את|שלכם|שלך)/.test(text)
  const hasCTA = /(צרו קשר|הצטרפו|כדאי|בואו)/.test(text)
  return !hasSecondPerson && !hasCTA
}

function isMarketingStyle(text: string): boolean {
  const secondPerson = /(אתם|שלכם|את|אתה)/.test(text)
  return secondPerson
}

type ImproveBody = {
  text: string
  type: 'legal' | 'content' | 'academic' // 'content' = שיווקי/מדובר
  dnaExamples?: Array<{ before: string; after: string; type: 'legal' | 'content'; comment?: string }>
  rephrase?: boolean
  synonyms?: string[]
}

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    // Robust body parsing to avoid encoding/JSON issues
    let body: ImproveBody
    try {
      body = (await req.json()) as ImproveBody
    } catch {
      const txt = await req.text()
      body = JSON.parse(txt) as ImproveBody
    }
    if (!body?.text || (body.type !== 'legal' && body.type !== 'content' && body.type !== 'academic')) {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing ANTHROPIC_API_KEY' }, { status: 500 })
    }

    const client = new Anthropic({ apiKey })

    const detected = detectGenre(body.text)
    const targetGenre = body.type === 'legal' ? 'legal' : body.type === 'academic' ? 'academic' : (detected === 'academic' ? 'academic' : 'marketing')

    // מערכת מומחה לשונית מתקדמת
    const system = [
      'את/ה מומחה/ית לשונית לעברית מודרנית ברמה מקצועית. תפקידך לשפר טקסטים לעברית טבעית, תקנית וזורמת,',
      'בהלימה לז׳אנר הנדרש (משפטי/שיווקי/אקדמי), ללא שינוי משמעות וללא הוספת עובדות.'
    ].join(' ')

    const principles = [
      'עקרונות לשוניים:',
      '1) העדפ/י מבנה פעיל על פני סביל כשהוא טבעי ובהיר יותר.',
      '2) זרימה עברית טבעית: מילות קישור טבעיות (למשל: לכן, עם זאת, מצד שני, כמו כן).',
      '3) הימנע/י מתרגומית; העדפ/י ביטויים משותפים בעברית בת־זמננו.',
      '4) משפטים קצרים ובהירים; פסקאות ממוקדות נושא.',
      '5) טיפוגרפיה עברית: ריווח פיסוק, מקף עברי (־) בין מילים עבריות, RTL תקין.',
    ].join('\n')

    const styleGuidance = targetGenre === 'legal'
      ? [
          'סגנון משפטי: רשמי, ענייני, מדויק, ללא סלנג או אמירות רגשיות.',
          'העדפות: "בהתאם ל-", "ככל ש-", "למען הסר ספק", "לאור האמור" (במידה מוצדקת).',
          'הימנע/י ממילים שיווקיות/קריאה לפעולה; שמור/י על סדר לוגי של עילות/טענות; עקביות במונחים.',
        ].join('\n')
      : targetGenre === 'academic'
      ? [
          'סגנון אקדמי: תקני, מדויק, מאוזן; הימנע/י מסופרלטיבים ושפה שיווקית.',
          'מונחים מחקריים ברורים; מבנה מוצע: רקע, שיטה/טיעון, ממצאים/דיון, סיכום; הוספת גידור לשוני (למשל: נראה כי, ייתכן ש-).',
        ].join('\n')
      : [
          'סגנון שיווקי/מדובר: קריא, משכנע, נטול קלישאות; שפה חמה ומודרנית.',
          'משפטים קצרים, תועלות ברורות, קריאה לפעולה עדינה; הימנע/י מביטויים משפטיים כבדים.',
        ].join('\n')

    const examples = `דוגמאות לתיקון "תרגמית" לעברית אמיתית:
- "יש לציין כי" → "במקרה ש", "שימו לב ש", או להסיר אם מיותר.
- "לאור העובדה ש" → "כי" / "מאחר ש".
- "באופן אשר" → "כך ש" / "ש-".
- "בכדי" → "כדי".
- "באם" → "אם".
- "יישום" (כשמדובר בהקשר יומיומי) → "הטמעה"/"הפעלת" בהתאם להקשר.
- פיסוק וריווח תקינים; RTL; מקף עברי (־) במידת הצורך.
`;

    const userDna = Array.isArray(body.dnaExamples) && body.dnaExamples.length > 0
      ? `דוגמאות אישיות (לפני→אחרי+הערות):\n${body.dnaExamples.slice(-3).map((ex, i) => `#${i+1}\nלפני: ${ex.before}\nאחרי: ${ex.after}\nהערות: ${ex.comment || ''}`).join('\n\n')}`
      : ''

    const synonymsLine = Array.isArray(body.synonyms) && body.synonyms.length > 0
      ? `השתמש/י, במידת האפשר ובהלימה למשמעות, במילים מתוך המאגר: ${body.synonyms.slice(0, 50).join(', ')}.`
      : ''
    const rephraseLine = body.rephrase ? 'בצע/י ניסוח מחדש של אותו תוכן בשפה שונה (לא לשנות משמעות). גווני בבחירת מילים ותחביר.' : ''
    const textTypeTarget: 'legal'|'content' = targetGenre === 'legal' ? 'legal' : 'content'

    const expertHeader = [
      'אתה מומחה לשוניות עברית ומתמלל מקצועי עם 20 שנות ניסיון.',
      'המשימה: קח טקסט עברי שנכתב על ידי AI (בדרך כלל "אנגלית מתורגמת") והפוך אותו לעברית טבעית שישראלים כותבים באמת.'
    ].join(' ')

    const expertPrinciples = [
      'עקרונות עבודה:',
      '1. זהה מבנים אנגליים מתורגמים (משפט אחרי משפט ללא זרימה).',
      '2. הבן את הכוונה המקורית של הטקסט.',
      '3. בנה מחדש במבנה עברי זורם וטבעי.',
      '4. העדף צורת הפועל הפעילה על הסבילה.',
      '5. השתמש בחיבורים עבריים טבעיים (למשל: ואילו, חרף, הואיל ו-).',
      '6. התאם את הסגנון לסוג הטקסט (משפטי/שיווקי/אקדמי).'
    ].join('\n')

    const genreGuide = [
      'זיהוי סוג טקסט:',
      '- משפטי: השתמש בלשון מדויקת, מונחים נכונים ומבנה לוגי.',
      '- תוכן/שיווקי: צור קשר אישי עם הקורא והשתמש בדוגמאות ישראליות מתונות.'
    ].join('\n')

    const badPatterns = [
      'דוגמאות לדפוסים בעייתיים שצריך לתקן:',
      '- "יש לציין כי" → "חשוב לדעת ש" / "במקרה ש"',
      '- "בנוסף לכך" → "כמו כן" / "יתר על כן"',
      '- "X. עם זאת Y" → "אף על פי ש-X, Y"'
    ].join('\n')

    const returnSchema = [
      'החזר תמיד JSON תקין בלבד במבנה הבא (וללא טקסט נוסף):',
      '{',
      '  "improvedText": string,',
      '  "changes": string[],',
      '  "qualityScore": number /* 1-10 */,',
      '  "textType": "legal"|"content"',
      '}'
    ].join('\n')

    const legalSpecific = [
      'הנחיות מיוחדות לסגנון משפטי (legal):',
      '- השתמש/י במונחים משפטיים מדויקים ועקביים.',
      '- שמור/י על סגנון רשמי ומקצועי ללא פנייה ישירה לקורא.',
      '- בנה/י משפטים הגיוניים ושיטתיים; סדר טענות; זמנים ותהליכים ברורים.',
      '- הוסף/י פרטים מעשיים (לוחות זמנים, הליכים), אם הם משתמעים מן הטקסט.',
      '- דוגמה לניסוח: "במקרה שהנתבע הפר את החוזה, זכאי התובע לפיצוי של X שקלים בתוך 14 ימים."'
    ].join('\n')

    const contentSpecific = [
      'הנחיות מיוחדות לסגנון שיווקי/תוכן (content):',
      '- צור/צרי קשר אישי עם הקורא ("אתם", "שלכם") במינון מאוזן.',
      '- שלב/י דוגמאות ישראליות מוכרות במידת הצורך כדי להמחיש.',
      '- כתוב/כתבי בסגנון חם ומעניין; בנה/י סיפור קצר במקום רשימת עובדות יבשה.',
      '- שמור/שמרי על בהירות והימנע/י מקלישאות ומסופרלטיבים גורפים.',
      '- דוגמה לפתיח: "בואו נודה, כולנו מכירים את הבעיה הזאת. כשאתם מנסים לכתוב טקסט למאמר..."'
    ].join('\n')

    const typeSpecific = textTypeTarget === 'legal' ? legalSpecific : contentSpecific

    const instruction = [
      expertHeader,
      '',
      expertPrinciples,
      '',
      genreGuide,
      '',
      styleGuidance,
      principles,
      typeSpecific,
      badPatterns,
      userDna,
      rephraseLine,
      synonymsLine,
      '',
      returnSchema,
      `יעד הז׳אנר עבור הטקסט הנוכחי: ${textTypeTarget}.`
    ].filter(Boolean).join('\n')

    const user = `טקסט לתיקון והיטבה לעברית טבעית:\n\n${body.text}`

    try {
      const resp = await client.messages.create({
        model: process.env.CLAUDE_MODEL || 'claude-3-haiku-20240307',
        max_tokens: 1200,
        temperature: 0.2,
        system,
        messages: [
          { role: 'user', content: `${instruction}\n\n${user}` },
        ],
      })

      // Anthropic returns content blocks; take first text block
      const first = resp?.content?.[0] as any
      const raw = (first?.text ?? '').toString()

      const cleaned = raw.trim()
        .replace(/^```[a-zA-Z]*\n?/, '')
        .replace(/```\s*$/, '')

      let improvedText = ''
      let changes: string[] = []
      let qualityScore: number | undefined
      let textTypeResp: 'legal'|'content' | undefined

      const tryExtract = (s: string) => {
        try {
          const obj = JSON.parse(s)
          const itxt = typeof obj?.improvedText === 'string' ? obj.improvedText : ''
          const ch = Array.isArray(obj?.changes) ? obj.changes.map((x: unknown) => String(x)) : []
          const qs = typeof obj?.qualityScore === 'number' ? obj.qualityScore : undefined
          const tt = obj?.textType === 'legal' || obj?.textType === 'content' ? obj.textType : undefined
          return { itxt, ch, qs, tt }
        } catch {
          return null
        }
      }

      const p1 = tryExtract(cleaned)
      if (p1) {
        improvedText = p1.itxt
        changes = p1.ch
        qualityScore = p1.qs
        textTypeResp = p1.tt
      } else {
        // Sometimes model wraps JSON again as string in improvedText
        const p2 = tryExtract(cleaned.replace(/^"|"$/g, ''))
        if (p2) {
          improvedText = p2.itxt
          changes = p2.ch
          qualityScore = p2.qs
          textTypeResp = p2.tt
        } else {
          improvedText = cleaned
          changes = []
        }
      }

      // If user requested rephrase with synonyms, enforce via a second pass if needed
      const needsSynonyms = body.rephrase && Array.isArray(body.synonyms) && body.synonyms.length > 0
      const normalizedText = improvedText || ''
      const presentCount = needsSynonyms
        ? body.synonyms.filter(w => normalizedText.includes(w)).length
        : 0
      let finalText = normalizedText
      if (needsSynonyms && presentCount < Math.min(2, body.synonyms.length)) {
        const enforceInstr = `שכתב/י מחדש את הטקסט הבא בעברית טבעית, שמור/י על משמעות מדויקת, והטמע/י לפחות שתיים מהמילים: ${body.synonyms.slice(0, 50).join(', ')}.`
        const resp2 = await client.messages.create({
          model: process.env.CLAUDE_MODEL || 'claude-3-haiku-20240307',
          max_tokens: 1200,
          temperature: 0.3,
          system,
          messages: [
            { role: 'user', content: `${enforceInstr}\n\nטקסט בסיס:\n${normalizedText}\n\n${instruction}` },
          ],
        })
        const first2 = resp2?.content?.[0] as any
        const raw2 = (first2?.text ?? '').toString()
        const cleaned2 = raw2.trim().replace(/^```[a-zA-Z]*\n?/, '').replace(/```\s*$/, '')
        finalText = cleaned2 || normalizedText
      }

      if (finalText) {
        // Enforce style by type with an extra pass if heuristics fail
        if (textTypeTarget === 'legal' && !isLegalStyle(finalText)) {
          const enforceLegal = 'שכתב/י באופן משפטי רשמי ומדויק ללא פנייה ישירה לקורא, ללא סלנג/CTA, וסדר לוגי של טענות. שמור/י על משמעות.'
          const resp3 = await client.messages.create({
            model: process.env.CLAUDE_MODEL || 'claude-3-haiku-20240307',
            max_tokens: 1200,
            temperature: 0.2,
            system,
            messages: [{ role: 'user', content: `${enforceLegal}\n\nטקסט בסיס:\n${finalText}` }],
          })
          const first3 = resp3?.content?.[0] as any
          const raw3 = (first3?.text ?? '').toString()
          const cleaned3 = raw3.trim().replace(/^```[a-zA-Z]*\n?/, '').replace(/```\s*$/, '')
          if (cleaned3) finalText = cleaned3
        }
        if (textTypeTarget === 'content' && !isMarketingStyle(finalText)) {
          const enforceMk = 'שכתב/י בנימה שיווקית/מדוברת חמה עם פנייה ישירה לקורא ("אתם"/"שלכם") במינון מאוזן, ללא קלישאות וללא שינוי משמעות.'
          const resp4 = await client.messages.create({
            model: process.env.CLAUDE_MODEL || 'claude-3-haiku-20240307',
            max_tokens: 1200,
            temperature: 0.3,
            system,
            messages: [{ role: 'user', content: `${enforceMk}\n\nטקסט בסיס:\n${finalText}` }],
          })
          const first4 = resp4?.content?.[0] as any
          const raw4 = (first4?.text ?? '').toString()
          const cleaned4 = raw4.trim().replace(/^```[a-zA-Z]*\n?/, '').replace(/```\s*$/, '')
          if (cleaned4) finalText = cleaned4
        }
        const usedDnaCount = Array.isArray(body.dnaExamples) ? body.dnaExamples.filter(x => (x.comment || '').trim().length > 0).length : 0
        const finalQuality = typeof qualityScore === 'number' ? Math.max(1, Math.min(10, Math.round(qualityScore))) : 8
        const finalTextType: 'legal'|'content' = textTypeResp ? textTypeResp : textTypeTarget
        return NextResponse.json({ improvedText: finalText, changes, qualityScore: finalQuality, textType: finalTextType, usedDnaCount })
      }
    } catch {}

    // Fallback to backend /adapt if LLM failed or returned empty
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://api:8000'
    const audience = body.type === 'legal'
      ? { tone: 'formal', domain: 'legal', reading_level: 8, keep_english_terms: false, spelling_mode: 'ktiv_male' }
      : { tone: 'semi_formal', domain: 'marketing', reading_level: 6, keep_english_terms: false, spelling_mode: 'ktiv_male' }
    const r = await fetch(`${apiBase}/adapt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: body.text, audience, use_llm: false })
    })
    if (!r.ok) {
      return NextResponse.json({ error: 'Adapt fallback failed' }, { status: 502 })
    }
    const adapt = await r.json()
    const usedDnaCount = Array.isArray(body.dnaExamples) ? body.dnaExamples.filter(x => (x.comment || '').trim().length > 0).length : 0
    const fallbackQuality = 7
    const fallbackTextType: 'legal'|'content' = textTypeTarget
    return NextResponse.json({ improvedText: adapt.adapted_text || '', changes: adapt.applied_rules || [], qualityScore: fallbackQuality, textType: fallbackTextType, usedDnaCount })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}


