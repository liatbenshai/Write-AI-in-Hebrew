# פלטפורמה לשיפור כתיבה משפטית לעורכי דין - מפרט טכני
## גרסה 1.0 - בקשות צו ירושה וצו קיום צוואה

---

## 1. סקירה כללית (Overview)

### 1.1 מטרת הפלטפורמה
פלטפורמה ייעודית לעורכי דין בישראל שמאפשרת יצירת כתבי טענות ובקשות משפטיות בעברית תקנית ומקצועית, בהתבסס על מקורות משפטיים מוסמכים.

### 1.2 שלב ראשון - MVP
במסגרת השלב הראשון, הפלטפורמה תתמקד ביצירת שני סוגי בקשות:
- **בקשה לצו ירושה** (טופס 1, תקנה 14א)
- **בקשה לצו קיום צוואה** (טופס 2, תקנה 14א)

### 1.3 מקורות משפטיים
הפלטפורמה מבוססת על:
- חוק הירושה, התשכ"ה-1965
- תקנות הירושה, התשנ"ח-1998
- טפסים רשמיים של רשם הירושה
- הוראות האפוטרופוס הכללי

---

## 2. ארכיטקטורה טכנית (Technical Architecture)

### 2.1 סטאק טכנולוגי מומלץ

**Frontend:**
- React.js + TypeScript
- Tailwind CSS לעיצוב
- React Hook Form לטפסים
- Zod לולידציה

**Backend:**
- Node.js + Express
- PostgreSQL למסד נתונים
- Prisma ORM
- PDF generation: PDFKit או jsPDF

**אימות וניהול משתמשים:**
- NextAuth.js או Auth0
- JWT tokens

### 2.2 מבנה הפרויקט

```
legal-platform/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── forms/
│   │   │   │   ├── InheritanceOrderForm/
│   │   │   │   └── ProbateOrderForm/
│   │   │   ├── ui/
│   │   │   └── layout/
│   │   ├── pages/
│   │   ├── templates/
│   │   │   ├── inheritanceOrder.ts
│   │   │   └── probateOrder.ts
│   │   ├── utils/
│   │   │   ├── validation.ts
│   │   │   └── hebrewText.ts
│   │   └── types/
│   └── public/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   │   ├── pdfGenerator.ts
│   │   │   └── templateEngine.ts
│   │   └── middleware/
│   └── prisma/
└── docs/
    ├── legal-sources/
    └── templates/
```

---

## 3. מבנה הבקשות - מפרט משפטי

### 3.1 בקשה לצו ירושה (טופס 1)

#### מבנה הטופס:

**כותרת:**
```
תקנות הירושה
טופס 1
(תקנה 14 (א))

בפני הרשם לעניני ירושה ב[שם המחוז]

תיק [מספר יוזמן אוטומטית]
בענין עזבון המנוח [שם מלא]

בקשת צו ירושה
```

**חלק א': המבקש, המוריש ומעמד היורשים**

שדות נדרשים:
```typescript
interface ApplicantSection {
  // 1. המבקש
  applicantName: string;           // שם המבקש
  applicantIdNumber: string;       // מס' תעודת זהות
  applicantAddress: string;        // מענו
  applicantEmail: string;          // כתובת דוא"ל (רק אם לא מיוצג)
  applicantPhone: string;          // טלפון
  applicantMobile: string;         // נייד
  applicantInterest: string;       // ענינו במתן הצו
  
  // 5. מיוצג על ידי עורך דין
  isRepresented: boolean;
  lawyerName?: string;
  lawyerAddress?: string;
  lawyerEmail?: string;
  lawyerPhone?: string;
  lawyerMobile?: string;
  
  // 2. המוריש
  deceasedName: string;            // שם המוריש
  deceasedIdNumber: string;        // מס' תעודת זהות
  deceasedResidence: string;       // מקום מושבו
  deathDate: string;               // תאריך פטירה
  deathPlace: string;              // מקום פטירה
  maritalStatus: 'single' | 'married' | 'widowed' | 'divorced';
  
  // 11. להוכחת המוות
  deathProofDocuments: string[];   // רשימת מסמכים
  
  // 3. צוואה
  hasWill: boolean;                // השאיר/לא השאיר צוואה
  
  // 4. כשרות משפטית
  hasMinor: boolean;               // יש קטין
  hasIncapacitated: boolean;       // יש חסוי
  hasMissing: boolean;             // יש נעדר
}
```

**חלק ב': בן הזוג והקרובים של המוריש**

