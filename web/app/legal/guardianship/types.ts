/**
 * טיפוסים לבקשת מינוי אפוטרופוס
 */

export interface Ward {
  name: string;
  id: string;
  dateOfBirth: string;
  address: string;
  maritalStatus: 'single' | 'married' | 'widowed' | 'divorced';
}

export interface Applicant {
  name: string;
  id: string;
  dateOfBirth: string;
  address: string;
  phone: string;
  email: string;
  occupation: string;
  relationshipToWard: string;
}

export interface WardCondition {
  reasons: ('intellectual' | 'mental' | 'illness' | 'accident' | 'old_age' | 'other')[];
  description: string;
  isHospitalized: boolean;
  hospitalName?: string;
  hasMedicalTreatment: boolean;
  doctorName?: string;
  doctorPhone?: string;
}

export interface Asset {
  id: string;
  type: 'real_estate' | 'bank' | 'investment' | 'pension' | 'other';
  description: string;
  value: number;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age: number;
  address: string;
  agreesToAppointment: boolean | null;
}

export interface GuardianshipData {
  ward: Ward;
  applicant: Applicant;
  condition: WardCondition;
  
  // נכסים
  assets: Asset[];
  
  // הכנסות והוצאות חודשיות
  monthlyIncome: {
    pension: number;
    socialSecurity: number;
    other: number;
  };
  
  monthlyExpenses: {
    housing: number;
    food: number;
    medical: number;
    other: number;
  };
  
  // כישורים
  qualifications: {
    reasons: string;
    experienceYears?: number;
    financialExperience: string;
  };
  
  // רצון החסוי
  wardWishes: {
    canExpressOpinion: 'yes' | 'no' | 'partially';
    wasConsulted: boolean;
    agreesToAppointment?: boolean;
    reason?: string;
  };
  
  // בני משפחה
  familyMembers: FamilyMember[];
  
  // סמכויות מבוקשות
  requestedPowers: {
    manageProperty: boolean;
    healthDecisions: boolean;
    legalRepresentation: boolean;
    residenceDecisions: boolean;
    other: string[];
  };
}

export function getInitialData(): GuardianshipData {
  return {
    ward: {
      name: '',
      id: '',
      dateOfBirth: '',
      address: '',
      maritalStatus: 'single',
    },
    applicant: {
      name: '',
      id: '',
      dateOfBirth: '',
      address: '',
      phone: '',
      email: '',
      occupation: '',
      relationshipToWard: '',
    },
    condition: {
      reasons: [],
      description: '',
      isHospitalized: false,
      hasMedicalTreatment: false,
    },
    assets: [],
    monthlyIncome: {
      pension: 0,
      socialSecurity: 0,
      other: 0,
    },
    monthlyExpenses: {
      housing: 0,
      food: 0,
      medical: 0,
      other: 0,
    },
    qualifications: {
      reasons: '',
      financialExperience: '',
    },
    wardWishes: {
      canExpressOpinion: 'yes',
      wasConsulted: false,
    },
    familyMembers: [],
    requestedPowers: {
      manageProperty: true,
      healthDecisions: true,
      legalRepresentation: true,
      residenceDecisions: true,
      other: [],
    },
  };
}

