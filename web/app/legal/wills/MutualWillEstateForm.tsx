'use client';

import React from 'react';
import { Button } from '../../../components/ui/Button';

type Props = {
  assets: string[];
  onChange: (assets: string[]) => void;
};

export default function MutualWillEstateForm({ assets, onChange }: Props) {
  const addAsset = () => {
    onChange([...assets, '']);
  };

  const updateAsset = (index: number, value: string) => {
    const newAssets = [...assets];
    newAssets[index] = value;
    onChange(newAssets);
  };

  const removeAsset = (index: number) => {
    onChange(assets.filter((_, i) => i !== index));
  };

  const getAssetPlaceholder = (index: number): string => {
    const examples = [
      'זכויות בדירה הרשומה בטאבו ברחוב _____, בעיר _____, גוש: _____, חלקה: ___, תת חלקה: ____, וכן מטלטליה המחוברים חיבור של קבע ושאינם מחוברים חיבור של קבע.',
      'מגרש ב_____, כ- ___ מ"ר, הממוקם ב_____, הידוע כגוש: _____, חלקה: _____.',
      'חשבון הבנק המנוהל על שמנו ב_____ (מספר בנק ___), סניף מספר ___, חשבון מספר _____, לרבות יתרת הכספים בחשבון, פיקדונות חיסכון וכלל הזכויות הכספיות הנובעות מחשבון זה.',
      'כלל הכספים במזומן הנמצאים ברשותנו, לרבות שטרות כסף המוחזקים בביתנו, בכספת או בכל מקום אחר.',
      'כלל התכשיטים השייכים לנו למועד פטירתנו, לרבות תכשיטי זהב, כסף, פלטינה, יהלומים ואבנים יקרות, שעונים, צמידים, שרשראות, עגילים, טבעות וסיכות.',
      'רכב הרשום על שמנו במשרד הרישוי למועד פטירתנו, מסוג _____, מספר רישוי _____.',
    ];
    
    return examples[index % examples.length] || 'תיאור מפורט של הנכס...';
  };

  return (
    <div className="space-y-4">
      {assets.length > 0 ? (
        assets.map((asset, idx) => (
          <div key={idx} className="border-2 border-green-200 rounded-lg p-4 bg-green-50/50">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-green-900">
                נכס {idx + 1} (יופיע כפריט מס' {idx + 1} ברשימה)
              </label>
              <button
                onClick={() => removeAsset(idx)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                מחק
              </button>
            </div>
            
            <textarea
              value={asset}
              onChange={(e) => updateAsset(idx, e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder={getAssetPlaceholder(idx)}
            />
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm">לחץ על "הוסף נכס" להוספת נכסים</p>
      )}
      
      <Button variant="outline" size="sm" onClick={addAsset} className="w-full">
        + הוסף נכס
      </Button>
    </div>
  );
}

