/**
 * טיפוסים למערכת צוואות - מבנה משופר
 */

export type WillType = 'individual' | 'mutual'; // יחיד או הדדית
export type Gender = 'male' | 'female';

// יורש
export interface Beneficiary {
  name: string;
  id: string;
  relationship: string; // קרבה
  share: string; // חלק בשבר (לדוגמה: "1/3")
}

// סעיף
export interface Clause {
  number: number;
  text: string;
  editable: boolean; // האם ניתן לעריכה
  subItems?: string[]; // תתי-סעיפים (7.1, 7.2...)
}

// עד
export interface Witness {
  name: string;
  id: string;
  address: string;
}

// נכס מפורט
export interface Asset {
  type: 'apartment' | 'land' | 'bank' | 'cash' | 'jewelry' | 'vehicle' | 'stocks' | 'other';
  description: string; // תיאור מפורט
}

// צוואת יחיד
export interface IndividualWillData {
  type: 'individual';
  
  // המצווה
  testator: {
    name: string;
    id: string;
    address: string;
    gender: Gender;
  };
  
  // היקף העיזבון
  estate: {
    assets: Asset[];
    generalDescription?: string;
  };
  
  // יורשים
  beneficiaries: Beneficiary[];
  
  // סעיפים סטנדרטיים (ניתנים לעריכה)
  standardClauses: {
    revocation: Clause; // ביטול צוואות קודמות
    debts: Clause; // תשלום חובות
    scope: Clause; // היקף הצוואה
    predeceased: Clause; // פטירת יורש
    opposition: Clause; // התנגדות
    goodFaith: Clause; // רוח טובה
    declaration: Clause; // הצהרת חתימה
  };
  
  // סעיפים נוספים (ממוספרים)
  additionalClauses: Clause[];
  
  // הוראות מיוחדות (עם תתי-סעיפים)
  specialInstructions: Clause[];
  
  // עדים
  witnesses: [Witness, Witness];
  
  // תאריך
  date: string;
  hebrewDate?: string;
}

// בן/בת זוג לצוואה הדדית
export interface Spouse {
  name: string;
  id: string;
  address: string;
  nickname?: string; // כינוי בצוואה
}

// יורש בצוואה הדדית
export interface MutualBeneficiary {
  name: string;
  id: string;
  relationship: string;
  inheritanceDetails: string[]; // רשימת דברים שהוא יורש
}

// הוראה מיוחדת
export interface MutualClause {
  number: number;
  text: string;
  subItems?: string[];
}

// צוואה הדדית
export interface MutualWillData {
  type: 'mutual';
  
  // בני הזוג
  spouses: [Spouse, Spouse];
  marriageYear?: number;
  
  // העיזבון
  estate: {
    assets: string[]; // רשימת נכסים בטקסט חופשי
  };
  
  // סעיפים סטנדרטיים
  standardClauses: {
    marriage: Clause; // נישואין
    revocation: Clause; // ביטול צוואות קודמות
    debts: Clause; // תשלום חובות
    rightToRevoke: Clause; // זכות ביטול
    estateScope: Clause; // היקף העיזבון - טקסט כללי
  };
  
  // יורשים
  beneficiaries: MutualBeneficiary[];
  
  // הוראות מיוחדות (זכות מגורים, איסור מכירה וכו')
  specialProvisions: MutualClause[];
  
  // סעיף דרישה
  demandClause: Clause;
  
  // סיום
  closing: {
    blessing: string; // ברכה לבנים ונכדים
    declaration: string; // הצהרת חתימה
  };
  
  // עדים
  witnesses: [Witness, Witness];
  
  // תאריך
  date: string;
  hebrewDate?: string;
}

export type WillData = IndividualWillData | MutualWillData;