```typescript
interface SpouseAndRelativesSection {
  // 1. בן זוגו של המוריש
  hasSpouse: boolean;
  spouse?: {
    isAlive: boolean;
    name: string;
    idNumber: string;
    address: string;
    // אם נפטר אחרי המוריש
    deathDate?: string;
    deathProof?: string;
    spouseHeirs?: Heir[];
  };
  
  // 13. זכויות מיוחדות של בן הזוג
  spouseSpecialRights: {
    // (א) מכונית
    hasCar: boolean;
    carDetails?: string;
    
    // (ב) דירה
    hasApartment: boolean;
    apartmentDetails?: {
      gush: string;
      helka: string;
      address: string;
      spouseLivedThere: boolean;
      marriageDate: string;
    };
  };
  
  // 15. ילדי המוריש וצאצאיהם
  children: Child[];
  
  // 16. הורי המוריש וצאצאיהם (רק אם אין ילדים)
  parents?: {
    father?: Parent;
    mother?: Parent;
  };
  
  // 17. הורי הוריו של המוריש (רק אם אין ילדים והורים)
  grandparents?: {
    paternalGrandparents?: Grandparent[];
    maternalGrandparents?: Grandparent[];
  };
}

interface Child {
  name: string;
  idNumber: string;
  address: string;
  otherParentName: string;
  isAlive: boolean;
  deathDate?: string;
  descendants?: Child[];
}

interface Parent {
  type: 'father' | 'mother';
  isAlive: boolean;
  name?: string;
  idNumber?: string;
  address?: string;
  deathDate?: string;
  deathProof?: string;
  hasDescendants?: boolean;
  descendants?: Child[];
}
```

**חלק ג': שינויים לאחר פטירת המוריש**

```typescript
interface ChangesAfterDeathSection {
  // 18. יורשים שהסתלקו
  resignedHeirs: ResignedHeir[];
  
  // 19. יורשים שנפטרו אחרי המוריש
  deceasedHeirs: DeceasedHeir[];
}

interface ResignedHeir {
  name: string;
  resignedPortion: string;
  inFavorOf?: {
    name: string;
    idNumber: string;
    relationToDeceased: string;
  };
}

interface DeceasedHeir {
  name: string;
  idNumber: string;
  relationToDeceased: string;
  deathDate: string;
  deathProof: string;
  heirs: Heir[];
  heirsProof: string;
}
```

**חלק ד': היורשים וחלקיהם בעיזבון**

```typescript
interface HeirsSection {
  heirs: Heir[];
  declaration: string; // "היורשים המנויים לעיל הם היורשים היחידים של המוריש ואין זולתם"
}

interface Heir {
  serialNumber: number;
  name: string;
  idNumber: string;
  address: string;
  relationToDeceased: string;
  legalCapacity: 'adult' | 'minor' | 'incapacitated' | 'missing';
  shareInEstate: string; // לדוגמה: "1/2", "1/4", "כל העיזבון"
}
```

**חלק ה': הצהרת המבקש**

```typescript
interface DeclarationSection {
  // 20. מסמכים מצורפים
  attachedDocuments: string[];
  
  // 21. סמכות הרשם
  jurisdiction: string; // "לרשם לעניני ירושה זה הסמכות לדון בבקשה הואיל [סיבה]"
  
  // תצהיר
  affidavit: {
    declarantName: string;
    declarantIdNumber: string;
    date: string;
    signature: string; // חתימה דיגיטלית או סרוקה
    
    // אימות התצהיר
    verifier: {
      date: string;
      verifierName: string;
      verifierLocation: string;
      verifierType: 'lawyer' | 'judge' | 'rabbi' | 'localAuthority';
      signature: string;
    };
  };
}
```

### 3.2 בקשה לצו קיום צוואה (טופס 2)

המבנה דומה לטופס 1, עם ההבדלים הבאים:

**כותרת:**
```
בקשת צו קיום צוואה
```

**שדות נוספים/שונים:**

```typescript
interface ProbateOrderForm extends InheritanceOrderForm {
  // חלק א': נוסף
  willDetails: {
    hasOriginalWill: boolean;
    willDate: string;
    willType: 'handwritten' | 'witnessed' | 'beforeAuthority' | 'oral';
    willLocation: string; // איפה נמצאת הצוואה
    isDeposited: boolean;
    depositDate?: string;
    depositLocation?: string;
  };
  
  // במקום "יורשים" - "זוכים על פי הצוואה"
  beneficiaries: Beneficiary[];
  
  // הודעות לזוכים (במקום ליורשים)
  notificationsToBeneficiaries: {
    sent: boolean;
    proofOfDelivery: string;
    sentBy: 'registeredMail' | 'personalDelivery';
  };
}

interface Beneficiary {
  serialNumber: number;
  name: string;
  idNumber: string;
  address: string;
  benefitUnderWill: string; // מה הוא זוכה לפי הצוואה
  legalCapacity: 'adult' | 'minor' | 'incapacitated' | 'missing';
}
```

---

## 4. ניסוחים משפטיים מקובלים

### 4.1 פתיחה סטנדרטית

