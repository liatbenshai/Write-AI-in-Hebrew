/**
 * ייצוא צוואות ל-Word עם RTL מלא
 */

import { 
  Document, 
  Paragraph, 
  TextRun, 
  Table,
  TableRow,
  TableCell,
  AlignmentType, 
  HeadingLevel,
  WidthType,
  BorderStyle,
  convertInchesToTwip 
} from 'docx';
import type { IndividualWillData, MutualWillData } from '../../app/legal/wills/types';

/**
 * המרת מספרים לעברית
 */
function convertNumbersToHebrew(text: string): string {
  return text
    .replace(/\.(\d+)/g, (match, num) => `.${num}`) // שמירת נקודה לפני מספר
    .replace(/(\d+)/g, (match) => {
      // המרת מספרים עבריים (רק אם זה לא תאריך או ת.ז.)
      if (match.length <= 2 && !match.includes('.') && !match.includes('/')) {
        return match; // שמירת מספרים קצרים
      }
      return match;
    });
}

/**
 * יצירת פסקה עם RTL מלא
 */
function createRTLParagraph(text: string, options: {
  bold?: boolean;
  heading?: typeof HeadingLevel[keyof typeof HeadingLevel];
  alignment?: typeof AlignmentType[keyof typeof AlignmentType];
  indent?: number;
  spacing?: { before?: number; after?: number };
  fontSize?: number;
} = {}) {
  const convertedText = convertNumbersToHebrew(text);
  
  return new Paragraph({
    children: [
      new TextRun({
        text: convertedText,
        bold: options.bold,
        font: 'Arial',
        size: options.fontSize || (options.heading ? 32 : 24),
        rightToLeft: true,
        boldComplexScript: true,
      }),
    ],
    heading: options.heading,
    alignment: options.alignment || AlignmentType.RIGHT,
    bidirectional: true,
    indent: options.indent ? { 
      right: convertInchesToTwip(options.indent),
      left: 0,
    } : undefined,
    spacing: options.spacing || { 
      before: 120,
      after: 120,
      line: 360,
    },
  });
}

/**
 * יצירת טבלה עם RTL
 */
function createRTLTable(rows: any[]) {
  return new Table({
    rows,
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    alignment: AlignmentType.RIGHT,
    layout: 'fixed',
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1 },
      bottom: { style: BorderStyle.SINGLE, size: 1 },
      left: { style: BorderStyle.SINGLE, size: 1 },
      right: { style: BorderStyle.SINGLE, size: 1 },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
      insideVertical: { style: BorderStyle.SINGLE, size: 1 },
    },
  });
}

/**
 * ייצוא צוואת יחיד
 */