// ברירת מחדל לצוואה הדדית
export function defaultMutualWillData(): MutualWillData {
  return {
    type: 'mutual',
    
    spouses: [
      { name: '', id: '', address: '', nickname: '' },
      { name: '', id: '', address: '', nickname: '' },
    ],
    
    marriageYear: undefined,
    
    estate: {
      assets: [],
    },
    
    standardClauses: {
      marriage: {
        number: 1,
        text: 'אנו נשואים משנת _____, חיים יחד באושר ומקיימים האחד את השנייה.',
        editable: true,
      },
      revocation: {
        number: 2,
        text: 'למען הסר ספק, אנו מבטלים בזה ביטול גמור, מוחלט ושלם כל צוואה ו/או הוראה שנתנו בעבר לפני תאריך חתימה על צוואה זו, בין בכתב ובין בעל פה בקשור לרכושנו ולנכסנו, כל מסמך, או כתב, כל שיחה שבעל פה, שיש בה מעין גילוי דעת על מה שיש ברצוננו שייעשה בעיזבוננו לאחר מותנו.',
        editable: true,
      },
      debts: {
        number: 3,
        text: 'אנו מורים ליורשים אשר יבצעו את צוואתנו לשלם מתוך עיזבוננו האמור את כל חובותינו שיעמדו לפירעון בעת פטירתנו, הוצאות הבאתנו לארץ אם פטירתנו תהא בחו"ל והוצאות קבורתנו, כולל הקמת מצבה מתאימה על קברנו וכן כל ההוצאות הכרוכות במתן צו לקיים צוואתנו.',
        editable: true,
      },
      rightToRevoke: {
        number: 4,
        text: 'כל עוד שנינו בחיים, לכל אחד מאיתנו נשמרת הזכות לבטל צוואה זו, על ידי הודעה בדבר הביטול בכתב לצד האחר.',
        editable: true,
      },
      estateScope: {
        number: 5,
        text: 'במקרה ומי מאיתנו ילך לבית עולמו לפני רעהו, הרי שכל רכושו מכל מין וסוג שהוא בין במקרקעין, בין במטלטלין, זכויות, ניירות ערך למיניהם, קופות גמל, קרנות השתלמות, ביטוחי חיים, פקדונות וכל צורה אחרת, בין שהם קיימים היום ואנו יודעים על קיומם בין שאינם קיימים היום או שאיננו יודעים על קיומם ויהיו שייכים לנו בעתיד, כספים במזומן ובבנקים, שיש לנו היום ושיהיו לנו בעתיד, המצויים ו/או מוחזקים בידי כל אדם ו/או גוף, בישראל ובכל מקום אחר בעולם ולרבות כל שיתווסף בעתיד- יעבור לנותר בחיים מבין שנינו.',
        editable: true,
      },
    },
    
    beneficiaries: [],
    
    specialProvisions: [],
    
    demandClause: {
      number: 0, // יוצב דינמית
      text: 'הננו דורשים מכל אדם ומכל רשות לקיים צוואה זו ולא לערער עליה ולא להתנגד לה ולא לתקוף אותה, ואם יתעורר אי פעם ספק כלשהו בקשר לצוואה זו, הרי שיש להתיר את הספק לפי הדין ולתת לה תוקף ולקיים אותה.',
      editable: true,
    },
    
    closing: {
      blessing: 'אנו מברכים את בנותינו, נכדינו ומשפחותיהם, שתזכו לחיים טובים וארוכים, מתוך בריאות טובה ונחת. בקשתנו האחרונה היא, שישרור שלום אמת בינכם, רעות ואחווה כל ימי חייכם.',
      declaration: 'על שטר צוואה זה חתמתנו מרצוננו הטוב בהיותנו בדעה צלולה ומיושבת ביודענו ידיעה ברורה את אשר אנו עושים, מרצוננו הטוב החופשי בהעדר כל אונס, איום, השפעה בלתי הוגנת, תחבולה או תרמית ולראיה באנו על החתום בפני העדות הח"מ הנקובות בשמותיהן וכתובותיהן לאחר שהצהרנו בפניהן כי זו צוואתנו וביקשנו מהן לאשר בחתימתן שכך הצהרנו וחתמנו בפניהן.',
    },
    
    witnesses: [
      { name: '', id: '', address: '' },
      { name: '', id: '', address: '' },
    ],
    
    date: new Date().toLocaleDateString('he-IL'),
    hebrewDate: '',
  };
}

