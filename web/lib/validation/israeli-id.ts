/**
 * אלגוריתם לוהן לאימות תעודת זהות ישראלית
 */
export function validateIsraeliID(id: string): boolean {
  if (!/^\d{9}$/.test(id)) {
    return false;
  }

  const digits = id.split('').map(Number);
  
  const sum = digits.reduce((acc, digit, index) => {
    const step = digit * ((index % 2) + 1);
    return acc + (step > 9 ? step - 9 : step);
  }, 0);

  return sum % 10 === 0;
}

/**
 * פורמט תעודת זהות עם מקפים
 */
export function formatIsraeliID(id: string): string {
  if (id.length !== 9) return id;
  return `${id.slice(0, 3)}-${id.slice(3, 6)}-${id.slice(6)}`;
}

