'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './print-styles.css';
import { defaultIndividualWillData, defaultMutualWillData, type IndividualWillData, type MutualWillData, type WillType } from './types';
import { Button } from '../../../components/ui/Button';
import IndividualWillForm from './IndividualWillForm';
import IndividualWillPreview from './IndividualWillPreview';
import MutualWillForm from './MutualWillForm';
import MutualWillPreview from './MutualWillPreview';

export default function WillsModulePage() {
  const [willType, setWillType] = useState<WillType>('individual');
  const [individualData, setIndividualData] = useState<IndividualWillData>(defaultIndividualWillData());
  const [mutualData, setMutualData] = useState<MutualWillData>(defaultMutualWillData());

  useEffect(() => {
    const savedIndividual = localStorage.getItem('will-individual-draft');
    const savedMutual = localStorage.getItem('will-mutual-draft');
    
    if (savedIndividual) {
      try {
        setIndividualData(JSON.parse(savedIndividual));
      } catch (e) {
        console.error('Failed to load individual');
      }
    }
    
    if (savedMutual) {
      try {
        setMutualData(JSON.parse(savedMutual));
      } catch (e) {
        console.error('Failed to load mutual');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('will-individual-draft', JSON.stringify(individualData));
  }, [individualData]);

  useEffect(() => {
    localStorage.setItem('will-mutual-draft', JSON.stringify(mutualData));
  }, [mutualData]);

  const handleReset = () => {
    if (confirm('להתחיל מחדש? כל הנתונים יימחקו.')) {
      if (willType === 'individual') {
        localStorage.removeItem('will-individual-draft');
        setIndividualData(defaultIndividualWillData());
      } else {
        localStorage.removeItem('will-mutual-draft');
        setMutualData(defaultMutualWillData());
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportWord = async () => {
    try {
      const { exportIndividualWillToWord, exportMutualWillToWord } = await import('../../../lib/export/will-word-exporter');
      
      if (willType === 'individual') {
        await exportIndividualWillToWord(individualData);
      } else {
        await exportMutualWillToWord(mutualData);
      }
    } catch (e) {
      console.error(e);
      alert('שגיאה בייצוא Word. נסי שוב או השתמשי בהדפסה ל-PDF.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📜 צוואות</h1>
            <p className="text-sm text-gray-600 mt-1">יצירה ועריכה של צוואת יחיד או צוואה הדדית</p>
          </div>
          <Link href="/" className="text-blue-600 hover:text-blue-700 hover:underline">
            ← חזרה
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* בחירת סוג צוואה */}
        <div className="mb-6 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">בחר/י סוג צוואה</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { 
                value: 'individual', 
                title: 'צוואת יחיד', 
                desc: 'צוואה של אדם אחד (גבר או אישה)',
                icon: '👤'
              },
                { 
                  value: 'mutual', 
                  title: 'צוואה הדדית', 
                  desc: 'צוואה משותפת של בני זוג נשואים',
                  icon: '👥',
                  disabled: false
                },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => !option.disabled && setWillType(option.value as WillType)}
                disabled={option.disabled}
                className={`
                  p-6 border-2 rounded-lg text-right
                  ${option.disabled 
                    ? 'opacity-50 cursor-not-allowed bg-gray-100' 
                    : willType === option.value
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }
                `}
              >
                <div className="text-4xl mb-2">{option.icon}</div>
                <h4 className="font-bold text-lg mb-1">{option.title}</h4>
                <p className="text-sm text-gray-600">{option.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* טופס ותצוגה */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* עמודה שמאל - טופס */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">מילוי פרטים</h2>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  מחדש
                </Button>
              </div>
              
              {willType === 'individual' ? (
                <IndividualWillForm data={individualData} onChange={setIndividualData} />
              ) : (
                <MutualWillForm data={mutualData} onChange={setMutualData} />
              )}
            </div>

            {/* כפתורי הורדה */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold mb-4">ייצוא מסמך</h3>
              <div className="space-y-3">
                <Button 
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={handleExportWord}
                >
                  📄 הורד Word
                </Button>
                <Button 
                  variant="primary" 
                  size="lg"
                  className="w-full"
                  onClick={handlePrint}
                >
                  🖨️ הדפס / PDF
                </Button>
                <p className="text-xs text-gray-600 text-center">
                  💡 מומלץ: "הדפס/PDF" שומר RTL מושלם!<br/>
                  Word - טוב, PDF - מעולה! ✨
                </p>
              </div>
              <p className="text-xs text-green-600 mt-4 text-center font-medium">
                ✓ נשמר אוטומטית
              </p>
            </div>
          </div>

          {/* עמודה ימין - תצוגה מקדימה */}
          <div>
            <div className="sticky top-6">
              <div className="bg-gray-100 rounded-xl shadow-md p-4">
                <h2 className="text-xl font-bold mb-4 text-center">תצוגה מקדימה</h2>
                <div className="bg-white rounded-lg max-h-[800px] overflow-y-auto" id="will-preview">
                  {willType === 'individual' ? (
                    <IndividualWillPreview data={individualData} />
                  ) : (
                    <MutualWillPreview data={mutualData} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