```typescript
const openingTemplate = {
  formHeader: `תקנות הירושה
טופס [1/2]
(תקנה 14 (א))`,
  
  courtLine: `בפני הרשם לעניני ירושה ב{district}`,
  
  caseNumber: `תיק {caseNumber}`,
  
  estateLine: `בענין עזבון המנוח {deceasedName}`,
  
  requestTitle: {
    inheritance: `בקשת צו ירושה`,
    probate: `בקשת צו קיום צוואה`
  }
};
```

### 4.2 ניסוחי חלקים

**חלק א' - המבקש:**
```
.1 המבקש

1) שם המבקש {applicantName}
2) מס' תעודת זהות {applicantIdNumber}
3) מענו {applicantAddress}
   כתובת דוא"ל {applicantEmail}
   טלפון: {applicantPhone} נייד: {applicantMobile}
4) ענינו במתן הצו {applicantInterest}
5) מיוצג על ידי עורך דין {lawyerName}
6) המען להמצאת כתבי בי-דין {lawyerAddress}
   כתובת דוא"ל {lawyerEmail}
   טלפון: {lawyerPhone} נייד: {lawyerMobile}
```

**המוריש:**
```
.2 המוריש

7) שם המוריש {deceasedName}
8) מס' תעודת זהותו {deceasedIdNumber}
9) מקום מושבו היה ב{deceasedResidence}
10) נפטר ביום {deathDate} ב{deathPlace}
    כשהוא {maritalStatus}
11) להוכחת המוות אני מצרף לזה את המסמכים המפורטים להלן:
    {deathProofDocuments}
```

### 4.3 ניסוח הסיום והתצהיר

```typescript
const closingTemplate = {
  jurisdiction: `לרשם לעניני ירושה/לבית דין זה הסמכות לדון בבקשה הואיל {jurisdictionReason}`,
  
  request: `לפיכך, אני פונה בבקשה למתן צו {orderType} של המנוח ומצהיר:`,
  
  affidavitTitle: `תצהיר`,
  
  affidavitText: `אני הח"מ {declarantName} מס' ת"ז {declarantIdNumber}
לאחר שהוזהרתי כי עלי לומר את האמת, וכי אהיה צפוי/ה לעונשים הקבועים בחוק אם לא אעשה כן,
מצהיר/ה בזה כי כל העובדות שציינתי בבקשתי דלעיל הן אמת, האמת כולה והאמת בלבד.`,

  dateAndSignature: `
{date}                           ..............................
                                חתימת המבקש/ת המצהיר/ה`,

  verifierText: `אני מאשר בזה כי ביום {verificationDate} הופיע(ה) בפני {verifierLocation}
במשרדי ב{verifierAddress}
מר/גב' {declarantName} שזיהה(תה) עצמו(מה) על ידי תעודת זהות מס' {declarantIdNumber}
המוכר/ת לי באופן אישי, ולאחר שהזהרתיו(ה) כי עליו(ה) להצהיר את האמת, וכי יהיה/תהיה צפוי/ה
לעונשים הקבועים בחוק אם לא יעשה/תעשה כן, אישר/ה את נכונות הצהרתו/ה דלעיל וחתם/מה עליה בפני.

                                ..............................
                                חתימת מקבל התצהיר`
};
```

---

## 5. לוגיקה עסקית (Business Logic)

### 5.1 כללי ולידציה

```typescript
// קובץ: validation.ts

interface ValidationRule {
  field: string;
  rules: ValidationCheck[];
  errorMessage: string;
}

// דוגמאות לכללי ולידציה:

const idNumberValidation: ValidationRule = {
  field: 'idNumber',
  rules: [
    { type: 'required', message: 'מספר תעודת זהות הוא שדה חובה' },
    { type: 'length', value: 9, message: 'מספר תעודת זהות חייב להכיל 9 ספרות' },
    { type: 'custom', validate: validateIsraeliID, message: 'מספר תעודת זהות אינו תקין' }
  ],
  errorMessage: ''
};

const dateValidation: ValidationRule = {
  field: 'deathDate',
  rules: [
    { type: 'required', message: 'תאריך פטירה הוא שדה חובה' },
    { type: 'date', message: 'יש להזין תאריך תקין' },
    { type: 'pastDate', message: 'תאריך הפטירה חייב להיות בעבר' }
  ],
  errorMessage: ''
};

// פונקציית עזר לבדיקת תעודת זהות ישראלית
function validateIsraeliID(id: string): boolean {
  if (id.length !== 9) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let digit = Number(id[i]) * ((i % 2) + 1);
    sum += digit > 9 ? digit - 9 : digit;
  }
  
  return sum % 10 === 0;
}
```

### 5.2 לוגיקת חישוב חלקים בעיזבון

