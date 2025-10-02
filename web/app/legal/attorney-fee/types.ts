/**
 * טיפוסים להסכם שכר טרחה - מפרט מלא
 */

export type FeeStructure = 
  | 'flat_fee'           // סכום קבוע
  | 'hourly_rate'        // תעריף שעתי
  | 'contingency'        // אחוזים מהתוצאה
  | 'retainer_plus'      // מקדמה + שעתי
  | 'mixed';             // מעורב

export type PaymentSchedule = 
  | 'upfront'            // מראש
  | 'installments'       // תשלומים
  | 'upon_completion'    // בסיום
  | 'monthly';           // חודשי

export interface Attorney {
  name: string;
  licenseNumber: string;
  address: string;
  phone: string;
  email?: string;
}

export interface Client {
  name: string;
  id: string;
  address: string;
  phone: string;
  email?: string;
}

export interface Service {
  description: string;
  caseNumber?: string;
  court?: string;
}

export interface FeeDetails {
  structure: FeeStructure;
  
  // לסכום קבוע
  flatAmount?: number;
  flatAmountInWords?: string;
  
  // לתעריף שעתי
  hourlyRate?: number;
  estimatedHours?: number;
  
  // לאחוזים
  percentage?: number;
  
  // למעורב
  retainerAmount?: number;
  additionalHourlyRate?: number;
  
  // כולל מע"מ?
  includesVAT: boolean;
}

export interface PaymentTerms {
  schedule: PaymentSchedule;
  
  // לתשלומים
  installments?: Array<{
    amount: number;
    date: string;
    description: string;
  }>;
  
  notes?: string;
}

export interface AttorneyFeeData {
  // פרטים כלליים
  date: string;
  location: string;
  
  // צדדים
  attorney: Attorney;
  client: Client;
  
  // השירותים
  services: Service[];
  
  // שכר הטרחה
  fee: FeeDetails;
  
  // תנאי תשלום
  payment: PaymentTerms;
  
  // מה כלול
  included: {
    courtRepresentation: boolean;
    documentPreparation: boolean;
    correspondence: boolean;
    phoneConsultations: boolean;
    meetings: boolean;
    other: string[];
  };
  
  // מה לא כלול
  excluded: {
    courtFees: boolean;
    expertFees: boolean;
    appeals: boolean;
    enforcement: boolean;
    otherCourts: boolean;
    other: string[];
  };
  
  // תנאים מיוחדים
  specialTerms: {
    terminationByClient: string; // מה קורה אם הלקוח מפסיק
    terminationByAttorney: boolean; // האם עו"ד יכול להפסיק
    additionalNotes: string[];
  };
}

export function getInitialData(): AttorneyFeeData {
  return {
    date: new Date().toLocaleDateString('he-IL'),
    location: '',
    
    attorney: {
      name: '',
      licenseNumber: '',
      address: '',
      phone: '',
      email: '',
    },
    
    client: {
      name: '',
      id: '',
      address: '',
      phone: '',
      email: '',
    },
    
    services: [{
      description: '',
      caseNumber: '',
      court: '',
    }],
    
    fee: {
      structure: 'flat_fee',
      flatAmount: 0,
      includesVAT: true,
    },
    
    payment: {
      schedule: 'upfront',
      installments: [],
      notes: '',
    },
    
    included: {
      courtRepresentation: true,
      documentPreparation: true,
      correspondence: true,
      phoneConsultations: true,
      meetings: true,
      other: [],
    },
    
    excluded: {
      courtFees: true,
      expertFees: true,
      appeals: true,
      enforcement: true,
      otherCourts: true,
      other: [],
    },
    
    specialTerms: {
      terminationByClient: 'full',
      terminationByAttorney: true,
      additionalNotes: [],
    },
  };
}

/**
 * חישוב שכר טרחה מומלץ לפי תקנות
 */
export function calculateRecommendedFee(estateValue: number): {
  breakdown: Array<{ range: string; percentage: number; amount: number }>;
  subtotal: number;
  vat: number;
  total: number;
} {
  const breakdown = [];
  let remaining = estateValue;
  let subtotal = 0;

  // מדרגות לפי תקנות לשכת עורכי הדין
  
  // עד 300,000 ₪ - 6%
  if (remaining > 0) {
    const amount = Math.min(remaining, 300000);
    const fee = amount * 0.06;
    breakdown.push({ 
      range: '₪300,000 הראשונים', 
      percentage: 6, 
      amount: fee 
    });
    subtotal += fee;
    remaining -= amount;
  }

  // 300,001-500,000 ₪ - 5%
  if (remaining > 0) {
    const amount = Math.min(remaining, 200000);
    const fee = amount * 0.05;
    breakdown.push({ 
      range: '₪200,000 הבאים', 
      percentage: 5, 
      amount: fee 
    });
    subtotal += fee;
    remaining -= amount;
  }

  // 500,001-1,000,000 ₪ - 3%
  if (remaining > 0) {
    const amount = Math.min(remaining, 500000);
    const fee = amount * 0.03;
    breakdown.push({ 
      range: '₪500,000 הבאים', 
      percentage: 3, 
      amount: fee 
    });
    subtotal += fee;
    remaining -= amount;
  }

  // מעל 1,000,000 ₪ - 2%
  if (remaining > 0) {
    const fee = remaining * 0.02;
    breakdown.push({ 
      range: 'יתרה מעל מיליון', 
      percentage: 2, 
      amount: fee 
    });
    subtotal += fee;
  }

  const vat = subtotal * 0.17;
  const total = subtotal + vat;

  return {
    breakdown,
    subtotal,
    vat,
    total,
  };
}

/**
 * המרת מספר למילים בעברית (פשוט - עד 999,999)
 */
export function numberToWords(num: number): string {
  if (num === 0) return 'אפס';
  
  const ones = ['', 'אחד', 'שניים', 'שלושה', 'ארבעה', 'חמישה', 'שישה', 'שבעה', 'שמונה', 'תשעה'];
  const tens = ['', 'עשר', 'עשרים', 'שלושים', 'ארבעים', 'חמישים', 'שישים', 'שבעים', 'שמונים', 'תשעים'];
  const hundreds = ['', 'מאה', 'מאתיים', 'שלוש מאות', 'ארבע מאות', 'חמש מאות', 'שש מאות', 'שבע מאות', 'שמונה מאות', 'תשע מאות'];
  
  let result = '';
  
  // אלפים
  const thousands = Math.floor(num / 1000);
  if (thousands > 0) {
    result += ones[thousands] || '';
    if (thousands === 1) result = 'אלף';
    else if (thousands === 2) result = 'אלפיים';
    else result += ' אלף';
    num %= 1000;
    if (num > 0) result += ' ';
  }
  
  // מאות
  const hundredsDigit = Math.floor(num / 100);
  if (hundredsDigit > 0) {
    result += hundreds[hundredsDigit];
    num %= 100;
    if (num > 0) result += ' ';
  }
  
  // עשרות
  const tensDigit = Math.floor(num / 10);
  if (tensDigit > 0) {
    result += tens[tensDigit];
    num %= 10;
    if (num > 0) result += ' ו';
  }
  
  // יחידות
  if (num > 0) {
    result += ones[num];
  }
  
  return result;
}