// ברירת מחדל לצוואת יחיד
export function defaultIndividualWillData(): IndividualWillData {
  return {
    type: 'individual',
    
    testator: {
      name: '',
      id: '',
      address: '',
      gender: 'female',
    },
    
    estate: {
      assets: [],
      generalDescription: '',
    },
    
    beneficiaries: [],
    
    standardClauses: {
      revocation: {
        number: 1,
        text: 'למען הסר ספק, אני מבטלת בזה ביטול גמור, מוחלט ושלם, כל צוואה ו/או הוראה שנתתי בעבר לפני תאריך חתימה על צוואה זו, בין בכתב ובין בעל פה בקשור לרכושי ולנכסיי, כל מסמך, או כתב, כל שיחה שבעל פה, שיש בה מעין גילוי דעת על מה שיש ברצוני שייעשה בעיזבוני לאחר מותי.',
        editable: true,
      },
      debts: {
        number: 2,
        text: 'אני מורה ליורשיי אשר יבצעו את צוואתי לשלם מתוך עיזבוני האמור את כל חובותיי שיעמדו לפירעון בעת פטירתי, הוצאות הבאתי לארץ אם פטירתי תהא בחו"ל והוצאות קבורתי, כולל הקמת מצבה מתאימה על קברי וכן כל ההוצאות הכרוכות במתן צו לקיום צוואתי.',
        editable: true,
      },
      scope: {
        number: 3,
        text: 'צוואתי זו חלה ותחול על כל רכושי מכל מין וסוג, בין בארץ ובין בחו"ל, ללא יוצא מן הכלל, בין אם הוא בבעלותי הבלעדית ובין אם בבעלותי המשותפת עם אחרים. מבלי לפגוע בכלליות האמור לעיל, צוואתי זו חלה ותחול גם על כספים, תוכניות חסכון, קרנות נאמנות, ניירות ערך, תביעות, פנסיות, תגמולים, ביטוח חיים, קצבאות, בין אם מופקדים בבנק ובין אם בידי כל גורם אחר, וכן על זכויות אחרות מכל סוג שהוא, וכל רכוש אחר בין במיטלטלין ובין במקרקעין (רשומים ושאינם רשומים), אשר בבעלותי כיום ו/או יגיעו לידי בעתיד (להלן: "עזבוני"), לרבות:',
        editable: true,
      },
      predeceased: {
        number: 0, // יוצב מספר דינמי
        text: 'במקרה של פטירת אחד מהיורשים הנזכרים לעיל לפני פטירתי, חלקו יעבור ליורשיו החוקיים.',
        editable: true,
      },
      opposition: {
        number: 0,
        text: 'כל אדם שיהיה זכאי על פי צוואה זו, ויתנגד לה או יערער עליה בכל דרך שהיא, או יטען כנגד תוקפה או כנגד תנאי מתנאיה, או ינהל הליכים משפטיים במטרה לבטלה או לשנותה, יאבד את כלל זכויותיו לירושה על פי צוואה זו, ויקבל במקום זאת סכום סימלי של שקל אחד (₪1) בלבד. תשלום השקל האמור יהווה את מלוא זכותו בעזבוני, וזאת במקום כל זכות או טענה אחרת שתהיה לו בעזבוני. תנאי זה יחול גם על מי שפועל בשמו של היורש או מטעמו, וכן על כל מי שיסייע או יעודד התנגדות לצוואה זו.',
        editable: true,
      },
      goodFaith: {
        number: 0,
        text: 'הנני מצווה, כי ביצוע וקיום צוואה זו יהא ברוח טובה בשיתוף פעולה הדדי בין היורשים.',
        editable: true,
      },
      declaration: {
        number: 0,
        text: 'ולראיה באתי על החתום מרצוני הטוב והחופשי, בהיותי בדעה צלולה ולאחר שיקול דעת, בפני העדים הח"מ הנקובים בשמותיהם וכתובותיהם ולאחר שהצהרתי בנוכחות שני עדי הצוואה המפורטים להלן כי זו צוואתי.',
        editable: true,
      },
    },
    
    additionalClauses: [],
    
    specialInstructions: [],
    
    witnesses: [
      { name: '', id: '', address: '' },
      { name: '', id: '', address: '' },
    ],
    
    date: new Date().toLocaleDateString('he-IL'),
    hebrewDate: '',
  };
}

// טקסטים לפי מגדר
export function getGenderedText(text: string, gender: Gender): string {
  if (gender === 'male') {
    return text
      .replace(/מבטלת/g, 'מבטל')
      .replace(/מצהירה/g, 'מצהיר')
      .replace(/חתמה/g, 'חתם')
      .replace(/נושאת/g, 'נושא')
      .replace(/המצווה:/g, 'המצווה:')
      .replace(/אני הח"מ/g, 'אני הח"מ');
  }
  return text;
}

// המרת אחוזים לשברים
export function percentToFraction(percent: number): string {
  // המרות נפוצות
  const common: { [key: number]: string } = {
    100: '1/1',
    50: '1/2',
    33.33: '1/3',
    66.67: '2/3',
    25: '1/4',
    75: '3/4',
    20: '1/5',
    16.67: '1/6',
  };
  
  return common[percent] || `${percent}%`;
}

// Backwards compatibility
export function defaultWillData(): any {
  return {
    fullName: '',
    idNumber: '',
    street: '',
    city: '',
    gender: 'female',
    spouseName: '',
    numChildren: 1,
    children: [''],
    assets: {
      apartment: { enabled: false },
      bankAccount: { enabled: false },
      cash: { enabled: false },
      jewelry: { enabled: false },
      vehicle: { enabled: false },
      digital: { enabled: false },
      land: { enabled: false },
      securities: { enabled: false },
    },
    otherAssets: '',
    allocations: [],
    extraClauses: [],
    witnesses: [
      { name: '', id: '', address: '' },
      { name: '', id: '', address: '' },
    ],
    date: new Date().toISOString().substring(0, 10),
  };
}

export const getInitialData = defaultWillData;

// Types for the existing implementation
export interface WillDataLegacy {
  fullName: string;
  idNumber: string;
  street: string;
  city: string;
  gender?: 'male' | 'female';
  spouseName?: string;
  numChildren: number;
  children: string[];
  assets: any;
  otherAssets?: string;
  allocations?: Array<{ beneficiary: string; sharePercent: number }>;
  extraClauses?: string[];
  witnesses: Array<{ name: string; id: string; address: string }>;
  date: string;
}
