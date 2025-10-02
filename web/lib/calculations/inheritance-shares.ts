/**
 * חישוב חלקי יורשים על פי חוק הירושה התשכ"ה-1965
 */

export interface Heir {
  name: string;
  relationship: string;
  share: number;
}

export interface ShareCalculation {
  heirs: Heir[];
  explanations: string[];
}

/**
 * חישוב חלקים - פונקציה מרכזית
 */
export function calculateInheritanceShares(
  hasSpouse: boolean,
  childrenCount: number,
  hasFather: boolean,
  hasMother: boolean,
  siblingsCount: number = 0
): ShareCalculation {
  const heirs: Heir[] = [];
  const explanations: string[] = [];

  // מצב 1: בן זוג + ילדים (סעיף 10)
  if (hasSpouse && childrenCount > 0) {
    explanations.push('📜 סעיף 10 לחוק הירושה: בן זוג + ילדים');
    explanations.push('בן הזוג יורש 50% מהעיזבון');
    explanations.push(`הילדים יורשים 50% בחלקים שווים (${(50 / childrenCount).toFixed(2)}% כל אחד)`);

    heirs.push({
      name: 'בן/בת זוג',
      relationship: 'בן/בת זוג',
      share: 50,
    });

    const childShare = 50 / childrenCount;
    for (let i = 1; i <= childrenCount; i++) {
      heirs.push({
        name: `ילד/ה ${i}`,
        relationship: 'בן/בת',
        share: parseFloat(childShare.toFixed(2)),
      });
    }

    return { heirs, explanations };
  }

  // מצב 2: בן זוג + הורים (סעיף 11)
  if (hasSpouse && (hasFather || hasMother)) {
    const parentCount = (hasFather ? 1 : 0) + (hasMother ? 1 : 0);
    const parentShare = 33.33 / parentCount;

    explanations.push('📜 סעיף 11 לחוק הירושה: בן זוג + הורים (ללא ילדים)');
    explanations.push('בן הזוג יורש 2/3 (66.67%) מהעיזבון');
    explanations.push(`ההורים יורשים 1/3 (33.33%) בחלקים שווים`);

    heirs.push({
      name: 'בן/בת זוג',
      relationship: 'בן/בת זוג',
      share: 66.67,
    });

    if (hasFather) {
      heirs.push({
        name: 'אב',
        relationship: 'אב',
        share: parseFloat(parentShare.toFixed(2)),
      });
    }

    if (hasMother) {
      heirs.push({
        name: 'אם',
        relationship: 'אם',
        share: parseFloat(parentShare.toFixed(2)),
      });
    }

    return { heirs, explanations };
  }

  // מצב 3: רק בן זוג
  if (hasSpouse) {
    explanations.push('📜 סעיף 11 לחוק הירושה: רק בן זוג');
    explanations.push('בן הזוג יורש את כל העיזבון (100%)');

    heirs.push({
      name: 'בן/בת זוג',
      relationship: 'בן/בת זוג',
      share: 100,
    });

    return { heirs, explanations };
  }

  // מצב 4: רק ילדים
  if (childrenCount > 0) {
    const childShare = 100 / childrenCount;

    explanations.push('📜 סעיף 10 לחוק הירושה: רק ילדים (ללא בן זוג)');
    explanations.push(`הילדים יורשים את כל העיזבון בחלקים שווים (${childShare.toFixed(2)}% כל אחד)`);

    for (let i = 1; i <= childrenCount; i++) {
      heirs.push({
        name: `ילד/ה ${i}`,
        relationship: 'בן/בת',
        share: parseFloat(childShare.toFixed(2)),
      });
    }

    return { heirs, explanations };
  }

  // מצב 5: רק הורים (סעיף 12)
  if (hasFather || hasMother) {
    const parentCount = (hasFather ? 1 : 0) + (hasMother ? 1 : 0);
    const parentShare = 100 / parentCount;

    explanations.push('📜 סעיף 12 לחוק הירושה: רק הורים');
    explanations.push(`ההורים יורשים את כל העיזבון בחלקים שווים (${parentShare}% כל אחד)`);

    if (hasFather) {
      heirs.push({
        name: 'אב',
        relationship: 'אב',
        share: parentShare,
      });
    }

    if (hasMother) {
      heirs.push({
        name: 'אם',
        relationship: 'אם',
        share: parentShare,
      });
    }

    return { heirs, explanations };
  }

  // מצב 6: רק אחים (סעיף 13)
  if (siblingsCount > 0) {
    const siblingShare = 100 / siblingsCount;

    explanations.push('📜 סעיף 13 לחוק הירושה: רק אחים');
    explanations.push(`האחים יורשים את כל העיזבון בחלקים שווים (${siblingShare.toFixed(2)}% כל אחד)`);

    for (let i = 1; i <= siblingsCount; i++) {
      heirs.push({
        name: `אח/אחות ${i}`,
        relationship: 'אח/אחות',
        share: parseFloat(siblingShare.toFixed(2)),
      });
    }

    return { heirs, explanations };
  }

  // אין יורשים - המדינה (סעיף 14)
  explanations.push('📜 סעיף 14 לחוק הירושה: אין יורשים');
  explanations.push('המדינה יורשת את כל העיזבון');

  heirs.push({
    name: 'מדינת ישראל',
    relationship: 'המדינה',
    share: 100,
  });

  return { heirs, explanations };
}

/**
 * בדיקה אם סכום החלקים תקין (100%)
 */
export function validateSharesTotal(shares: number[]): {
  isValid: boolean;
  total: number;
  message: string;
} {
  const total = shares.reduce((sum, share) => sum + share, 0);
  const isValid = Math.abs(total - 100) < 0.01;

  return {
    isValid,
    total: parseFloat(total.toFixed(2)),
    message: isValid
      ? 'החלוקה תקינה ✓'
      : `⚠️ סכום החלקים הוא ${total.toFixed(2)}% ולא 100%`,
  };
}