```typescript
// קובץ: inheritanceCalculations.ts

interface InheritanceShare {
  heir: string;
  relation: string;
  share: string;
  percentage: number;
}

/**
 * חישוב חלקי יורשים לפי חוק הירושה
 * 
 * סדר העדיפויות:
 * 1. בן זוג + ילדים
 * 2. בן זוג + הורים
 * 3. בן זוג + אחים
 * 4. רק ילדים
 * 5. רק הורים
 * וכו'
 */
function calculateInheritanceShares(
  spouse: boolean,
  children: number,
  parents: number,
  siblings: number
): InheritanceShare[] {
  const shares: InheritanceShare[] = [];
  
  // בן זוג + ילדים
  if (spouse && children > 0) {
    shares.push({
      heir: 'בן/בת הזוג',
      relation: 'spouse',
      share: '1/2',
      percentage: 50
    });
    
    const childShare = 50 / children;
    for (let i = 1; i <= children; i++) {
      shares.push({
        heir: `ילד ${i}`,
        relation: 'child',
        share: `${childShare}%`,
        percentage: childShare
      });
    }
    return shares;
  }
  
  // בן זוג + הורים (אין ילדים)
  if (spouse && parents > 0 && children === 0) {
    shares.push({
      heir: 'בן/בת הזוג',
      relation: 'spouse',
      share: '2/3',
      percentage: 66.67
    });
    
    const parentShare = 33.33 / parents;
    for (let i = 1; i <= parents; i++) {
      shares.push({
        heir: `הורה ${i}`,
        relation: 'parent',
        share: `${parentShare.toFixed(2)}%`,
        percentage: parentShare
      });
    }
    return shares;
  }
  
  // רק ילדים (אין בן זוג)
  if (!spouse && children > 0) {
    const childShare = 100 / children;
    for (let i = 1; i <= children; i++) {
      shares.push({
        heir: `ילד ${i}`,
        relation: 'child',
        share: children === 1 ? 'כל העיזבון' : `1/${children}`,
        percentage: childShare
      });
    }
    return shares;
  }
  
  // רק בן זוג (אין ילדים, הורים, אחים)
  if (spouse && children === 0 && parents === 0 && siblings === 0) {
    shares.push({
      heir: 'בן/בת הזוג',
      relation: 'spouse',
      share: 'כל העיזבון',
      percentage: 100
    });
    return shares;
  }
  
  // המשך לוגיקה לפי חוק הירושה...
  
  return shares;
}
```

### 5.3 לוגיקת מילוי אוטומטי

```typescript
// קובץ: autoFill.ts

/**
 * מילוי אוטומטי של שדות על סמך מידע קודם
 */
class AutoFillService {
  // מילוי כתובת על סמך מיקוד
  async fillAddressByZipCode(zipCode: string): Promise<AddressDetails> {
    // קריאה ל-API של דואר ישראל או מסד נתונים מקומי
    return {
      street: '',
      city: '',
      zipCode: zipCode
    };
  }
  
  // השלמת פרטים ממרשם האוכלוסין (אם יש אינטגרציה)
  async fetchFromPopulationRegistry(idNumber: string): Promise<PersonDetails> {
    // במידה ותהיה אינטגרציה עם משרד הפנים
    return {
      name: '',
      birthDate: '',
      deathDate: '',
      maritalStatus: ''
    };
  }
  
  // שמירת טיוטות
  async saveDraft(formData: any, userId: string): Promise<string> {
    // שמירה במסד נתונים
    return 'draft-id';
  }
  
  // טעינת טיוטה
  async loadDraft(draftId: string): Promise<any> {
    // טעינה ממסד נתונים
    return {};
  }
}
```

---

## 6. ממשק משתמש (UI/UX)

### 6.1 זרימת עבודה (Workflow)

```
1. בחירת סוג הבקשה
   └─> צו ירושה / צו קיום צוואה
   
2. מידע בסיסי על המוריש
   ├─> שם
   ├─> ת.ז.
   ├─> תאריך פטירה
   └─> מצב משפחתי
   
3. מבנה משפחה
   ├─> בן זוג
   ├─> ילדים
   ├─> הורים
   └─> אחים (אם רלוונטי)
   
4. זכויות מיוחדות (מכונית, דירה)
   
5. שינויים אחרי הפטירה
   ├─> הסתלקויות
   └─> יורשים שנפטרו
   
6. חישוב חלקים אוטומטי
   
7. מסמכים נדרשים
   
8. תצהיר ואימות
   
9. סקירה וייצוא PDF
```

### 6.2 רכיבי UI מרכזיים

