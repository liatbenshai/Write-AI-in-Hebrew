# הוראות ל-Cursor: יצירת מערכת לניהול צוואות

## 🎯 מטרה
בנה מערכת ליצירת צוואות בעברית עם עיצוב מקצועי ומסגרת, כמו במסמכים משפטיים אמיתיים.

---

## 🎨 העיצוב החיצוני - CRITICAL

### מסגרת המסמך:
```
המסמך כולו חייב להיות בתוך מסגרת מלבנית:
- קו שחור עבה (2-3pt)
- המסגרת מקיפה את כל התוכן
- מרווח של 1.5cm מהקו לתוכן מכל צד
```

### כותרת ראשית:
```markdown
┌─────────────────────────────────────────┐
│                                         │
│                 צוואה                   │
│                                         │
└─────────────────────────────────────────┘
```

**עיצוב הכותרת:**
- מילה אחת: "צוואה"
- ממורכזת לחלוטין
- גופן: David או Times New Roman
- גודל: 24-28pt
- מודגשת
- מרחק של 2cm מראש העמוד

---

## 📄 מבנה המסמך (בסדר מדויק)

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│                        צוואה                             │
│                                                          │
│  הואיל כי אין אדם יודע את יום פקודתו;                   │
│  והואיל כי ברצוני לערוך את צוואתי...                    │
│  והואיל כי הנני למעלה מגיל שמונה עשרה שנים...           │
│                                                          │
│  לפיכך אני הח"מ [שם], ת.ז. [מספר]...                   │
│                                                          │
│  .1  סעיף ראשון...                                      │
│  .2  סעיף שני...                                        │
│                                                          │
│  [חתימות]                                               │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 📋 1. פתיחה: "הואיל" (חובה!)

זה חלק סטנדרטי בכל צוואה. חייב להופיע בדיוק בפורמט הזה:

```
הואיל כי אין אדם יודע את יום פקודתו;

והואיל כי ברצוני לערוך את צוואתי, ולפרט את רצוני האחרון והוראותיי 
בכל הקשור לאשר ייעשה ברכושי לאחר פטירתי, לאחר אריכות ימים ושנים;

והואיל כי הנני למעלה מגיל שמונה עשרה שנים, אזרחית/אזרח ישראלי 
ותושבת/תושב מדינת ישראל;
```

**חשוב:**
- שלושה "הואיל" בדיוק
- נקודה-פסיק (;) בסוף כל שורה
- זה טקסט קבוע - אל תשנה אותו!

---

## 📋 2. פרטי המצווה (חובה!)

```
לפיכך אני הח"מ [שם פרטי ומשפחה], (להלן: "[שם קצר]") ת.ז. [מספר ת.ז.] 
מרחוב: [כתובת מלאה], [עיר]. לאחר שיקול דעת, ובהיותי בדעה צלולה ובכושר 
גמור להבחין בטיבה של צוואה, הנני מצווה בזאת בדעה מוגמרת וללא כל השפעה 
בלתי הוגנת עליי מצד כלשהו, את מה שייעשה ברכושי לאחר מותי, קובעת/קובע 
ומצהירה/ומצהיר כמפורט להלן:
```

**שדות לקלוט מהמשתמש:**
- שם מלא
- מספר ת.ז. (9 ספרות)
- כתובת מלאה (רחוב, מספר בית, דירה, עיר)
- מגדר (לשים לב ל"מצהירה"/"מצהיר", "קובעת"/"קובע")

---

## 📋 3. הסעיפים (ממוספרים)

### סעיף 1: ביטול צוואות קודמות (חובה!)

```markdown
.1  למען הסר ספק, אני מבטל/ת בזה ביטול גמור, מוחלט ושלם, כל צוואה 
    ו/או הוראה שנתתי בעבר לפני תאריך חתימה על צוואה זו, בין בכתב ובין 
    בעל פה בקשור לרכושי ולנכסיי, כל מסמך, או כתב, כל שיחה שבעל פה, 
    שיש בה מעין גילוי דעת על מה שיש ברצוני שייעשה בעיזבוני לאחר מותי.
```

### סעיף 2: חובות והוצאות (חובה!)