export async function exportIndividualWillToWord(data: IndividualWillData) {
  const gender = data.testator.gender;
  const getText = (text: string) => {
    if (gender === 'male') {
      return text
        .replace(/מבטלת/g, 'מבטל')
        .replace(/מצהירה/g, 'מצהיר')
        .replace(/מצווה ומורישה/g, 'מצווה ומוריש')
        .replace(/חתמה/g, 'חתם')
        .replace(/נושאת/g, 'נושא')
        .replace(/קובעת/g, 'קובע');
    }
    return text;
  };

  const sections = [
    // כותרת
    createRTLParagraph('צוואה', {
      bold: true,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 400 },
    }),
    
    createRTLParagraph(`נחתם${gender === 'female' ? 'ה' : ''} ביום: ${data.date}`, {
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 400 },
    }),
    
    // פתיחה
    createRTLParagraph(
      `לפיכך אני הח"מ ${data.testator.name}, (להלן: "${data.testator.name.split(' ')[1] || data.testator.name}") ת"ז ${data.testator.id}. מרחוב: ${data.testator.address}. לאחר שיקול דעת, ובהיותי בדעה צלולה ובכושר גמור להבחין בטיבה של צוואה, הנני מצווה בזאת בדעה מוגמרת וללא כל השפעה בלתי הוגנת עליי מצד כלשהו, את מה שייעשה ברכושי לאחר מותי, ${gender === 'female' ? 'קובעת ומצהירה' : 'קובע ומצהיר'} כמפורט להלן:`,
      { spacing: { before: 200, after: 300 } }
    ),
    
    // סעיפים סטנדרטיים
    createRTLParagraph(
      `.${data.standardClauses.revocation.number} ${getText(data.standardClauses.revocation.text)}`,
      { spacing: { before: 200, after: 200 } }
    ),
    createRTLParagraph(
      `.${data.standardClauses.debts.number} ${getText(data.standardClauses.debts.text)}`,
      { spacing: { before: 200, after: 200 } }
    ),
    createRTLParagraph(
      `.${data.standardClauses.scope.number} ${getText(data.standardClauses.scope.text)}`,
      { spacing: { before: 200, after: 300 } }
    ),
  ];

  // היקף העיזבון
  if (data.estate.assets.length > 0) {
    sections.push(
      createRTLParagraph('היקף העיזבון:', { 
        bold: true,
        spacing: { before: 400, after: 200 } 
      }),
      createRTLParagraph(
        '.5 כל רכוש מכל מין וסוג שהוא בין במקרקעין בין מיטלטלין, לרבות זכויות מכל סוג שהוא ו/או כל רכוש אחר (רשומים ושאינם רשומים), אשר בבעלותי כיום ו/או בהווה ו/או יגיעו לידיי בעתיד, לרבות:', 
        { indent: 0.3, spacing: { before: 200, after: 200 } }
      )
    );
    
    data.estate.assets.forEach((asset, idx) => {
      sections.push(
        createRTLParagraph(
          `.5.${idx + 1} ${asset.description}`, 
          { indent: 0.6, spacing: { before: 150, after: 150 } }
        )
      );
    });
  }

  // חלוקה
  if (data.beneficiaries.length > 0) {
    sections.push(
      createRTLParagraph('חלוקת העיזבון:', { 
        bold: true,
        spacing: { before: 400, after: 200 } 
      }),
      createRTLParagraph(
        `.6 אני ${getText('מצווה ומורישה')} ליורשים בהתאם לחלוקה כמצוין בסעיף 5 לעיל, כדלקמן:`, 
        { indent: 0.3, spacing: { before: 200, after: 200 } }
      )
    );
    
    // טבלת יורשים
    // רשימה פשוטה במקום טבלה
    data.beneficiaries.forEach((ben, idx) => {
      sections.push(
        createRTLParagraph(
          `.6.${idx + 1} ל${ben.relationship} ${ben.name}, נוש${gender === 'female' ? 'א' : 'ה'} ת.ז. ${ben.id} - חלק של ${ben.share} מהעיזבון.`,
          { indent: 0.6, spacing: { before: 150, after: 150 } }
        )
      );
    });
  }

  // סעיפים נוספים עם תתי-סעיפים
  if (data.additionalClauses.length > 0) {
    sections.push(
      createRTLParagraph('סעיפים נוספים:', { 
        bold: true,
        spacing: { before: 400, after: 200 } 
      })
    );
    
    data.additionalClauses.forEach((clause) => {
      sections.push(
        createRTLParagraph(
          `.${clause.number} ${getText(clause.text)}`, 
          { indent: 0.3, spacing: { before: 200, after: 150 } }
        )
      );
      
      // תתי-סעיפים
      if (clause.subItems && clause.subItems.length > 0) {
        clause.subItems.forEach((subItem, subIdx) => {
          if (subItem) {
            sections.push(
              createRTLParagraph(
                `.${clause.number}.${subIdx + 1} ${getText(subItem)}`,
                { indent: 0.6, spacing: { before: 100, after: 100 } }
              )
            );
          }
        });
      }
    });
  }

  // סעיפים אחרונים
  const lastClauseNumber = 7 + data.additionalClauses.length;
  sections.push(
    createRTLParagraph(
      `.${lastClauseNumber} ${getText(data.standardClauses.predeceased.text)}`, 
      { indent: 0.3, spacing: { before: 300, after: 200 } }
    ),
    createRTLParagraph(
      `.${lastClauseNumber + 1} ${getText(data.standardClauses.opposition.text)}`, 
      { indent: 0.3, spacing: { before: 200, after: 200 } }
    ),
    createRTLParagraph(
      `.${lastClauseNumber + 2} ${getText(data.standardClauses.goodFaith.text)}`, 
      { indent: 0.3, spacing: { before: 200, after: 300 } }
    ),
    
    // הצהרת חתימה
    createRTLParagraph(
      getText(data.standardClauses.declaration.text),
      { spacing: { before: 300, after: 400 } }
    ),
    
    // חתימות
    createRTLParagraph('_________________________', { 
      alignment: AlignmentType.LEFT,
      spacing: { before: 600, after: 100 } 
    }),
    createRTLParagraph(data.testator.name, { 
      alignment: AlignmentType.LEFT,
      spacing: { after: 50 } 
    }),
    createRTLParagraph(`ת.ז. ${data.testator.id}`, { 
      alignment: AlignmentType.LEFT,
      spacing: { after: 400 } 
    })
  );

  // הוסף הצהרת עדים
  sections.push(
    createRTLParagraph('הצהרת העדים', {
      bold: true,
      alignment: AlignmentType.CENTER,
      spacing: { before: 600, after: 300 },
    }),
    createRTLParagraph('אנו הח"מ:', { spacing: { before: 200, after: 100 } })
  );

  data.witnesses.forEach((witness, idx) => {
    sections.push(
      createRTLParagraph(
        `.${idx + 1} ${witness.name}, ת.ז. ${witness.id}, מרחוב ${witness.address}`,
        { indent: 0.3, spacing: { before: 100, after: 100 } }
      )
    );
  });

  sections.push(
    createRTLParagraph(
      `אנו מעידות בזאת שהמצווה הנ"ל ${data.testator.name}, הנוש${gender === 'female' ? 'א' : 'ה'} תעודת זהות ${data.testator.id} חתם בנוכחותנו על צוואתו הנ"ל לאחר שהצהיר בפנינו שזאת צוואתו האחרונה שאותה עשה מרצונו הטוב והחופשי בהיותו בדעה צלולה ובלי כל אונס או כפיה, וביקש מאיתנו להיות עדות לחתימתו ולאשר בחתימת ידנו שכך הצהיר וחתם בפנינו. ועוד אנו מצהירות כי אנו לא קטינות ולא פסולות דין וכי אין בינינו ובין המצווה יחס של קרבה כלשהיא, אין לנו כל טובת הנאה בעיזבון המצווה הנ"ל, והננו חותמות ומאשרות בזה כי המצווה הנ"ל חתם בפנינו על שטר צוואה זה לאחר שהצהיר בפנינו כי זו צוואתו ובזה אנו חותמות בתור עדות לצוואה בנוכחות של המצווה הנ"ל ובנוכחות כל אחת מאיתנו.`,
      { spacing: { before: 200, after: 400 } }
    )
  );

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(1),
            right: convertInchesToTwip(1.2),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1.2),
          },
        },
      },
      children: sections,
    }],
  });

  const { Packer } = await import('docx');
  const blob = await Packer.toBlob(doc);
  
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `צוואה-${data.testator.name}.docx`;
  link.click();
  
  window.URL.revokeObjectURL(url);
}

