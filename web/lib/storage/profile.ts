import { LawyerProfile, defaultLawyerProfile } from '@/types/lawyer';

const PROFILE_KEY = 'lawyer-profile';

/**
 * Save lawyer profile to localStorage
 */
export function saveLawyerProfile(profile: LawyerProfile): void {
  if (typeof window === 'undefined') return;
  
  const profileWithTimestamp = {
    ...profile,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profileWithTimestamp));
}

/**
 * Load lawyer profile from localStorage
 */
export function loadLawyerProfile(): LawyerProfile {
  if (typeof window === 'undefined') return defaultLawyerProfile;
  
  const stored = localStorage.getItem(PROFILE_KEY);
  
  if (!stored) {
    return defaultLawyerProfile;
  }
  
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to parse lawyer profile:', error);
    return defaultLawyerProfile;
  }
}

/**
 * Check if profile is complete
 */
export function isProfileComplete(profile: LawyerProfile): boolean {
  return !!(
    profile.name &&
    profile.licenseNumber &&
    profile.officeAddress &&
    profile.phone &&
    profile.email
  );
}

/**
 * Clear lawyer profile
 */
export function clearLawyerProfile(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PROFILE_KEY);
}