```markdown
.2  אני מורה ליורשיי אשר יבצעו את צוואתי לשלם מתוך עיזבוני האמור את 
    כל חובותיי שיעמדו לפירעון בעת פטירתי, הוצאות הבאתי לארץ אם 
    פטירתי תהא בחו"ל והוצאות קבורתי, כולל הקמת מצבה מתאימה על קברי 
    וכן כל ההוצאות הכרוכות במתן צו לקיום צוואתי.
```

### סעיף 3: היקף הצוואה (חובה!)

```markdown
.3  צוואתי זו חלה ותחול על כל רכושי מכל מין וסוג, בין בארץ ובין בחו"ל, 
    ללא יוצא מן הכלל, בין אם הוא בבעלותי הבלעדית ובין אם בבעלותי 
    המשותפת עם אחרים.
```

### סעיף 4: מידע משפחתי (אופציונלי אבל מומלץ)

```markdown
.4  יש לי [מספר] ילדים/אחים/קרובי משפחה: [רשימה עם שמות ות.ז.]

    4.1 אני מציין/ת במפורש את כלל [קרובי המשפחה], על מנת להבהיר 
        שהחלטותיי בצוואה זו התקבלו מתוך מודעות מלאה לזהותם.
    
    4.2 כל יורש שלא נכלל בירושתי על פי צוואה זו - הדבר נעשה במכוון 
        ולא מחמת טעות או שכחה.
```

### סעיף 5: היקף העיזבון (חובה!)

```markdown
.5  כל רכוש מכל מין וסוג שהוא, לרבות:
    
    5.1 זכויות בדירה הרשומה בטאבו ב[כתובת מלאה], הידועה כ גוש: [מספר], 
        חלקה: [מספר], תת חלקה: [מספר] (להלן: "[שם הנכס]") וכן את 
        מטלטליה בין המחוברים חיבור של קבע ובין שאינם מחוברים חיבור של קבע.
    
    5.2 חשבון הבנק המנוהל על שמי בבנק [שם הבנק] (מספר בנק [מספר]), 
        סניף מספר [מספר], חשבון מספר [מספר], לרבות יתרת הכספים 
        בחשבון, פיקדונות חיסכון וכלל הזכויות הכספיות הנובעות מחשבון זה.
    
    5.3 את כלל הכספים במזומן הנמצאים ברשותי, לרבות שטרות כסף 
        המוחזקים בביתי, בכספת או בכל מקום אחר.
    
    5.4 כלל התכשיטים השייכים לי למועד פטירתי, לרבות תכשיטי זהב, כסף, 
        פלטינה, יהלומים ואבנים יקרות.
    
    5.5 רכב הרשום על שמי במשרד הרישוי למועד פטירתי.
```

**אפשר להוסיף:**
- דירות נוספות
- מגרשים
- עסקים
- מניות
- חשבונות בנק נוספים

### סעיף 6: היורשים וחלוקת הנכסים (הליבה!)

**המשתמש יכול לבחור אחד משני פורמטים:**

---

#### אפשרות 1: פורמט רשימה (מומלץ עד 4 יורשים)

```markdown
.6  הנני מצווה ומורישה/ומוריש לשלושת היורשים הבאים:
    
    דוד כהן, ת.ז. מספר 123456789 (להלן: "דוד")
    שרה לוי, ת.ז. מספר 987654321 (להלן: "שרה")
    מיכל אברהם, ת.ז. מספר 456789123 (להלן: "מיכל")
    
    בשלושה חלקים שווים (להלן: "שלושת היורשים") כמפורט להלן:
    
    6.1 שליש אחד (33.33%) – דוד, בני.
    
    6.2 שליש אחד (33.33%) – שרה, בתי.
    
    6.3 שליש אחד (33.33%) – מיכל, בתי.
```

**מתי להשתמש ברשימה:**
- עד 4 יורשים
- חלוקה פשוטה
- אין הרבה פרטים נוספים

---

#### אפשרות 2: פורמט טבלה (מומלץ ל-5+ יורשים)

