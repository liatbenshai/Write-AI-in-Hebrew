/**
 * ולידציה לאימייל
 */

/**
 * בדיקת אימייל תקין
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * בדיקת דומיין נפוץ ישראלי
 */
export function isIsraeliDomain(email: string): boolean {
  const israeliDomains = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
    'walla.co.il', 'nana.co.il', 'netvision.net.il', '012.net.il',
    'bezeqint.net', 'zahav.net.il'
  ];
  
  const domain = email.split('@')[1]?.toLowerCase();
  return israeliDomains.includes(domain || '');
}

/**
 * הצעות לתיקון אימייל
 */
export function suggestEmailCorrections(email: string): string[] {
  const suggestions: string[] = [];
  
  if (!email.includes('@')) {
    suggestions.push(`${email}@gmail.com`);
    suggestions.push(`${email}@walla.co.il`);
    return suggestions;
  }
  
  const [localPart, domain] = email.split('@');
  
  // תיקון דומיינים נפוצים
  const domainCorrections: { [key: string]: string } = {
    'gmai.com': 'gmail.com',
    'gmaill.com': 'gmail.com',
    'gmial.com': 'gmail.com',
    'yaho.com': 'yahoo.com',
    'yhoo.com': 'yahoo.com',
    'hotmial.com': 'hotmail.com',
    'wall.co.il': 'walla.co.il',
    'nana.co': 'nana.co.il'
  };
  
  const correctedDomain = domainCorrections[domain?.toLowerCase() || ''];
  if (correctedDomain) {
    suggestions.push(`${localPart}@${correctedDomain}`);
  }
  
  return suggestions;
}
