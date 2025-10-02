/**
 * טיפוסים לטופס צו ירושה
 */

export interface Applicant {
  name: string;
  id: string;
  address: string;
  email: string;
  phone: string;
  relationship: string;
}

export interface Deceased {
  name: string;
  id: string;
  lastAddress: string;
  deathDate: string;
  deathPlace: string;
  maritalStatus: 'רווק' | 'נשוי' | 'אלמן' | 'גרוש';
}

export interface FamilyMember {
  name: string;
  id: string;
  address?: string;
}

export interface InheritanceOrderData {
  // שלב 1: פרטי המבקש
  applicant: Applicant;
  
  // שלב 2: פרטי המנוח
  deceased: Deceased;
  
  // שלב 3: משפחה ויורשים
  hasSpouse: boolean;
  spouse?: FamilyMember;
  
  childrenCount: number;
  children: FamilyMember[];
  
  hasFather: boolean;
  father?: FamilyMember;
  
  hasMother: boolean;
  mother?: FamilyMember;
  
  siblingsCount: number;
  siblings: FamilyMember[];
}

/**
 * נתונים התחלתיים ריקים
 */
export function getInitialData(): InheritanceOrderData {
  return {
    applicant: {
      name: '',
      id: '',
      address: '',
      email: '',
      phone: '',
      relationship: '',
    },
    deceased: {
      name: '',
      id: '',
      lastAddress: '',
      deathDate: '',
      deathPlace: '',
      maritalStatus: 'נשוי',
    },
    hasSpouse: false,
    childrenCount: 0,
    children: [],
    hasFather: false,
    hasMother: false,
    siblingsCount: 0,
    siblings: [],
  };
}

