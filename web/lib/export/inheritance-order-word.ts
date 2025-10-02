/**
 * ייצוא צו ירושה ל-Word
 */

import { Document, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, HeadingLevel, WidthType, BorderStyle } from 'docx';
import { InheritanceOrderData } from '../../app/legal/inheritance-order/types';
import { createRTLDocument, createHeading, createRTLParagraph, createSpacing, downloadWordDocument } from './word-exporter';

export async function exportInheritanceOrderToWord(data: InheritanceOrderData) {
  const sections = [
    // כותרת
    createHeading('בקשה לצו ירושה', HeadingLevel.HEADING_1),
    createSpacing(),
    
    // פרטי המבקש
    createHeading('חלק א׳: פרטי המבקש', HeadingLevel.HEADING_2),
    createRTLParagraph(`שם: ${data.applicant.name}`),
    createRTLParagraph(`תעודת זהות: ${data.applicant.id}`),
    createRTLParagraph(`כתובת: ${data.applicant.address}`),
    createRTLParagraph(`טלפון: ${data.applicant.phone}`),
    createRTLParagraph(`אימייל: ${data.applicant.email}`),
    createRTLParagraph(`קרבה למנוח: ${data.applicant.relationship}`),
    createSpacing(),
    
    // פרטי המנוח
    createHeading('חלק ב׳: פרטי המנוח', HeadingLevel.HEADING_2),
    createRTLParagraph(`שם המנוח: ${data.deceased.name}`),
    createRTLParagraph(`תעודת זהות: ${data.deceased.id}`),
    createRTLParagraph(`כתובת אחרונה: ${data.deceased.lastAddress}`),
    createRTLParagraph(`תאריך פטירה: ${data.deceased.deathDate}`),
    createRTLParagraph(`מקום פטירה: ${data.deceased.deathPlace}`),
    createRTLParagraph(`מצב משפחתי: ${data.deceased.maritalStatus}`),
    createSpacing(),
    
    // משפחה
    createHeading('חלק ג׳: משפחה ויורשים', HeadingLevel.HEADING_2),
  ];

  // בן זוג
  if (data.hasSpouse && data.spouse) {
    sections.push(
      createRTLParagraph('בן/בת זוג:', { bold: true }),
      createRTLParagraph(`  שם: ${data.spouse.name}`),
      createRTLParagraph(`  ת.ז: ${data.spouse.id}`),
      createSpacing()
    );
  }

  // ילדים
  if (data.childrenCount > 0) {
    sections.push(createRTLParagraph(`ילדים (${data.childrenCount}):`, { bold: true }));
    data.children.forEach((child, i) => {
      sections.push(
        createRTLParagraph(`  ${i + 1}. ${child.name} - ת.ז: ${child.id}`)
      );
    });
    sections.push(createSpacing());
  }

  // הורים
  if (data.hasFather && data.father) {
    sections.push(
      createRTLParagraph('אב:', { bold: true }),
      createRTLParagraph(`  ${data.father.name} - ת.ז: ${data.father.id}`),
      createSpacing()
    );
  }

  if (data.hasMother && data.mother) {
    sections.push(
      createRTLParagraph('אם:', { bold: true }),
      createRTLParagraph(`  ${data.mother.name} - ת.ז: ${data.mother.id}`),
      createSpacing()
    );
  }

  const doc = createRTLDocument(sections);
  await downloadWordDocument(doc, `צו-ירושה-${data.deceased.name}.docx`);
}

