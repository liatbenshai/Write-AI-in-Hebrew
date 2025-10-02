/**
 * טיפוסים לייפוי כוח לעורך דין
 */

export type AttorneyPOAType = 'general' | 'inheritance' | 'court_case';

export interface AttorneyPOAData {
  // הלקוח (נותן ייפוי הכוח)
  client: {
    name: string;
    id: string;
    address: string;
    phone?: string;
    email?: string;
  };
  
  // עורך הדין (מקבל ייפוי הכוח)
  attorney: {
    name: string;
    licenseNumber: string;
    address: string;
    phone: string;
    email: string;
  };
  
  type: AttorneyPOAType;
  
  // פרטים לפי סוג
  specificMatter?: {
    // לירושה
    inheritance?: {
      deceasedName: string;
      deceasedId: string;
      dateOfDeath: string;
    };
    
    // לתיק משפטי
    courtCase?: {
      caseNumber?: string;
      court?: string;
      subject?: string;
    };
  };
  
  // סמכויות
  powers: {
    representInCourt: boolean;
    signDocuments: boolean;
    fileApplications: boolean;
    signSettlements: boolean;
    settlementMaxAmount?: number;
    appointSubAttorneys: boolean;
  };
  
  // הגבלות
  restrictions: string[];
  
  // תוקף
  validity: {
    type: 'unlimited' | 'until_date' | 'until_completion';
    endDate?: string;
    irrevocable: boolean;
  };
}

export function getInitialData(): AttorneyPOAData {
  return {
    client: {
      name: '',
      id: '',
      address: '',
      phone: '',
      email: '',
    },
    attorney: {
      name: '',
      licenseNumber: '',
      address: '',
      phone: '',
      email: '',
    },
    type: 'general',
    powers: {
      representInCourt: true,
      signDocuments: true,
      fileApplications: true,
      signSettlements: true,
      appointSubAttorneys: false,
    },
    restrictions: [],
    validity: {
      type: 'unlimited',
      irrevocable: false,
    },
  };
}

