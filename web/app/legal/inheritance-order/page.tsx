'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getInitialData, InheritanceOrderData } from './types';
import { ApplicantForm } from './ApplicantForm';
import { DeceasedForm } from './DeceasedForm';
import { FamilyForm } from './FamilyFormNew';
import { SummaryView } from './SummaryView';

type Step = 1 | 2 | 3 | 4;

export default function InheritanceOrderPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [data, setData] = useState<InheritanceOrderData>(getInitialData());

  // שמירה אוטומטית ב-localStorage
  useEffect(() => {
    const saved = localStorage.getItem('inheritance-order-draft');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved data');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('inheritance-order-draft', JSON.stringify(data));
  }, [data]);

  const updateData = (updates: Partial<InheritanceOrderData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep((currentStep + 1) as Step);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((currentStep - 1) as Step);
  };

  const progress = (currentStep / 4) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">צו ירושה</h1>
            <p className="text-sm text-gray-600 mt-1">בקשה לצו ירושה</p>
          </div>
          <Link href="/" className="text-blue-600 hover:text-blue-700 hover:underline">
            ← חזרה
          </Link>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              שלב {currentStep} מתוך 4
            </span>
            <span className="text-sm text-gray-500">{progress.toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-3 text-xs">
            <span className={currentStep >= 1 ? 'text-blue-600 font-medium' : 'text-gray-400'}>
              פרטי המבקש
            </span>
            <span className={currentStep >= 2 ? 'text-blue-600 font-medium' : 'text-gray-400'}>
              פרטי המנוח
            </span>
            <span className={currentStep >= 3 ? 'text-blue-600 font-medium' : 'text-gray-400'}>
              משפחה ויורשים
            </span>
            <span className={currentStep >= 4 ? 'text-blue-600 font-medium' : 'text-gray-400'}>
              סיכום
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow-md p-8">
          {currentStep === 1 && (
            <ApplicantForm
              data={data.applicant}
              onUpdate={(applicant) => updateData({ applicant })}
              onNext={nextStep}
            />
          )}

          {currentStep === 2 && (
            <DeceasedForm
              data={data.deceased}
              onUpdate={(deceased) => updateData({ deceased })}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {currentStep === 3 && (
            <FamilyForm
              data={data}
              onUpdate={updateData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {currentStep === 4 && (
            <SummaryView
              data={data}
              onBack={prevStep}
              onEdit={(step) => setCurrentStep(step)}
            />
          )}
        </div>
      </main>
    </div>
  );
}