```typescript
// רכיבים נדרשים:

// 1. טופס רב-שלבי (Wizard)
<MultiStepForm
  steps={[
    'בחירת סוג בקשה',
    'פרטי המוריש',
    'מבנה משפחה',
    'זכויות מיוחדות',
    'יורשים וחלקים',
    'מסמכים',
    'תצהיר',
    'סיכום'
  ]}
  currentStep={currentStep}
  onStepChange={handleStepChange}
/>

// 2. שדה קלט לתעודת זהות
<IsraeliIDInput
  value={idNumber}
  onChange={handleIdChange}
  validate={true}
  showValidation={true}
/>

// 3. בוחר תאריכים עברי/לועזי
<HebrewDatePicker
  value={date}
  onChange={handleDateChange}
  showHebrewDate={true}
  showGregorianDate={true}
/>

// 4. רשימת יורשים דינמית
<HeirsList
  heirs={heirs}
  onAdd={handleAddHeir}
  onRemove={handleRemoveHeir}
  onEdit={handleEditHeir}
  showShares={true}
  autoCalculateShares={true}
/>

// 5. צופה מסמכים
<DocumentPreview
  formData={formData}
  template={template}
  showLegalFormatting={true}
/>

// 6. ניהול מסמכים מצורפים
<AttachmentsManager
  attachments={attachments}
  onUpload={handleUpload}
  onRemove={handleRemove}
  requiredDocs={requiredDocuments}
/>
```

### 6.3 עיצוב והנגשה

```typescript
// קובץ: theme.ts

const legalPlatformTheme = {
  colors: {
    primary: '#1e3a8a',      // כחול משפטי
    secondary: '#64748b',    // אפור
    success: '#059669',      // ירוק
    warning: '#d97706',      // כתום
    error: '#dc2626',        // אדום
    background: '#f8fafc',
    surface: '#ffffff',
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      disabled: '#cbd5e1'
    }
  },
  
  typography: {
    fontFamily: {
      primary: '"Heebo", "Arial", sans-serif',  // גופן עברי קריא
      legal: '"David Libre", "Times New Roman", serif' // גופן פורמלי למסמכים
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem'
    }
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  },
  
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px'
  }
};

// נגישות
const a11yConfig = {
  // תמיכה בקורא מסך
  ariaLabels: true,
  
  // ניווט במקלדת
  keyboardNavigation: true,
  
  // ניגודיות
  highContrast: false,
  
  // גודל טקסט
  fontSize: 'base', // 'small' | 'base' | 'large'
  
  // כיוון RTL
  direction: 'rtl'
};
```

---

## 7. יצירת PDF

### 7.1 מבנה ה-PDF

```typescript
// קובץ: pdfGenerator.ts

import PDFDocument from 'pdfkit';

class LegalDocumentPDF {
  private doc: PDFDocument;
  private rtlSupport: boolean = true;
  
  constructor() {
    this.doc = new PDFDocument({
      size: 'A4',
      margins: {
        top: 72,      // 2.54cm
        bottom: 72,
        left: 72,
        right: 72
      },
      info: {
        Title: 'בקשה לצו ירושה',
        Author: 'פלטפורמה משפטית',
        Subject: 'מסמך משפטי',
        Keywords: 'צו ירושה, דיני עזבון'
      }
    });
  }
  
  // הוספת כותרת
  addHeader(text: string, fontSize: number = 14) {
    this.doc
      .font('Heebo-Bold')
      .fontSize(fontSize)
      .text(text, { align: 'center' })
      .moveDown();
  }
  
  // הוספת פיסקה
  addParagraph(text: string, options = {}) {
    this.doc
      .font('Heebo')
      .fontSize(11)
      .text(text, {
        align: 'right',
        direction: 'rtl',
        ...options
      })
      .moveDown(0.5);
  }
  
  // הוספת טבלה
  addTable(data: any[], columns: string[]) {
    // לוגיקת טבלה
  }
  
  // חתימה
  addSignature(signatureData: any) {
    this.doc
      .moveDown(2)
      .text('_____________________', { align: 'left' })
      .text('חתימה', { align: 'left' });
  }
  
  // שמירה
  async save(filename: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const buffers: Buffer[] = [];
      this.doc.on('data', buffers.push.bind(buffers));
      this.doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
      this.doc.end();
    });
  }
}

// שימוש:
async function generateInheritanceOrderPDF(formData: InheritanceOrderForm): Promise<Buffer> {
  const pdf = new LegalDocumentPDF();
  
  // כותרת
  pdf.addHeader('תקנות הירושה\nטופס 1\n(תקנה 14 (א))');
  
  // תוכן
  pdf.addParagraph(`בפני הרשם לעניני ירושה ב${formData.district}`);
  pdf.addParagraph(`תיק ${formData.caseNumber}`);
  pdf.addParagraph(`בענין עזבון המנוח ${formData.deceasedName}`);
  pdf.addHeader('בקשת צו ירושה', 12);
  
  // חלק א'
  pdf.addHeader('חלק א\': המבקש, המוריש ומעמד היורשים', 11);
  pdf.addParagraph(`1. המבקש`);
  pdf.addParagraph(`1) שם המבקש ${formData.applicantName}`);
  // ... המשך התוכן
  
  return await pdf.save('inheritance-order.pdf');
}
```