/**
 * ייצוא צוואה הדדית
 */
export async function exportMutualWillToWord(data: MutualWillData) {
  const spouse1 = data.spouses[0];
  const spouse2 = data.spouses[1];

  const sections = [
    // כותרת
    createRTLParagraph('צוואה הדדית', {
      bold: true,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
    }),
    
    createRTLParagraph(`נחתמה ביום: ${data.date}`, {
      alignment: AlignmentType.CENTER,
    }),
    
    new Paragraph({ text: '' }),
    
    // פתיחה
    createRTLParagraph('בהיות אין אדם יודע יום פקודתו.'),
    createRTLParagraph('וברצוננו לערוך צוואה הדדית בהתאם לסעיף 8א לחוק הירושה...'),
    
    createRTLParagraph(`${spouse1.name}, נושאת ת.ז. מס' ${spouse1.id}${spouse1.nickname ? ` (להלן: "${spouse1.nickname}")` : ''} מרח': ${spouse1.address}`, { bold: true }),
    createRTLParagraph(`${spouse2.name}, נושא ת.ז. מס' ${spouse2.id}${spouse2.nickname ? ` (להלן: "${spouse2.nickname}")` : ''} מרח': ${spouse2.address}`, { bold: true }),
    
    new Paragraph({ text: '' }),
    createRTLParagraph('כללי:', { bold: true }),
  ];

  // סעיפים סטנדרטיים
  Object.values(data.standardClauses).forEach(clause => {
    const text = clause.text.replace('_____', data.marriageYear?.toString() || '_____');
    sections.push(createRTLParagraph(`.${clause.number} ${text}`, { indent: 0.3 }));
  });

  // נכסים
  if (data.estate.assets.length > 0) {
    sections.push(
      new Paragraph({ text: '' }),
      createRTLParagraph('לרבות:', { indent: 0.3 })
    );
    data.estate.assets.forEach((asset, idx) => {
      sections.push(createRTLParagraph(`• ${asset}`, { indent: 0.6 }));
    });
  }

  // הוראות מיוחדות עם תתי-סעיפים
  if (data.specialProvisions.length > 0) {
    sections.push(new Paragraph({ text: '' }));
    data.specialProvisions.forEach((prov) => {
      sections.push(
        createRTLParagraph(`.${prov.number} ${prov.text}`, { indent: 0.3 })
      );
      
      // תתי-סעיפים
      if (prov.subItems && prov.subItems.length > 0) {
        prov.subItems.forEach((subItem, subIdx) => {
          if (subItem) {
            sections.push(
              createRTLParagraph(
                `.${prov.number}.${subIdx + 1} ${subItem}`,
                { indent: 0.6 }
              )
            );
          }
        });
      }
    });
  }

  // הוראות חלוקה
  if (data.beneficiaries.length > 0) {
    const mainNum = 5 + data.specialProvisions.length + 1;
    sections.push(
      new Paragraph({ text: '' }),
      createRTLParagraph(`חלוקת העיזבון:`, { bold: true }),
      createRTLParagraph(
        `.${mainNum} במקרה בו שנינו נלך לבית עולמנו בעת ובעונה אחת ו/או לאחר פטירתו של זה מאיתנו שיאריך חיים מבינינו, הננו קובעים ומצווים כי כל רכושנו, המצוין לעיל, יעבור כמפורט להלן:`,
        { indent: 0.3 }
      )
    );

    data.beneficiaries.forEach((ben, benIdx) => {
      sections.push(
        createRTLParagraph(
          `.${mainNum}.${benIdx + 1} אנו מצווים ל${ben.relationship} ${ben.name}, הנושא/ת ת.ז. ${ben.id} את הרכוש המצוין להלן:`,
          { indent: 0.6 }
        )
      );
      
      ben.inheritanceDetails.forEach((detail, detailIdx) => {
        if (detail) {
          sections.push(
            createRTLParagraph(
              `.${mainNum}.${benIdx + 1}.${detailIdx + 1} ${detail}`,
              { indent: 0.9 }
            )
          );
        }
      });
    });
  }

  // סעיף דרישה וסיום
  const finalNum = 5 + data.specialProvisions.length + (data.beneficiaries.length > 0 ? 2 : 1);
  sections.push(
    new Paragraph({ text: '' }),
    createRTLParagraph(`.${finalNum} ${data.demandClause.text}`, { indent: 0.3 }),
    new Paragraph({ text: '' }),
    createRTLParagraph('סיום:', { bold: true }),
    createRTLParagraph(data.closing.blessing),
    new Paragraph({ text: '' }),
    createRTLParagraph(data.closing.declaration)
  );

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(1),
            right: convertInchesToTwip(1.2),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1.2),
          },
        },
      },
      children: sections,
    }],
  });

  const { Packer } = await import('docx');
  const blob = await Packer.toBlob(doc);
  
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `צוואה-הדדית-${spouse1.name}-${spouse2.name}.docx`;
  link.click();
  
  window.URL.revokeObjectURL(url);
}