```markdown
.6  הנני מצווה ומורישה/ומוריש ליורשים הבאים בהתאם לחלוקה המפורטת:

┌──────────────────┬────────────────┬──────────────┬───────────────┐
│ שם היורש         │ ת.ז.          │ קירבה        │ חלק בעיזבון   │
├──────────────────┼────────────────┼──────────────┼───────────────┤
│ דוד כהן          │ 123456789     │ בן           │ 25%           │
├──────────────────┼────────────────┼──────────────┼───────────────┤
│ שרה לוי          │ 987654321     │ בת           │ 25%           │
├──────────────────┼────────────────┼──────────────┼───────────────┤
│ מיכל אברהם       │ 456789123     │ בת           │ 25%           │
├──────────────────┼────────────────┼──────────────┼───────────────┤
│ רחל מזרחי        │ 789123456     │ אחות         │ 15%           │
├──────────────────┼────────────────┼──────────────┼───────────────┤
│ יוסף טרם         │ 321654987     │ אח           │ 10%           │
└──────────────────┴────────────────┴──────────────┴───────────────┘

    (להלן: "היורשים")
```

**מתי להשתמש בטבלה:**
- 5 יורשים או יותר
- חלוקה מורכבת עם אחוזים שונים
- רוצים סקירה ויזואלית מהירה
- יש הרבה פרטים (כתובות, תנאים וכו')

---

#### אפשרות 3: טבלה עם פרטים נוספים (למצבים מורכבים)

```markdown
.6  הנני מצווה ומורישה/ומוריש ליורשים הבאים:

┌─────────┬──────────────┬────────────┬──────────┬─────────────────────────┐
│ מס'     │ שם היורש     │ ת.ז.      │ חלק      │ הערות                   │
├─────────┼──────────────┼────────────┼──────────┼─────────────────────────┤
│ 1       │ דוד כהן      │ 123456789 │ 40%      │ בני הבכור               │
├─────────┼──────────────┼────────────┼──────────┼─────────────────────────┤
│ 2       │ שרה לוי      │ 987654321 │ 30%      │ בתי                     │
├─────────┼──────────────┼────────────┼──────────┼─────────────────────────┤
│ 3       │ מיכל אברהם   │ 456789123 │ 20%      │ בתי                     │
├─────────┼──────────────┼────────────┼──────────┼─────────────────────────┤
│ 4       │ יורשי רחל ז"ל│ ראה פירוט │ 10%      │ ילדי אחותי המנוחה       │
│         │  - אבי מזרחי │ 111222333 │ 5%       │  (נכד)                  │
│         │  - דני מזרחי │ 444555666 │ 5%       │  (נכד)                  │
└─────────┴──────────────┴────────────┴──────────┴─────────────────────────┘

    (להלן: "היורשים")
```

**מתי להשתמש בטבלה מורכבת:**
- יש יורשים משניים (sub-heirs)
- יש תנאים מיוחדים
- חלוקה מאוד לא שווה עם הסברים
- רוצים להוסיף הערות או כתובות

---

#### דוגמה לחלוקה מורכבת עם תת-יורשים

**בפורמט רשימה:**
```markdown
.6  הנני מצווה ומורישה/ומוריש ליורשים הבאים:
    
    6.1 מחצית (50%) – דוד כהן, בני.
    
    6.2 רבע (25%) – שרה לוי, בתי.
    
    6.3 רבע (25%) – יורשי רחל מזרחי ז"ל, אחותי המנוחה:
        6.3.1 שליש מהרבע (הינו 8.33%) – לבנה אבי מזרחי.
        6.3.2 שליש מהרבע (הינו 8.33%) – לבנה דני מזרחי.
        6.3.3 שליש מהרבע (הינו 8.34%) – לבנה יוסי מזרחי.
```

**באותה חלוקה בפורמט טבלה:**
```markdown
.6  הנני מצווה ומורישה/ומוריש ליורשים הבאים:

┌────────────────────────────────┬────────────────┬──────────────┐
│ יורש                           │ ת.ז.          │ חלק בעיזבון   │
├────────────────────────────────┼────────────────┼──────────────┤
│ דוד כהן                        │ 123456789     │ 50.00%       │
├────────────────────────────────┼────────────────┼──────────────┤
│ שרה לוי                        │ 987654321     │ 25.00%       │
├────────────────────────────────┼────────────────┼──────────────┤
│ יורשי רחל מזרחי ז"ל (אחותי):  │               │ 25.00%       │
│                                │               │              │
│   • אבי מזרחי (נכד)            │ 111222333     │   8.33%      │
│   • דני מזרחי (נכד)            │ 444555666     │   8.33%      │
│   • יוסי מזרחי (נכד)           │ 777888999     │   8.34%      │
└────────────────────────────────┴────────────────┴──────────────┘
```

**דוגמאות לחלוקה:**

#### חלוקה שווה לשלושה ילדים:
```
6.1 שליש אחד (33.33%) – דוד כהן, בני.
6.2 שליש אחד (33.33%) – שרה לוי, בתי.
6.3 שליש אחד (33.33%) – מיכל אברהם, בתי.
```

#### חלוקה לא שווה:
```
6.1 מחצית (50%) – דוד כהן, בני.
6.2 רבע (25%) – שרה לוי, בתי.
6.3 רבע (25%) – מיכל אברהם, בתי.
```

#### חלוקה עם תת-חלוקות:
```
6.3 שליש אחד (33.33%) – יורשי רחל כהן ז"ל, אחותי:
    6.3.1 רבע ראשון מהשליש (הינו 8.33%) – לבנה אבי כהן.
    6.3.2 רבע שני מהשליש (הינו 8.33%) – לבנה יוסי כהן.
    6.3.3 מחצית מהשליש (הינו 16.67%) – לבנה דני כהן.
```

### סעיף 7: דיור בנכס (אופציונלי)

אם רוצים לאפשר לבן זוג להישאר בדירה:

```markdown
.7  למען הסר ספק, אני מבהיר/ה במפורש כי [בן/בת הזוג שלי], [שם], 
    זכאי/ת להמשיך ולהתגורר ב[שם הנכס] עד יום מותו/ה, וזאת ללא כל 
    תשלום דמי שכירות או דמי שימוש. זכות זו היא אישית, ואינה ניתנת 
    להעברה או למכירה.
```

### סעיף 8: פסילת יורש מתנגד (מומלץ מאוד!)

```markdown
.8  כל אדם שיהיה זכאי על פי צוואה זו, ויתנגד לה או יערער עליה בכל 
    דרך שהיא, או יטען כנגד תוקפה או כנגד תנאי מתנאיה, או ינהל הליכים 
    משפטיים במטרה לבטלה או לשנותה, יאבד את כלל זכויותיו לירושה על 
    פי צוואה זו, ויקבל במקום זאת סכום סימלי של שקל אחד (₪1) בלבד.
```

### סעיף 9: ביצוע בשיתוף פעולה (מומלץ)

```markdown
.9  הנני מצווה, כי ביצוע וקיום צוואה זו יהא בروח טובה בשיתוף פעולה 
    הדדי בין היורשים.
```

---

## ✍️ 4. חתימת המצווה

```markdown
ולראיה באתי על החתום מרצוני הטוב והחופשי, בהיותי בדעה צלולה ולאחר 
שיקול דעת, בפני העדים הח"מ הנקובים בשמותיהם וכתובותיהם ולאחר 
שהצהרתי בנוכחות שני עדי הצוואה המפורטים להלן כי זו צוואתי.

נחתם בעיר: [עיר], היום, [תאריך] בחודש [חודש], [שנה].




_____________________
[שם המצווה]
```

**פורמט תאריך:**
- "18, בחודש אוגוסט, 2025"
- או: "היום, 18 לחודש אוגוסט, 2025"

---

## 👥 5. עדים (חובה - שני עדים!)

```markdown
אנו הח"מ:

.1  [שם עד 1], ת.ז. [מספר], מרחוב: [כתובת מלאה]

.2  [שם עד 2], ת.ז. [מספר], מרחוב: [כתובת מלאה]

אנו מעידות/מעידים בזאת שהמצווה: [שם המצווה], נושאת/נושא ת.ז. מס' 
[מספר], חתמה/חתם בפנינו מרצונה/מרצונו הטוב והחופשי והצהירה/והצהיר כי 
זו צוואתה/צוואתו. אנו מצהירות/מצהירים כי אנו לא קטינות/קטינים ולא 
פסולות/פסולי דין וכי אין לאף אחת/אחד מאיתנו כל טובת הנאה בעיזבון של 
המצווה. אנו חותמות/חותמים בתור עדות/עדים לצוואה בנוכחותה של המצווה 
ובנוכחות כל אחת/אחד מאיתנו.

ולראיה באנו על החתום היום: [תאריך] לחודש: [חודש] שנת: [שנה]




___________________          ___________________
[שם עד 1]                     [שם עד 2]
```

**חשוב על העדים:**
- חייבים להיות 2 עדים בדיוק
- מעל גיל 18
- לא יורשים בצוואה
- לא בני זוג של יורשים
- צריכים להיות נוכחים ביחד בזמן החתימה

---

## 📌 שורה אחרונה (אופציונלי)

```markdown
צוואה זו נערכה ונחתמה ב[עיר], במשרדו של עו"ד [שם עורך הדין]
```

---

## 💻 Types ל-TypeScript

```typescript
// src/types/will.ts

export interface Will {
  // פרטי המצווה
  testator: {
    fullName: string
    shortName: string              // לשימוש ב"להלן"
    id: string                      // ת.ז.
    address: {
      street: string
      houseNumber: string
      apartment?: string
      city: string
    }
    gender: 'male' | 'female'
    dateOfBirth?: string
  }
  
  // מידע משפחתי (אופציונלי)
  familyInfo?: {
    spouse?: Person
    children?: Person[]
    siblings?: Person[]
    parents?: Person[]
    note?: string                   // הערות נוספות
  }
  
  // העיזבון - הנכסים
  estate: {
    realEstate: RealEstateProperty[]
    bankAccounts: BankAccount[]
    cash: boolean
    jewelry: boolean
    vehicle: boolean
    stocks?: boolean
    business?: boolean
    other?: string[]
  }
  
  // היורשים
  heirs: Heir[]
  
  // חלוקת נכסים
  distribution: Distribution[]
  
  // סעיפים מיוחדים
  specialClauses: {
    housingRights?: HousingRights   // זכות מגורים
    contestClause: boolean          // פסילת מתנגד
    cooperationClause: boolean      // שיתוף פעולה
    contingentHeirs: boolean        // יורשים חליפיים
    otherClauses?: string[]
  }
  
  // עדים
  witnesses: [Witness, Witness]     // בדיוק 2 עדים
  
  // פרטי חתימה
  signing: {
    date: string                    // תאריך מלא
    city: string
    lawyerName?: string
    lawyerOffice?: string
  }
  
  // מטאדאטה
  metadata: {
    createdAt: string
    createdBy: string
    version: number
    status: 'draft' | 'final' | 'signed'
  }
}

export interface Person {
  fullName: string
  id: string                        // ת.ז.
  relationship?: string             // "בן", "בת", "אח", "אחות"
  deceased?: boolean
  dateOfDeath?: string
}

export interface RealEstateProperty {
  type: 'apartment' | 'house' | 'land' | 'commercial'
  address: string
  gush: string                      // גוש
  helka: string                     // חלקה
  tatHelka?: string                 // תת-חלקה
  nickname: string                  // "דירת המגורים", "דירת השקעה"
  ownership: 'full' | 'shared'
  sharedWith?: string[]
}

export interface BankAccount {
  bankName: string
  bankNumber: string
  branchNumber: string
  accountNumber: string
  accountType?: string
}

export type HeirsDisplayFormat = 'list' | 'table' | 'detailed_table'

export interface Heir {
  person: Person
  nickname: string                  // לשימוש בצוואה
  share: number                     // באחוזים
  shareDescription: string          // "שליש", "מחצית", "רבע"
  conditions?: string[]             // תנאים
  subHeirs?: SubHeir[]              // יורשים משניים
  notes?: string                    // הערות נוספות (לטבלה מפורטת)
}

export interface SubHeir {
  person: Person
  shareOfMainHeir: number           // באחוזים מהיורש הראשי
  shareDescription: string
}

export interface Distribution {
  asset: string                     // תיאור הנכס
  heir: string                      // שם היורש (או "כל היורשים")
  share?: number                    // אחוז (אם ספציפי)
  note?: string
}

export interface HousingRights {
  beneficiary: Person
  property: string                  // איזה נכס
  conditions?: string[]
  duration: 'lifetime' | 'until_remarriage' | 'years'
  years?: number
}

export interface Witness {
  fullName: string
  id: string
  address: string
  relationship?: string             // "שכן", "חבר", "עובד"
  cannotBe: string[]               // לא יכול להיות: "יורש", "בן זוג של יורש"
}
```

---

## 🎨 CSS לעיצוב המסמך

```css
/* src/styles/will-document.css */

.will-document {
  width: 21cm;
  min-height: 29.7cm;
  padding: 2cm;
  margin: 0 auto;
  background: white;
  box-sizing: border-box;
  
  /* המסגרת החיצונית */
  border: 3pt solid #000;
  position: relative;
}

.will-title {
  text-align: center;
  font-size: 28pt;
  font-weight: bold;
  font-family: 'David', 'Times New Roman', serif;
  margin: 2cm 0;
  line-height: 1;
}

.will-content {
  font-family: 'David', 'Times New Roman', serif;
  font-size: 12pt;
  line-height: 1.8;
  text-align: justify;
  direction: rtl;
}

.will-preamble {
  margin-bottom: 2cm;
  text-align: justify;
}

.will-clause {
  margin-bottom: 1.5em;
  text-indent: -1.5em;
  padding-right: 1.5em;
}

.will-signatures {
  margin-top: 3cm;
  display: flex;
  justify-content: space-between;
}

.signature-line {
  width: 40%;
  text-align: center;
  border-top: 1pt solid #000;
  padding-top: 5pt;
}

/* טבלה ליורשים */
.heirs-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
  direction: rtl;
}

.heirs-table th,
.heirs-table td {
  border: 1pt solid #000;
  padding: 8pt;
  text-align: right;
}

.heirs-table th {
  background-color: #f0f0f0;
  font-weight: bold;
}
```

---

## 🎮 קומפוננטת בחירת פורמט יורשים

```tsx
// src/components/HeirsFormatSelector.tsx

import { useState } from 'react'

type HeirsDisplayFormat = 'list' | 'table' | 'detailed_table'

interface Props {
  value: HeirsDisplayFormat
  onChange: (format: HeirsDisplayFormat) => void
  heirsCount: number
}

export default function HeirsFormatSelector({ value, onChange, heirsCount }: Props) {
  return (
    <div className="mb-6">
      <label className="block font-semibold mb-3">
        כיצד להציג את היורשים במסמך?
      </label>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* אפשרות 1: רשימה */}
        <FormatOption
          id="list"
          selected={value === 'list'}
          onClick={() => onChange('list')}
          title="רשימה"
          subtitle="מומלץ עד 4 יורשים"
          recommended={heirsCount <= 4}
          preview={
            <div className="text-xs font-mono bg-gray-100 p-2 rounded mt-2">
              .6.1 שליש – דוד<br/>
              .6.2 שליש – שרה<br/>
              .6.3 שליש – מיכל
            </div>
          }
        />
        
        {/* אפשרות 2: טבלה */}
        <FormatOption
          id="table"
          selected={value === 'table'}
          onClick={() => onChange('table')}
          title="טבלה"
          subtitle="מומלץ ל-5+ יורשים"
          recommended={heirsCount >= 5}
          preview={
            <div className="text-xs font-mono bg-gray-100 p-2 rounded mt-2 text-left">
              ┌────────┬───────┐<br/>
              │ שם     │ חלק   │<br/>
              ├────────┼───────┤<br/>
              │ דוד    │ 33%   │<br/>
              └────────┴───────┘
            </div>
          }
        />
        
        {/* אפשרות 3: טבלה מפורטת */}
        <FormatOption
          id="detailed_table"
          selected={value === 'detailed_table'}
          onClick={() => onChange('detailed_table')}
          title="טבלה מפורטת"
          subtitle="עם הערות ופרטים"
          recommended={false}
          preview={
            <div className="text-xs font-mono bg-gray-100 p-2 rounded mt-2 text-left">
              ┌────┬────┬───────┐<br/>
              │ שם │ חלק│ הערות │<br/>
              ├────┼────┼───────┤<br/>
              │דוד │33% │ בכור  │<br/>
              └────┴────┴───────┘
            </div>
          }
        />
      </div>
      
      {/* המלצה אוטומטית */}
      {heirsCount > 0 && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
          <span className="font-semibold">💡 המלצה: </span>
          {heirsCount <= 4 ? (
            <span>מכיוון שיש לך {heirsCount} יורשים, פורמט <strong>רשימה</strong> יהיה הכי קריא.</span>
          ) : (
            <span>מכיוון שיש לך {heirsCount} יורשים, פורמט <strong>טבלה</strong> יהיה הכי מסודר.</span>
          )}
        </div>
      )}
    </div>
  )
}

interface FormatOptionProps {
  id: string
  selected: boolean
  onClick: () => void
  title: string
  subtitle: string
  recommended: boolean
  preview: React.ReactNode
}

function FormatOption({ id, selected, onClick, title, subtitle, recommended, preview }: FormatOptionProps) {
  return (
    <div
      className={`
        relative border-2 p-4 rounded-lg cursor-pointer transition-all
        ${selected 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-gray-300 hover:border-gray-400'
        }
      `}
      onClick={onClick}
    >
      {recommended && (
        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
          מומלץ
        </div>
      )}
      
      <input
        type="radio"
        id={id}
        name="heirs-format"
        checked={selected}
        onChange={onClick}
        className="mb-2"
      />
      
      <label htmlFor={id} className="cursor-pointer">
        <div className="font-semibold text-lg">{title}</div>
        <div className="text-sm text-gray-600 mt-1">{subtitle}</div>
        {preview}
      </label>
    </div>
  )
}
```

---

## 📊 יצירת PDF עם הפורמט הנבחר

```typescript
// src/lib/pdf/generate-will-heirs-section.ts

import PDFDocument from 'pdfkit'

export function addHeirsSection(
  doc: PDFDocument, 
  heirs: Heir[], 
  format: HeirsDisplayFormat
) {
  doc.fontSize(12)
  
  switch (format) {
    case 'list':
      addHeirsAsList(doc, heirs)
      break
    case 'table':
      addHeirsAsTable(doc, heirs)
      break
    case 'detailed_table':
      addHeirsAsDetailedTable(doc, heirs)
      break
  }
}

function addHeirsAsList(doc: PDFDocument, heirs: Heir[]) {
  doc.text('.6  הנני מצווה ומורישה ליורשים הבאים:', { continued: false })
  doc.moveDown(0.5)
  
  // רשימת שמות עם ת.ז.
  heirs.forEach(heir => {
    doc.text(
      `    ${heir.person.fullName}, ת.ז. מספר ${heir.person.id} (להלן: "${heir.nickname}")`,
      { continued: false }
    )
  })
  
  doc.text(`    ב${getHebrewPlural(heirs.length)} חלקים שווים (להלן: "היורשים") כמפורט להלן:`)
  doc.moveDown(0.5)
  
  // חלוקה
  heirs.forEach((heir, index) => {
    const subNumber = index + 1
    doc.text(
      `    6.${subNumber} ${heir.shareDescription} (${heir.share}%) – ${heir.nickname}, ${heir.person.relationship}.`,
      { continued: false }
    )
    
    // יורשים משניים
    if (heir.subHeirs && heir.subHeirs.length > 0) {
      heir.subHeirs.forEach((subHeir, subIndex) => {
        doc.text(
          `        6.${subNumber}.${subIndex + 1} ${subHeir.shareDescription} מה${heir.shareDescription} (הינו ${subHeir.shareOfMainHeir}%) – לבנ${subHeir.person.gender === 'male' ? 'ו' : 'ה'} ${subHeir.person.fullName}.`,
          { continued: false }
        )
      })
    }
    
    doc.moveDown(0.3)
  })
}

function addHeirsAsTable(doc: PDFDocument, heirs: Heir[]) {
  doc.text('.6  הנני מצווה ומורישה ליורשים הבאים:', { continued: false })
  doc.moveDown(1)
  
  const tableTop = doc.y
  const tableLeft = doc.page.margins.right + 20
  const colWidths = {
    name: 180,
    id: 100,
    relationship: 80,
    share: 70
  }
  const rowHeight = 25
  const totalWidth = Object.values(colWidths).reduce((a, b) => a + b, 0)
  
  // ציור המסגרת החיצונית
  doc.rect(tableLeft, tableTop, totalWidth, rowHeight * (heirs.length + 1))
     .stroke()
  
  // קו אופקי אחרי הכותרות
  doc.moveTo(tableLeft, tableTop + rowHeight)
     .lineTo(tableLeft + totalWidth, tableTop + rowHeight)
     .stroke()
  
  // קווים אנכיים
  let xPos = tableLeft
  Object.values(colWidths).forEach((width, index) => {
    if (index > 0) {
      doc.moveTo(xPos, tableTop)
         .lineTo(xPos, tableTop + rowHeight * (heirs.length + 1))
         .stroke()
    }
    xPos += width
  })
  
  // שורת כותרות
  doc.fontSize(12).font('Helvetica-Bold')
  doc.text('שם היורש', tableLeft + 5, tableTop + 7, { width: colWidths.name - 10 })
  doc.text('ת.ז.', tableLeft + colWidths.name + 5, tableTop + 7, { width: colWidths.id - 10 })
  doc.text('קירבה', tableLeft + colWidths.name + colWidths.id + 5, tableTop + 7, { width: colWidths.relationship - 10 })
  doc.text('חלק', tableLeft + colWidths.name + colWidths.id + colWidths.relationship + 5, tableTop + 7, { width: colWidths.share - 10 })
  
  // שורות יורשים
  doc.font('Helvetica')
  heirs.forEach((heir, index) => {
    const yPos = tableTop + rowHeight * (index + 1) + 7
    
    doc.text(heir.person.fullName, tableLeft + 5, yPos, { width: colWidths.name - 10 })
    doc.text(heir.person.id, tableLeft + colWidths.name + 5, yPos, { width: colWidths.id - 10 })
    doc.text(heir.person.relationship || '', tableLeft + colWidths.name + colWidths.id + 5, yPos, { width: colWidths.relationship - 10 })
    doc.text(`${heir.share}%`, tableLeft + colWidths.name + colWidths.id + colWidths.relationship + 5, yPos, { width: colWidths.share - 10 })
    
    // קו אופקי בין שורות (לא אחרי השורה האחרונה)
    if (index < heirs.length - 1) {
      doc.moveTo(tableLeft, yPos + 18)
         .lineTo(tableLeft + totalWidth, yPos + 18)
         .stroke()
    }
  })
  
  doc.moveDown(2)
  doc.text('    (להלן: "היורשים")', { continued: false })
}

function addHeirsAsDetailedTable(doc: PDFDocument, heirs: Heir[]) {
  // דומה ל-addHeirsAsTable אבל עם עמודת הערות
  doc.text('.6  הנני מצווה ומורישה ליורשים הבאים:', { continued: false })
  doc.moveDown(1)
  
  const tableTop = doc.y
  const tableLeft = doc.page.margins.right + 20
  const colWidths = {
    number: 40,
    name: 140,
    id: 90,
    share: 60,
    notes: 110
  }
  const rowHeight = 30  // גבוה יותר בגלל הערות
  const totalWidth = Object.values(colWidths).reduce((a, b) => a + b, 0)
  
  // [קוד דומה לטבלה רגילה אבל עם 5 עמודות]
  // ...
}

// פונקציות עזר
function getHebrewPlural(count: number): string {
  const plurals: Record<number, string> = {
    2: 'שני',
    3: 'שלושה',
    4: 'ארבעה',
    5: 'חמישה',
    6: 'שישה',
    7: 'שבעה',
    8: 'שמונה'
  }
  return plurals[count] || `${count}`
}
```

---

## ✅ סיכום - מה צריך לממש

### 1. בממשק (UI):
- [ ] כפתורי בחירה (radio buttons) לפורמט תצוגה
- [ ] תצוגה מקדימה של כל פורמט
- [ ] המלצה אוטומטית לפי מספר יורשים
- [ ] אפשרות לשנות פורמט גם אחרי הזנת היורשים

### 2. בלוגיקה:
- [ ] שמירת הפורמט הנבחר ב-state
- [ ] העברת הפורמט ל-PDF generator
- [ ] חישוב אוטומטי של אחוזים
- [ ] ולידציה: סכום אחוזים = 100%

### 3. ב-PDF:
- [ ] פונקציה ליצירת רשימה
- [ ] פונקציה ליצירת טבלה פשוטה
- [ ] פונקציה ליצירת טבלה מפורטת
- [ ] טיפול ביורשים משניים (sub-heirs)
- [ ] שמירת פורמט עברי נכון

### 4. תכונות נוספות (nice-to-have):
- [ ] Preview של המסמך עם הפורמט הנבחר
- [ ] שינוי פורמט דינמי בתצוגה מקדימה
- [ ] ייצוא ל-Word עם טבלאות אמיתיות
- [ ] העתקה ללוח (copy to clipboard)

**כלל אצבע:**
- עד 3 יורשים → רשימה
- 4-6 יורשים → רשימה או טבלה (לפי העדפה)
- 7+ יורשים → טבלה (מומלץ)
- יורשים עם תנאים/הערות → טבלה מפורטת