---

## 8. אינטגרציות (Integrations)

### 8.1 אינטגרציות עתידיות (Future)

```typescript
// מרשם האוכלוסין (אם יהיה זמין)
interface PopulationRegistryAPI {
  getPersonDetails(idNumber: string): Promise<PersonDetails>;
  verifyDeath(idNumber: string): Promise<DeathVerification>;
}

// רשם הירושה
interface InheritanceRegistrarAPI {
  submitApplication(application: any): Promise<SubmissionResult>;
  checkApplicationStatus(caseNumber: string): Promise<ApplicationStatus>;
  getWillRegistry(deceasedId: string): Promise<WillRegistryResult>;
}

// בנק מידע משפטי (נבו, דין אונליין)
interface LegalDatabaseAPI {
  searchCaseLaw(query: string): Promise<CaseLaw[]>;
  getStatute(lawId: string): Promise<Statute>;
}
```

---

## 9. אבטחה ופרטיות (Security & Privacy)

### 9.1 דרישות אבטחה

```typescript
// אבטחת מידע
const securityRequirements = {
  // הצפנה
  encryption: {
    atRest: 'AES-256',           // הצפנת מסד נתונים
    inTransit: 'TLS 1.3',        // HTTPS
    sensitive: 'field-level'     // הצפנה ברמת שדה לנתונים רגישים
  },
  
  // אימות
  authentication: {
    method: 'JWT',
    mfa: true,                   // אימות דו-שלבי
    sessionTimeout: 30           // דקות
  },
  
  // הרשאות
  authorization: {
    rbac: true,                  // Role-Based Access Control
    roles: ['admin', 'lawyer', 'user']
  },
  
  // תיעוד (Audit Log)
  auditLog: {
    enabled: true,
    events: [
      'login',
      'form_create',
      'form_edit',
      'form_delete',
      'pdf_generate',
      'pdf_download'
    ]
  },
  
  // גיבויים
  backups: {
    frequency: 'daily',
    retention: '90 days',
    encrypted: true
  }
};
```

### 9.2 תקנות פרטיות

```typescript
// עמידה בתקנות הגנת הפרטיות
const privacyCompliance = {
  gdpr: true,                    // אם יש משתמשים באירופה
  israelPrivacyLaw: true,        // חוק הגנת הפרטיות, התשמ"א-1981
  
  dataRetention: {
    activeForms: '7 years',      // לפי חוק הגנת הפרטיות
    deletedForms: '30 days',     // Soft delete
    userAccounts: 'indefinite'
  },
  
  userRights: {
    rightToAccess: true,         // זכות עיון
    rightToCorrect: true,        // זכות תיקון
    rightToDelete: true,         // זכות מחיקה
    rightToExport: true          // זכות ייצוא
  },
  
  consentManagement: {
    explicit: true,
    granular: true,              // הסכמה מפורטת לכל שימוש
    withdrawable: true           // אפשרות לחזור בו מהסכמה
  }
};
```

---

## 10. בדיקות (Testing)

### 10.1 סוגי בדיקות

```typescript
// Unit Tests - בדיקות יחידה
describe('Inheritance Calculations', () => {
  test('should calculate shares for spouse and 2 children', () => {
    const shares = calculateInheritanceShares(true, 2, 0, 0);
    expect(shares[0].percentage).toBe(50); // spouse
    expect(shares[1].percentage).toBe(25); // child 1
    expect(shares[2].percentage).toBe(25); // child 2
  });
  
  test('should validate Israeli ID number', () => {
    expect(validateIsraeliID('123456789')).toBe(true);
    expect(validateIsraeliID('000000000')).toBe(false);
  });
});

// Integration Tests - בדיקות אינטגרציה
describe('PDF Generation', () => {
  test('should generate valid PDF from form data', async () => {
    const formData = createMockFormData();
    const pdf = await generateInheritanceOrderPDF(formData);
    expect(pdf).toBeInstanceOf(Buffer);
    expect(pdf.length).toBeGreaterThan(0);
  });
});

// E2E Tests - בדיקות מקצה לקצה
describe('Complete Form Submission', () => {
  test('user can complete and submit inheritance order form', async () => {
    await page.goto('/new-form/inheritance-order');
    await fillApplicantDetails();
    await fillDeceasedDetails();
    await fillFamilyStructure();
    await page.click('[data-testid="submit-button"]');
    await expect(page).toHaveURL(/\/success/);
  });
});
```

---

## 11. פריסה ותחזוקה (Deployment & Maintenance)

### 11.1 סביבות

