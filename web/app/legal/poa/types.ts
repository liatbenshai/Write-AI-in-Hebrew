/**
 * טיפוסים לטופס ייפוי כוח
 */

export interface Principal {
  name: string;
  id: string;
  address: string;
  phone?: string;
}

export interface Agent {
  name: string;
  id: string;
  address: string;
  phone?: string;
  isAttorney: boolean;
  licenseNumber?: string;
}

export interface PowerOfAttorneyData {
  principal: Principal;
  agent: Agent;
  
  type: 'general' | 'specific';
  
  // סמכויות
  powers: {
    realEstate: boolean;
    banking: boolean;
    maxBankingAmount?: number;
    tax: boolean;
    legal: boolean;
    inheritance: boolean;
    medical: boolean;
    other: string[];
  };
  
  // הגבלות
  restrictions: string[];
  
  // תוקף
  validity: {
    type: 'unlimited' | 'until_date';
    endDate?: string;
    irrevocable: boolean;
  };
  
  // מטרה (לייפוי כוח מיוחד)
  purpose?: string;
}

export function getInitialData(): PowerOfAttorneyData {
  return {
    principal: {
      name: '',
      id: '',
      address: '',
      phone: '',
    },
    agent: {
      name: '',
      id: '',
      address: '',
      phone: '',
      isAttorney: false,
    },
    type: 'general',
    powers: {
      realEstate: false,
      banking: false,
      tax: false,
      legal: false,
      inheritance: false,
      medical: false,
      other: [],
    },
    restrictions: [],
    validity: {
      type: 'unlimited',
      irrevocable: false,
    },
  };
}

