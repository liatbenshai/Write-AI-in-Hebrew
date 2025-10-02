import { NextRequest } from 'next/server'
import {
  AlignmentType,
  Document,
  Footer,
  HeadingLevel,
  Packer,
  PageNumber,
  Paragraph,
  TextRun,
} from 'docx'

export const runtime = 'nodejs'

type Body = {
  court?: string
  caseType?: string
  caseNumber?: string
  plaintiff?: string
  defendant?: string
  city?: string
  lawyerName?: string
  partA?: string
  partB?: string
  partC?: string
  remedies?: string
}

const TWIP_PER_CM = 567; // 1 cm ≈ 567 twips (since 1 inch=2.54cm and 1440 twips per inch → 1440/2.54≈567)

function p(text: string, heading?: any) {
  return new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    spacing: { line: 360 },
    heading,
    children: [new TextRun({ text, font: 'David', size: 24 })],
  })
}

function numbered(text: string, start = 1): Paragraph[] {
  const items = text
    .split(/\r?\n|(?:\s*;\s*)/)
    .map((s) => s.trim())
    .filter(Boolean)
  return items.map((t, i) => p(`${start + i}. ${t}`))
}

export async function POST(req: NextRequest) {
  const b = (await req.json()) as Body

  const court = b.court || 'לכבוד בית המשפט המחוזי בתל אביב-יפו'
  const caseType = b.caseType || 'ת.א. (אזרחי)'
  const caseNumber = b.caseNumber || '__________'
  const plaintiff = b.plaintiff || 'שם התובע'
  const defendant = b.defendant || 'שם הנתבע'
  const city = b.city || 'תל אביב-יפו'
  const lawyerName = b.lawyerName || 'עו"ד ________'

  const partA = (b.partA || '').trim()
  const partB = (b.partB || '').trim()
  const partC = (b.partC || '').trim()
  const remedies = (b.remedies || '').trim()

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: Math.round(2.5 * TWIP_PER_CM),
              bottom: Math.round(2.5 * TWIP_PER_CM),
              left: Math.round(2.5 * TWIP_PER_CM),
              right: Math.round(2.5 * TWIP_PER_CM),
            },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                bidirectional: true,
                spacing: { line: 360 },
                children: [
                  new TextRun({ text: 'עמוד ', font: 'David', size: 22 }),
                  new TextRun({ children: [PageNumber.CURRENT], font: 'David', size: 22 }),
                  new TextRun({ text: ' מתוך ', font: 'David', size: 22 }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], font: 'David', size: 22 }),
                ],
              }),
            ],
          }),
        },
        children: [
          // מקום ריק לחותמת
          p(''),
          p(court, HeadingLevel.HEADING_2),
          p(''),
          p(`${caseType} מס' ${caseNumber}`, HeadingLevel.HEADING_3),
          p(''),
          p('בעניין:'),
          p(`    ${plaintiff}`),
          p('    התובע'),
          p(''),
          p('    נ  ג  ד'),
          p(''),
          p(`    ${defendant}`),
          p('    הנתבע'),
          p(''),
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.CENTER,
            spacing: { line: 360 },
            children: [new TextRun({ text: 'כתב טענות מטעם התובע', font: 'David', size: 28, bold: true })],
          }),
          p(''),
          p(`מאת: ${lawyerName}`),
          p(''),

          // חלק א'
          new Paragraph({
            bidirectional: true,
            spacing: { line: 360 },
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: "חלק א' – מידע בסיסי", font: 'David', size: 26, bold: true })],
          }),
          p('1. פרטי הצדדים והסמכות: התובע והנתבע כמפורט לעיל; הסמכות המקומית נתמכת במיקום האירועים/מושבו של הנתבע.'),
          p(`2. תמצית העובדות הנחוצות לביסוס התביעה: ${partA || '—'}`),
          p('3. הבסיס החוקי: —'),
          p(''),

          // חלק ב'
          ...(partB
            ? [
                new Paragraph({
                  bidirectional: true,
                  spacing: { line: 360 },
                  alignment: AlignmentType.RIGHT,
                  children: [new TextRun({ text: "חלק ב' – טענות מקדמיות", font: 'David', size: 26, bold: true })],
                }),
                ...numbered(partB),
                p(''),
              ]
            : []),

          // חלק ג'
          new Paragraph({
            bidirectional: true,
            spacing: { line: 360 },
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: "חלק ג' – פירוט העובדות והטענות", font: 'David', size: 26, bold: true })],
          }),
          ...(partC ? partC.split(/\r?\n/).map((ln) => p(ln || '')) : [p('—')]),
          p(''),

          // סעד
          new Paragraph({
            bidirectional: true,
            spacing: { line: 360 },
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: 'הסעד המבוקש', font: 'David', size: 26, bold: true })],
          }),
          p('על כן מתכבד התובע לבקש מבית המשפט הנכבד:'),
          ...(remedies ? numbered(remedies) : [p('1. —')]),
          p(''),

          // חתימה
          p('_____________                          תאריך: ____________'),
          p(`${lawyerName}`),
          p('בא כוח התובע'),
        ],
      },
    ],
  })

  const buffer = await Packer.toBuffer(doc)
  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="pleading_${caseNumber || 'draft'}.docx"`,
    },
  })
}