```yaml
# קובץ: deployment.yml

environments:
  development:
    url: https://dev.legal-platform.co.il
    database: PostgreSQL (Dev)
    features:
      - debug_mode
      - mock_data
      - hot_reload
  
  staging:
    url: https://staging.legal-platform.co.il
    database: PostgreSQL (Staging)
    features:
      - performance_monitoring
      - user_testing
  
  production:
    url: https://legal-platform.co.il
    database: PostgreSQL (Production)
    features:
      - auto_scaling
      - load_balancing
      - disaster_recovery
      - monitoring_alerts
```

### 11.2 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml

name: Deploy

on:
  push:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: |
          npm install
          npm run test
          npm run lint
  
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build application
        run: |
          npm run build
          docker build -t legal-platform .
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          # Deploy script
```

---

## 12. מסמכי הדרכה (Documentation)

### 12.1 מדריך למשתמש

```markdown
# מדריך למשתמש - פלטפורמה משפטית

## תוכן עניינים
1. יצירת חשבון
2. כניסה למערכת
3. יצירת בקשה חדשה
4. מילוי פרטים
5. ייצוא מסמך
6. שמירת טיוטות
7. ניהול מסמכים

## 1. יצירת חשבון
...

## 2. כניסה למערכת
...
```

### 12.2 תיעוד טכני

```markdown
# תיעוד טכני למפתחים

## API Documentation

### POST /api/forms/inheritance-order
יצירת בקשה חדשה לצו ירושה

**Request Body:**
```json
{
  "applicant": {
    "name": "string",
    "idNumber": "string",
    ...
  },
  "deceased": {
    "name": "string",
    "idNumber": "string",
    ...
  }
}
```

