/**
 * ולידציה לטלפון ישראלי
 */

/**
 * בדיקת טלפון ישראלי (נייד או קווי)
 */
export function validateIsraeliPhone(phone: string): boolean {
  // הסרת רווחים, מקפים וסוגריים
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // בדיקה אם מתחיל ב-0
  if (!cleanPhone.startsWith('0')) {
    return false;
  }
  
  // פורמטים תקינים:
  // נייד: 050, 052, 053, 054, 055, 056, 057, 058, 059 - 10 ספרות
  // קווי: 02, 03, 04, 08, 09 - 9-10 ספרות
  
  const mobilePrefixes = ['050', '052', '053', '054', '055', '056', '057', '058', '059'];
  const landlinePrefixes = ['02', '03', '04', '08', '09'];
  
  // בדיקה לנייד
  if (mobilePrefixes.some(prefix => cleanPhone.startsWith(prefix))) {
    return cleanPhone.length === 10;
  }
  
  // בדיקה לקווי
  if (landlinePrefixes.some(prefix => cleanPhone.startsWith(prefix))) {
    return cleanPhone.length >= 9 && cleanPhone.length <= 10;
  }
  
  return false;
}

/**
 * פורמט טלפון ישראלי
 */
export function formatIsraeliPhone(phone: string): string {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  if (cleanPhone.length === 10) {
    // נייד: 050-123-4567
    return `${cleanPhone.slice(0, 3)}-${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`;
  } else if (cleanPhone.length === 9) {
    // קווי: 02-123-4567
    return `${cleanPhone.slice(0, 2)}-${cleanPhone.slice(2, 5)}-${cleanPhone.slice(5)}`;
  }
  
  return phone;
}

/**
 * קבלת סוג הטלפון
 */
export function getPhoneType(phone: string): 'mobile' | 'landline' | 'invalid' {
  if (!validateIsraeliPhone(phone)) {
    return 'invalid';
  }
  
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  const mobilePrefixes = ['050', '052', '053', '054', '055', '056', '057', '058', '059'];
  
  if (mobilePrefixes.some(prefix => cleanPhone.startsWith(prefix))) {
    return 'mobile';
  }
  
  return 'landline';
}
