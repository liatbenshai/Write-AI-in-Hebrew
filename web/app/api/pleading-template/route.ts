import { NextRequest, NextResponse } from 'next/server'

type TemplateBody = {
  court?: string
  caseType?: string
  caseNumber?: string
  plaintiff?: string
  defendant?: string
  city?: string
  lawyerName?: string
  // תוכן לפי חלקים
  partA?: string
  partB?: string
  partC?: string
  remedies?: string
}

export const runtime = 'nodejs'

function line(txt: string) { return txt + '\n' }
function blank() { return line('') }

function numberedListFromText(text: string, start = 1): string {
  if (!text?.trim()) return ''
  const items = text
    .split(/\r?\n|(?:\s*;\s*)/)
    .map(s => s.trim())
    .filter(Boolean)
  if (!items.length) return ''
  return items.map((t, i) => line(`${start + i}. ${t}`)).join('')
}

export async function POST(req: NextRequest) {
  try {
    const b = (await req.json()) as TemplateBody
    const court = b.court || 'לכבוד בית המשפט המחוזי בתל אביב-יפו'
    const caseType = b.caseType || 'ת.א. (אזרחי)'
    const caseNumber = b.caseNumber || '__________'
    const plaintiff = b.plaintiff || 'שם התובע'
    const defendant = b.defendant || 'שם הנתבע'
    const city = b.city || 'תל אביב-יפו'
    const lawyerName = b.lawyerName || 'עו"ד ________'

    const header = [
      line(court),
      blank(),
      line(`${caseType} מס' ${caseNumber}`),
      blank(),
      line('בעניין:'),
      line(`    ${plaintiff}`),
      line('    התובע'),
      blank(),
      line('    נ  ג  ד'),
      blank(),
      line(`    ${defendant}`),
      line('    הנתבע'),
      blank(),
      line('כתב טענות מטעם התובע'),
      blank(),
      line(`מאת: ${lawyerName}`),
      blank(),
    ].join('')

    const partA = b.partA?.trim() || ''
    const partB = b.partB?.trim() || ''
    const partC = b.partC?.trim() || ''
    const remedies = b.remedies?.trim() || ''

    const sectionA = [
      line("חלק א' – מידע בסיסי"),
      line('1. פרטי הצדדים והסמכות: התובע והנתבע כמפורט לעיל; הסמכות המקומית נתמכת במיקום האירועים/מושבו של הנתבע.'),
      line(`2. תמצית העובדות הנחוצות לביסוס התביעה: ${partA || '—'}`),
      line('3. הבסיס החוקי: —'),
      blank(),
    ].join('')

    const sectionB = partB
      ? [
          line("חלק ב' – טענות מקדמיות"),
          numberedListFromText(partB),
          blank(),
        ].join('')
      : ''

    const sectionC = [
      line("חלק ג' – פירוט העובדות והטענות"),
      partC ? line(partC) : line('—'),
      blank(),
    ].join('')

    const reliefSec = [
      line('הסעד המבוקש'),
      line('על כן מתכבד התובע לבקש מבית המשפט הנכבד:'),
      remedies ? numberedListFromText(remedies) : line('1. —'),
      blank(),
    ].join('')

    const signature = [
      line('_____________                          תאריך: ____________'),
      line(`${lawyerName}`),
      line('בא כוח התובע'),
    ].join('')

    const improvedText = header + sectionA + sectionB + sectionC + reliefSec + signature
    return NextResponse.json({ improvedText })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}

export async function GET() { return NextResponse.json({ ok: true }) }


