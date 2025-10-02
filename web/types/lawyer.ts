/**
 * Lawyer Profile Types
 */

export interface LawyerProfile {
  // Basic Info
  name: string;
  licenseNumber: string;
  
  // Contact
  officeAddress: string;
  phone: string;
  email: string;
  
  // Branding
  logo?: string;  // base64 or URL
  stamp?: string; // base64 or URL
  
  // Additional
  specialty?: string;
  website?: string;
  
  // Metadata
  createdAt?: string;
  updatedAt?: string;
}

export const defaultLawyerProfile: LawyerProfile = {
  name: '',
  licenseNumber: '',
  officeAddress: '',
  phone: '',
  email: '',
};

