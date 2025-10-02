/**
 * טיפוסים לטופס צו קיום צוואה
 */

export interface Applicant {
  name: string;
  id: string;
  address: string;
  email: string;
  phone: string;
  relationshipToWill: 'executor' | 'beneficiary' | 'heir'; // מנהל עיזבון / זוכה / יורש
}

export interface Deceased {
  name: string;
  id: string;
  lastAddress: string;
  deathDate: string;
  deathPlace: string;
}

export interface Witness {
  name: string;
  id: string;
  address: string;
}

export interface Will {
  type: 'holographic' | 'witnessed' | 'authority'; // צוואה עצמית / בפני עדים / בפני רשות
  dateWritten: string;
  placeWritten: string;
  
  // עדים (לצוואה בפני עדים)
  witnesses: Witness[];
  
  // רשות (לצוואה בפני רשות)
  authority?: {
    type: 'attorney' | 'judge' | 'religious_court' | 'municipality';
    name: string;
    licenseNumber?: string;
    date: string;
  };
  
  location: string; // מקום שמירת הצוואה
}

export interface Beneficiary {
  name: string;
  id: string;
  address: string;
  shareDescription: string; // תיאור החלק
}

export interface ProbateOrderData {
  applicant: Applicant;
  deceased: Deceased;
  will: Will;
  beneficiaries: Beneficiary[];
  heirsNotInWill: Array<{
    name: string;
    id: string;
    relationship: string;
  }>;
}

export function getInitialData(): ProbateOrderData {
  return {
    applicant: {
      name: '',
      id: '',
      address: '',
      email: '',
      phone: '',
      relationshipToWill: 'executor',
    },
    deceased: {
      name: '',
      id: '',
      lastAddress: '',
      deathDate: '',
      deathPlace: '',
    },
    will: {
      type: 'holographic',
      dateWritten: '',
      placeWritten: '',
      witnesses: [],
      location: '',
    },
    beneficiaries: [],
    heirsNotInWill: [],
  };
}

