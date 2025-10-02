/**
 * ייצוא מסמכים ל-Word עם תמיכה מלאה בעברית RTL
 */

import { Document, Paragraph, TextRun, AlignmentType, HeadingLevel, convertInchesToTwip } from 'docx';

/**
 * יצירת מסמך Word בסיסי עם הגדרות RTL
 */
export function createRTLDocument(sections: any[]) {
  return new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(1),
            right: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1),
          },
        },
      },
      children: sections,
    }],
  });
}

/**
 * יצירת פסקה עם RTL
 */
export function createRTLParagraph(text: string, options: {
  bold?: boolean;
  heading?: typeof HeadingLevel[keyof typeof HeadingLevel];
  alignment?: typeof AlignmentType[keyof typeof AlignmentType];
} = {}) {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: options.bold,
        font: 'Arial', // פונט שתומך בעברית
        rightToLeft: true,
      }),
    ],
    heading: options.heading,
    alignment: options.alignment || AlignmentType.RIGHT,
    bidirectional: true,
  });
}

/**
 * יצירת כותרת
 */
export function createHeading(text: string, level: typeof HeadingLevel[keyof typeof HeadingLevel] = HeadingLevel.HEADING_1) {
  return createRTLParagraph(text, {
    bold: true,
    heading: level,
    alignment: AlignmentType.CENTER,
  });
}

/**
 * יצירת שורה ריקה
 */
export function createSpacing() {
  return new Paragraph({ text: '' });
}

/**
 * הורדת מסמך Word
 */
export async function downloadWordDocument(doc: Document, filename: string) {
  const { Packer } = await import('docx');
  const blob = await Packer.toBlob(doc);
  
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  
  window.URL.revokeObjectURL(url);
}