**Response:**
```json
{
  "success": true,
  "formId": "uuid",
  "message": "Form created successfully"
}
```
```

---

## 13. פיצ'רים עתידיים (Future Features)

### שלב 2 - הרחבה
- תמיכה בכתבי טענות נוספים (כתב תביעה, כתב הגנה)
- מערכת תבניות מתקדמת
- שיתוף פעולה מרובה משתמשים
- אינטגרציה עם מערכות בתי המשפט

### שלב 3 - AI ו-Automation
- בדיקת דקדוק עברי אוטומטית
- המלצות לניסוחים משפטיים
- חיפוש פסיקה רלוונטית
- תרגום אוטומטי למסמכים זרים

---

## 14. נספחים (Appendices)

### נספח א': מקורות משפטיים מלאים

1. חוק הירושה, התשכ"ה-1965
   - קישור: https://www.nevo.co.il/law_html/law00/72178.htm

2. תקנות הירושה, התשנ"ח-1998
   - קישור: https://www.nevo.co.il/law_html/law00/98588.htm

3. אתר רשם הירושה
   - קישור: https://www.gov.il/he/service/inheritance_order

### נספח ב': רשימת בדיקה (Checklist)

**לפני פיתוח:**
- [ ] הגדרת דרישות
- [ ] אישור מקורות משפטיים
- [ ] תכנון ארכיטקטורה
- [ ] בחירת טכנולוגיות
- [ ] הקמת סביבת פיתוח

**במהלך פיתוח:**
- [ ] פיתוח Frontend
- [ ] פיתוח Backend
- [ ] אינטגרציות
- [ ] בדיקות
- [ ] תיעוד

**לפני השקה:**
- [ ] בדיקות אבטחה
- [ ] בדיקות עומס
- [ ] הכשרת משתמשים
- [ ] הכנת תיעוד
- [ ] פריסה לייצור

---

## 15. קבצי דוגמה (Example Files)

### דוגמה למבנה JSON של בקשה מלאה

```json
{
  "formType": "inheritance_order",
  "caseNumber": "12345/2025",
  "submissionDate": "2025-01-15",
  "district": "תל אביב",
  
  "applicant": {
    "name": "יוסי כהן",
    "idNumber": "123456789",
    "address": "רחוב הרצל 10, תל אביב",
    "email": "yossi@example.com",
    "phone": "03-1234567",
    "mobile": "050-1234567",
    "interest": "יורש של המנוח",
    "isRepresented": true,
    "lawyer": {
      "name": "עו\"ד דינה לוי",
      "address": "רחוב רוטשילד 20, תל אביב",
      "email": "dina@law.co.il",
      "phone": "03-7654321",
      "mobile": "052-7654321"
    }
  },
  
  "deceased": {
    "name": "משה כהן",
    "idNumber": "987654321",
    "residence": "תל אביב",
    "deathDate": "2024-12-01",
    "deathPlace": "תל אביב",
    "maritalStatus": "married",
    "deathProofDocuments": [
      "תעודת פטירה מס' 12345"
    ],
    "hasWill": false
  },
  
  "legalCapacity": {
    "hasMinor": false,
    "hasIncapacitated": false,
    "hasMissing": false
  },
  
  "family": {
    "spouse": {
      "exists": true,
      "isAlive": true,
      "name": "שרה כהן",
      "idNumber": "111222333",
      "address": "רחוב הרצל 10, תל אביב",
      "specialRights": {
        "car": {
          "exists": true,
          "details": "מכונית מסוג טויוטה קורולה, מספר רישוי 12-345-67"
        },
        "apartment": {
          "exists": true,
          "gush": "1234",
          "helka": "56",
          "address": "רחוב הרצל 10, תל אביב",
          "spouseLivedThere": true,
          "marriageDate": "1990-06-15"
        }
      }
    },
    "children": [
      {
        "name": "דני כהן",
        "idNumber": "444555666",
        "address": "רחוב דיזנגוף 30, תל אביב",
        "otherParentName": "שרה כהן",
        "isAlive": true
      },
      {
        "name": "רונית כהן",
        "idNumber": "777888999",
        "address": "רחוב אלנבי 40, תל אביב",
        "otherParentName": "שרה כהן",
        "isAlive": true
      }
    ],
    "parents": {
      "father": {
        "isAlive": false,
        "deathDate": "2010-05-10",
        "deathProof": "תעודת פטירה"
      },
      "mother": {
        "isAlive": false,
        "deathDate": "2015-03-20",
        "deathProof": "תעודת פטירה"
      }
    }
  },
  
  "changesAfterDeath": {
    "resignedHeirs": [],
    "deceasedHeirs": []
  },
  
  "heirs": [
    {
      "serialNumber": 1,
      "name": "שרה כהן",
      "idNumber": "111222333",
      "address": "רחוב הרצל 10, תל אביב",
      "relationToDeceased": "בת זוג",
      "legalCapacity": "adult",
      "shareInEstate": "1/2"
    },
    {
      "serialNumber": 2,
      "name": "דני כהן",
      "idNumber": "444555666",
      "address": "רחוב דיזנגוף 30, תל אביב",
      "relationToDeceased": "בן",
      "legalCapacity": "adult",
      "shareInEstate": "1/4"
    },
    {
      "serialNumber": 3,
      "name": "רונית כהן",
      "idNumber": "777888999",
      "address": "רחוב אלנבי 40, תל אביב",
      "relationToDeceased": "בת",
      "legalCapacity": "adult",
      "shareInEstate": "1/4"
    }
  ],
  
  "attachedDocuments": [
    "תעודת פטירה של המנוח",
    "אישור על משלוח הודעות ליורשים בדואר רשום",
    "ייפוי כוח לעורך דין",
    "אישור תשלום אגרות"
  ],
  
  "jurisdiction": "מקום מושבו של המוריש היה בתחום סמכות רשם הירושה במחוז תל אביב",
  
  "affidavit": {
    "declarantName": "יוסי כהן",
    "declarantIdNumber": "123456789",
    "date": "2025-01-15",
    "verifier": {
      "date": "2025-01-15",
      "verifierName": "עו\"ד דינה לוי",
      "verifierLocation": "תל אביב",
      "verifierAddress": "רחוב רוטשילד 20, תל אביב",
      "verifierType": "lawyer"
    }
  }
}
```

---

## סיכום והוראות לביצוע

### מה לתת ל-Cursor:

1. **מסמך זה במלואו** - הוא מכיל את כל המפרטים הטכניים והמשפטיים

2. **הוראות ספציפיות:**
   ```
   בנה פלטפורמה וב לעורכי דין בישראל ליצירת בקשות משפטיות:
   
   1. התחל מ-MVP: בקשה לצו ירושה ובקשה לצו קיום צוואה
   2. השתמש ב-React + TypeScript + Tailwind CSS
   3. בנה טופס רב-שלבי (wizard) עם ולידציה בזמן אמת
   4. יישם את כל הטייפים והאינטרפייסים מהמפרט
   5. צור מנוע תבניות ליצירת PDF מעוצב
   6. וודא תמיכה מלאה ב-RTL ובעברית
   7. יישם חישוב אוטומטי של חלקים בעיזבון
   8. הוסף שמירת טיוטות
   9. בנה תיעוד למשתמש
   
   עקוב אחר כל המבנים, הניסוחים והכללים במפרט המצורף.
   ```

3. **קבצי דוגמה:**
   - השתמש בדוגמת ה-JSON למבנה הנתונים
   - השתמש בטמפלייטים המסופקים לניסוחים

4. **סדר עדיפויות:**
   - שלב 1: UI + Form Logic + Validation
   - שלב 2: Template Engine + PDF Generation
   - שלב 3: Database + User Management
   - שלב 4: Testing + Documentation

---

**תאריך יצירה:** ינואר 2025  
**גרסה:** 1.0  
**מחברת:** פלטפורמה לשיפור כתיבה משפטית
