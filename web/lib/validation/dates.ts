/**
 * ולידציה לתאריכים
 */

/**
 * בדיקה אם תאריך הגיוני (לא בעתיד אם זה תאריך פטירה)
 */
export function validateDate(date: string, type: 'birth' | 'death' | 'will' | 'general' = 'general'): boolean {
  if (!date) return false;
  
  const inputDate = new Date(date);
  const today = new Date();
  
  // בדיקה אם התאריך תקין
  if (isNaN(inputDate.getTime())) {
    return false;
  }
  
  // בדיקות ספציפיות לפי סוג
  switch (type) {
    case 'birth':
      // תאריך לידה לא יכול להיות בעתיד
      return inputDate <= today;
      
    case 'death':
      // תאריך פטירה לא יכול להיות בעתיד
      return inputDate <= today;
      
    case 'will':
      // תאריך צוואה יכול להיות בעתיד (עבור תאריכים עתידיים)
      return true;
      
    case 'general':
    default:
      // תאריך כללי - רק בדיקה שהתאריך תקין
      return true;
  }
}

/**
 * בדיקה אם תאריך לידה הגיוני (לא צעיר מדי או זקן מדי)
 */
export function validateBirthDate(date: string): { isValid: boolean; error?: string } {
  if (!validateDate(date, 'birth')) {
    return { isValid: false, error: 'תאריך לידה לא תקין' };
  }
  
  const birthDate = new Date(date);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  
  if (age < 0) {
    return { isValid: false, error: 'תאריך לידה לא יכול להיות בעתיד' };
  }
  
  if (age > 120) {
    return { isValid: false, error: 'תאריך לידה לא הגיוני (מעל 120 שנה)' };
  }
  
  return { isValid: true };
}

/**
 * בדיקה אם תאריך פטירה הגיוני
 */
export function validateDeathDate(date: string): { isValid: boolean; error?: string } {
  if (!validateDate(date, 'death')) {
    return { isValid: false, error: 'תאריך פטירה לא תקין' };
  }
  
  const deathDate = new Date(date);
  const today = new Date();
  
  if (deathDate > today) {
    return { isValid: false, error: 'תאריך פטירה לא יכול להיות בעתיד' };
  }
  
  return { isValid: true };
}

/**
 * פורמט תאריך עברי
 */
export function formatHebrewDate(date: string): string {
  try {
    const inputDate = new Date(date);
    return inputDate.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return date;
  }
}

/**
 * חישוב גיל
 */
export function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}
