'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getInitialData, AttorneyFeeData, calculateRecommendedFee, numberToWords } from './types';
import { Input } from '../../../components/ui/Input';
import { IsraeliIDInput } from '../../../components/forms/IsraeliIDInput';
import { Button } from '../../../components/ui/Button';
import ProgressBar from '../../../components/ui/ProgressBar';
import { useMultiStep } from '../../../hooks/useMultiStep';
import { loadLawyerProfile } from '../../../lib/storage/profile';

export default function AttorneyFeePage() {
  const [data, setData] = useState<AttorneyFeeData>(getInitialData());
  const [estateValue, setEstateValue] = useState<number>(0);
  const [autoSaved, setAutoSaved] = useState(false);
  
  const steps = ['פרטי הצדדים', 'השירותים', 'שכר הטרחה', 'סיכום'];
  const { currentStep, isFirstStep, isLastStep, nextStep, prevStep, goToStep } = useMultiStep(steps.length);

  // Load saved draft
  useEffect(() => {
    const saved = localStorage.getItem('attorney-fee-draft');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load');
      }
    }
    
    // Load lawyer profile
    const profile = loadLawyerProfile();
    if (profile.name) {
      setData(prev => ({
        ...prev,
        attorney: {
          name: profile.name,
          licenseNumber: profile.licenseNumber,
          address: profile.officeAddress,
          phone: profile.phone,
          email: profile.email,
        }
      }));
    }
  }, []);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem('attorney-fee-draft', JSON.stringify(data));
      setAutoSaved(true);
      setTimeout(() => setAutoSaved(false), 2000);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [data]);

  // Save on change
  useEffect(() => {
    localStorage.setItem('attorney-fee-draft', JSON.stringify(data));
  }, [data]);

  const recommendedFee = estateValue > 0 ? calculateRecommendedFee(estateValue) : null;
  
  const handleReset = () => {
    if (confirm('להתחיל מחדש? כל הנתונים יימחקו.')) {
      localStorage.removeItem('attorney-fee-draft');
      setData(getInitialData());
      setEstateValue(0);
      goToStep(1);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem('attorney-fee-draft', JSON.stringify(data));
    alert('הטיוטה נשמרה בהצלחה! ✅');
  };

  // Validate current step
  const validateStep = (): boolean => {
    if (currentStep === 1) {
      if (!data.attorney.name || !data.attorney.licenseNumber) {
        alert('אנא מלא את כל השדות החובה של עורך הדין');
        return false;
      }
      if (!data.client.name || !data.client.id) {
        alert('אנא מלא את כל השדות החובה של הלקוח');
        return false;
      }
    }
    
    if (currentStep === 2) {
      if (data.services.length === 0 || !data.services[0].description) {
        alert('אנא תאר את השירותים המשפטיים');
        return false;
      }
    }
    
    if (currentStep === 3) {
      if (!data.fee.structure) {
        alert('אנא בחר סוג שכר טרחה');
        return false;
      }
    }
    
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      nextStep();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">💼 הסכם שכר טרחה</h1>
              <p className="text-gray-600 mt-1">צור הסכם מקצועי עם חישוב אוטומטי</p>
            </div>
            <div className="flex items-center gap-3">
              {autoSaved && (
                <span className="text-green-600 text-sm flex items-center">
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  נשמר אוטומטית
                </span>
              )}
              <Link 
                href="/"
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>חזרה לדף הבית</span>
              </Link>
            </div>
          </div>
          
          {/* Progress Bar */}
          <ProgressBar 
            currentStep={currentStep} 
            totalSteps={steps.length} 
            steps={steps}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          
          {/* Step 1: פרטי הצדדים */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center ml-3">1</span>
                  פרטי הצדדים
                </h2>
              </div>

              {/* עורך הדין */}
              <div className="border-2 border-blue-100 rounded-lg p-6 bg-blue-50/30">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  ⚖️ עורך הדין
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      שם מלא <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={data.attorney.name}
                      onChange={(e) => setData({ ...data, attorney: { ...data.attorney, name: e.target.value } })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="עו״ד פלוני אלמוני"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      מספר רישיון <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={data.attorney.licenseNumber}
                      onChange={(e) => setData({ ...data, attorney: { ...data.attorney, licenseNumber: e.target.value } })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="12345"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-2">
                      כתובת
                    </label>
                    <input
                      type="text"
                      value={data.attorney.address}
                      onChange={(e) => setData({ ...data, attorney: { ...data.attorney, address: e.target.value } })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="רחוב הרצל 1, תל אביב"
                    />
                  </div>
                </div>
              </div>

              {/* הלקוח */}
              <div className="border-2 border-green-100 rounded-lg p-6 bg-green-50/30">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  👤 הלקוח
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      שם מלא <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={data.client.name}
                      onChange={(e) => setData({ ...data, client: { ...data.client, name: e.target.value } })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="ישראל ישראלי"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      תעודת זהות <span className="text-red-500">*</span>
                    </label>
                    <IsraeliIDInput
                      required
                      value={data.client.id}
                      onChange={(e) => setData({ ...data, client: { ...data.client, id: e.target.value } })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-2">
                      כתובת
                    </label>
                    <input
                      type="text"
                      value={data.client.address}
                      onChange={(e) => setData({ ...data, client: { ...data.client, address: e.target.value } })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="רחוב ביאליק 5, רמת גן"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: השירותים */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center ml-3">2</span>
                  השירותים המשפטיים
                </h2>
              </div>

              <div className="border-2 border-purple-100 rounded-lg p-6 bg-purple-50/30">
                <label className="block text-gray-700 font-medium mb-2">
                  תיאור השירותים <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={data.services[0]?.description || ''}
                  onChange={(e) => {
                    const newServices = [...data.services];
                    if (newServices.length === 0) newServices.push({ description: '', caseNumber: '', court: '' });
                    newServices[0].description = e.target.value;
                    setData({ ...data, services: newServices });
                  }}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="תאר את השירותים המשפטיים שיינתנו ללקוח..."
                />
                
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      מספר תיק (אופציונלי)
                    </label>
                    <input
                      type="text"
                      value={data.services[0]?.caseNumber || ''}
                      onChange={(e) => {
                        const newServices = [...data.services];
                        if (newServices.length === 0) newServices.push({ description: '', caseNumber: '', court: '' });
                        newServices[0].caseNumber = e.target.value;
                        setData({ ...data, services: newServices });
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="12345-01-20"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      בית משפט (אופציונלי)
                    </label>
                    <input
                      type="text"
                      value={data.services[0]?.court || ''}
                      onChange={(e) => {
                        const newServices = [...data.services];
                        if (newServices.length === 0) newServices.push({ description: '', caseNumber: '', court: '' });
                        newServices[0].court = e.target.value;
                        setData({ ...data, services: newServices });
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="בית המשפט המחוזי בתל אביב"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: שכר הטרחה */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center ml-3">3</span>
                  שכר הטרחה ותנאי התשלום
                </h2>
              </div>

              {/* Fee Type Selection */}
              <div>
                <label className="block text-gray-700 font-medium mb-3">
                  סוג שכר הטרחה <span className="text-red-500">*</span>
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setData({ ...data, feeStructure: { ...data.feeStructure, type: 'flat' } })}
                    className={`p-4 border-2 rounded-lg text-right transition-all ${
                      data.feeStructure.type === 'flat'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <div className="font-bold text-lg">💰 סכום קבוע</div>
                    <div className="text-sm text-gray-600 mt-1">תשלום חד פעמי</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setData({ ...data, feeStructure: { ...data.feeStructure, type: 'hourly' } })}
                    className={`p-4 border-2 rounded-lg text-right transition-all ${
                      data.feeStructure.type === 'hourly'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <div className="font-bold text-lg">⏱️ שעתי</div>
                    <div className="text-sm text-gray-600 mt-1">תשלום לפי שעות עבודה</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setData({ ...data, feeStructure: { ...data.feeStructure, type: 'percentage' } })}
                    className={`p-4 border-2 rounded-lg text-right transition-all ${
                      data.feeStructure.type === 'percentage'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <div className="font-bold text-lg">📊 אחוזים</div>
                    <div className="text-sm text-gray-600 mt-1">אחוז מהתוצאה</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setData({ ...data, feeStructure: { ...data.feeStructure, type: 'retainer_hourly' } })}
                    className={`p-4 border-2 rounded-lg text-right transition-all ${
                      data.feeStructure.type === 'retainer_hourly'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <div className="font-bold text-lg">💼 מקדמה + שעתי</div>
                    <div className="text-sm text-gray-600 mt-1">מקדמה ותשלום שעתי</div>
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              {data.feeStructure.type && (
                <div className="border-2 border-green-100 rounded-lg p-6 bg-green-50/30">
                  {data.feeStructure.type === 'flat' && (
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        סכום שכר הטרחה (₪) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={data.feeStructure.flatAmount || ''}
                        onChange={(e) => setData({ 
                          ...data, 
                          feeStructure: { ...data.feeStructure, flatAmount: Number(e.target.value) }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="10000"
                      />
                      {data.feeStructure.flatAmount && (
                        <p className="text-sm text-gray-600 mt-2">
                          בכתיב: {numberToWords(data.feeStructure.flatAmount)} שקלים חדשים
                        </p>
                      )}
                    </div>
                  )}
                  
                  {data.feeStructure.type === 'hourly' && (
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        תעריף שעתי (₪) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={data.feeStructure.hourlyRate || ''}
                        onChange={(e) => setData({ 
                          ...data, 
                          feeStructure: { ...data.feeStructure, hourlyRate: Number(e.target.value) }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="500"
                      />
                    </div>
                  )}
                  
                  {data.feeStructure.type === 'percentage' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          אחוז מהתוצאה (%) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={data.feeStructure.percentage || ''}
                          onChange={(e) => setData({ 
                            ...data, 
                            feeStructure: { ...data.feeStructure, percentage: Number(e.target.value) }
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          placeholder="10"
                        />
                      </div>
                      
                      {/* Calculator for recommended fee */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-3">💡 מחשבון שכר טרחה מומלץ</h4>
                        <label className="block text-sm text-blue-800 mb-2">שווי העיזבון / התביעה (₪)</label>
                        <input
                          type="number"
                          value={estateValue || ''}
                          onChange={(e) => setEstateValue(Number(e.target.value))}
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg"
                          placeholder="1000000"
                        />
                        {recommendedFee && (
                          <div className="mt-3 text-sm text-blue-900">
                            <p className="font-semibold">שכר טרחה מומלץ לפי תקנות:</p>
                            <p className="text-lg font-bold text-blue-600 mt-1">
                              ₪{recommendedFee.toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Payment Terms */}
              <div>
                <label className="block text-gray-700 font-medium mb-3">
                  תנאי התשלום
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {['upfront', 'completion', 'installments', 'monthly'].map((term) => (
                    <label key={term} className="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                      <input
                        type="radio"
                        name="paymentSchedule"
                        value={term}
                        checked={data.paymentSchedule === term}
                        onChange={(e) => setData({ ...data, paymentSchedule: e.target.value as any })}
                        className="ml-3"
                      />
                      <span className="font-medium">
                        {term === 'upfront' && 'תשלום מראש'}
                        {term === 'completion' && 'תשלום בסיום'}
                        {term === 'installments' && 'תשלומים'}
                        {term === 'monthly' && 'תשלום חודשי'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: סיכום */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="bg-indigo-500 text-white rounded-full w-10 h-10 flex items-center justify-center ml-3">4</span>
                  סיכום והפקת מסמך
                </h2>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📋 סיכום ההסכם</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">עורך דין:</span>
                    <span className="font-semibold">{data.attorney.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">לקוח:</span>
                    <span className="font-semibold">{data.client.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">סוג שכר טרחה:</span>
                    <span className="font-semibold">
                      {data.feeStructure.type === 'flat' && 'סכום קבוע'}
                      {data.feeStructure.type === 'hourly' && 'שעתי'}
                      {data.feeStructure.type === 'percentage' && 'אחוזים'}
                      {data.feeStructure.type === 'retainer_hourly' && 'מקדמה + שעתי'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">סכום:</span>
                    <span className="font-semibold text-lg text-blue-600">
                      {data.feeStructure.flatAmount && `₪${data.feeStructure.flatAmount.toLocaleString()}`}
                      {data.feeStructure.hourlyRate && `₪${data.feeStructure.hourlyRate}/שעה`}
                      {data.feeStructure.percentage && `${data.feeStructure.percentage}%`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Export Buttons */}
              <div className="grid md:grid-cols-2 gap-4">
                <button className="flex items-center justify-center px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl font-bold">
                  <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  ייצוא ל-PDF
                </button>
                
                <button className="flex items-center justify-center px-6 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl font-bold">
                  <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  ייצוא ל-Word
                </button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 border-t border-gray-200 mt-8">
            <div className="flex gap-3">
              {!isFirstStep && (
                <button
                  onClick={prevStep}
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  ← הקודם
                </button>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleSaveDraft}
                className="px-6 py-3 bg-yellow-100 text-yellow-800 font-medium rounded-lg hover:bg-yellow-200 transition-colors flex items-center"
              >
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                שמור טיוטה
              </button>
              
              {!isLastStep ? (
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  הבא →
                </button>
              ) : (
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
                >
                  התחל מחדש
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-2 flex items-center">
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            💡 טיפ חשוב
          </h3>
          <p className="text-blue-800 text-sm">
            המערכת שומרת את הנתונים אוטומטית כל 30 שניות. אם הפרופיל שלך מלא, הפרטים שלך יוטענו אוטומטית!
          </p>
        </div>
      </main>
    </div>
  );
}
