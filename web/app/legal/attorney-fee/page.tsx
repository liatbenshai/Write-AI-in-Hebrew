'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getInitialData, AttorneyFeeData, calculateRecommendedFee, numberToWords } from './types';
import { Input } from '../../../components/ui/Input';
import { IsraeliIDInput } from '../../../components/forms/IsraeliIDInput';
import { Button } from '../../../components/ui/Button';

export default function AttorneyFeePage() {
  const [data, setData] = useState<AttorneyFeeData>(getInitialData());
  const [estateValue, setEstateValue] = useState<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem('attorney-fee-draft');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('attorney-fee-draft', JSON.stringify(data));
  }, [data]);

  const recommendedFee = estateValue > 0 ? calculateRecommendedFee(estateValue) : null;
  
  const handleReset = () => {
    if (confirm('להתחיל מחדש? כל הנתונים יימחקו.')) {
      localStorage.removeItem('attorney-fee-draft');
      setData(getInitialData());
      setEstateValue(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">הסכם שכר טרחה</h1>
            <p className="text-sm text-gray-600 mt-1">הסכם עם עורך דין</p>
          </div>
          <Link href="/" className="text-blue-600 hover:text-blue-700 hover:underline">
            ← חזרה
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow-md p-8 space-y-8">
          
          {/* עורך הדין */}
          <div className="border-2 border-blue-100 rounded-lg p-6 bg-blue-50/30">
            <h3 className="text-lg font-semibold mb-4">⚖️ עורך הדין</h3>
            <div className="space-y-4">
              <Input
                label="שם"
                required
                value={data.attorney.name}
                onChange={(e) => setData({ ...data, attorney: { ...data.attorney, name: e.target.value } })}
              />
              <Input
                label="מספר רישיון"
                required
                value={data.attorney.licenseNumber}
                onChange={(e) => setData({ ...data, attorney: { ...data.attorney, licenseNumber: e.target.value } })}
              />
            </div>
          </div>

          {/* הלקוח */}
          <div className="border-2 border-green-100 rounded-lg p-6 bg-green-50/30">
            <h3 className="text-lg font-semibold mb-4">👤 הלקוח</h3>
            <div className="space-y-4">
              <Input
                label="שם"
                required
                value={data.client.name}
                onChange={(e) => setData({ ...data, client: { ...data.client, name: e.target.value } })}
              />
              <IsraeliIDInput
                label="תעודת זהות"
                required
                value={data.client.id}
                onChange={(e) => setData({ ...data, client: { ...data.client, id: e.target.value } })}
              />
            </div>
          </div>

          {/* השירותים */}
          <div className="border-2 border-purple-100 rounded-lg p-6 bg-purple-50/30">
            <h3 className="text-lg font-semibold mb-4">📋 השירותים המשפטיים</h3>
            {data.services.map((service, idx) => (
              <div key={idx} className="space-y-4">
                <textarea
                  value={service.description}
                  onChange={(e) => {
                    const newServices = [...data.services];
                    newServices[idx].description = e.target.value;
                    setData({ ...data, services: newServices });
                  }}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="תיאור השירות המשפטי..."
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="מספר תיק (אופציונלי)"
                    value={service.caseNumber || ''}
                    onChange={(e) => {
                      const newServices = [...data.services];
                      newServices[idx].caseNumber = e.target.value;
                      setData({ ...data, services: newServices });
                    }}
                  />
                  <Input
                    label="בית משפט (אופציונלי)"
                    value={service.court || ''}
                    onChange={(e) => {
                      const newServices = [...data.services];
                      newServices[idx].court = e.target.value;
                      setData({ ...data, services: newServices });
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* שכר טרחה */}
          <div className="border-2 border-orange-100 rounded-lg p-6 bg-orange-50/30">
            <h3 className="text-lg font-semibold mb-4">💰 שכר הטרחה</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              {[
                { value: 'flat_fee', label: 'סכום קבוע', emoji: '💵' },
                { value: 'hourly_rate', label: 'שעתי', emoji: '⏰' },
                { value: 'contingency', label: 'אחוזים', emoji: '📊' },
                { value: 'retainer_plus', label: 'מעורב', emoji: '🔄' },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`
                    flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer
                    ${data.fee.structure === option.value
                      ? 'border-orange-600 bg-orange-50 font-medium'
                      : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="feeStructure"
                    value={option.value}
                    checked={data.fee.structure === option.value}
                    onChange={(e) => setData({ ...data, fee: { ...data.fee, structure: e.target.value as any } })}
                    className="sr-only"
                  />
                  <span className="text-xl mb-1">{option.emoji}</span>
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>

            {data.fee.structure === 'flat_fee' && (
              <div className="space-y-4">
                <Input
                  label="סכום (₪)"
                  type="number"
                  required
                  value={data.fee.flatAmount || ''}
                  onChange={(e) => {
                    const amount = parseInt(e.target.value);
                    setData({ 
                      ...data, 
                      fee: { 
                        ...data.fee, 
                        flatAmount: amount,
                        flatAmountInWords: numberToWords(amount) + ' שקלים חדשים'
                      } 
                    });
                  }}
                />
                {data.fee.flatAmount && data.fee.flatAmount > 0 && (
                  <p className="text-sm text-gray-600">
                    במילים: <span className="font-semibold">{data.fee.flatAmountInWords}</span>
                  </p>
                )}
              </div>
            )}

            {data.fee.structure === 'hourly_rate' && (
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="תעריף לשעה (₪)"
                  type="number"
                  required
                  value={data.fee.hourlyRate || ''}
                  onChange={(e) => setData({ ...data, fee: { ...data.fee, hourlyRate: parseInt(e.target.value) } })}
                />
                <Input
                  label="הערכת שעות (אופציונלי)"
                  type="number"
                  value={data.fee.estimatedHours || ''}
                  onChange={(e) => setData({ ...data, fee: { ...data.fee, estimatedHours: parseInt(e.target.value) } })}
                />
              </div>
            )}

            {data.fee.structure === 'contingency' && (
              <>
                <Input
                  label="ערך העיזבון/תביעה (₪)"
                  type="number"
                  value={estateValue || ''}
                  onChange={(e) => setEstateValue(parseInt(e.target.value) || 0)}
                  helpText="לחישוב מומלץ לפי תקנות"
                />
                <Input
                  label="אחוז שכר טרחה (%)"
                  type="number"
                  required
                  value={data.fee.percentage || ''}
                  onChange={(e) => setData({ ...data, fee: { ...data.fee, percentage: parseFloat(e.target.value) } })}
                />
                {recommendedFee && (
                  <div className="mt-4 bg-white rounded p-4 text-sm border border-orange-200">
                    <p className="font-semibold mb-2">💡 חישוב מומלץ לפי תקנות לשכת עורכי הדין:</p>
                    {recommendedFee.breakdown.map((item, i) => (
                      <div key={i} className="flex justify-between text-gray-700 mb-1">
                        <span>{item.range} ({item.percentage}%)</span>
                        <span>{item.amount.toLocaleString('he-IL')} ₪</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2 space-y-1">
                      <div className="flex justify-between">
                        <span>סכום משנה:</span>
                        <span>{recommendedFee.subtotal.toLocaleString('he-IL')} ₪</span>
                      </div>
                      <div className="flex justify-between">
                        <span>מע״מ (17%):</span>
                        <span>{recommendedFee.vat.toLocaleString('he-IL')} ₪</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg text-orange-700 border-t pt-1">
                        <span>סה״כ:</span>
                        <span>{recommendedFee.total.toLocaleString('he-IL')} ₪</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {data.fee.structure === 'retainer_plus' && (
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="מקדמה (₪)"
                  type="number"
                  required
                  value={data.fee.retainerAmount || ''}
                  onChange={(e) => setData({ ...data, fee: { ...data.fee, retainerAmount: parseInt(e.target.value) } })}
                />
                <Input
                  label="תעריף שעתי נוסף (₪)"
                  type="number"
                  value={data.fee.additionalHourlyRate || ''}
                  onChange={(e) => setData({ ...data, fee: { ...data.fee, additionalHourlyRate: parseInt(e.target.value) } })}
                />
              </div>
            )}

            <div className="mt-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={data.fee.includesVAT}
                  onChange={(e) => setData({ ...data, fee: { ...data.fee, includesVAT: e.target.checked } })}
                  className="rounded"
                />
                <span className="text-sm">הסכום כולל מע״מ</span>
              </label>
            </div>
          </div>

          {/* תשלום */}
          <div className="border-2 border-indigo-100 rounded-lg p-6 bg-indigo-50/30">
            <h3 className="text-lg font-semibold mb-4">💳 תנאי תשלום</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { value: 'upfront', label: 'מראש' },
                { value: 'installments', label: 'תשלומים' },
                { value: 'upon_completion', label: 'בסיום' },
                { value: 'monthly', label: 'חודשי' },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`
                    flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer text-sm
                    ${data.payment.schedule === option.value
                      ? 'border-indigo-600 bg-indigo-50 font-medium'
                      : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="paymentSchedule"
                    value={option.value}
                    checked={data.payment.schedule === option.value}
                    onChange={(e) => setData({ ...data, payment: { ...data.payment, schedule: e.target.value as any } })}
                    className="sr-only"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <Button variant="outline" onClick={handleReset}>
              מחדש
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" size="lg" onClick={() => alert('בקרוב: Word')}>
                📄 Word
              </Button>
              <Button variant="primary" size="lg" onClick={() => alert('בקרוב: PDF')}>
                📄 PDF
              </Button>
            </div>
          </div>

          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
            <p className="font-medium">✓ נשמר אוטומטית</p>
          </div>
        </div>
      </main>
    </div>
  );
}

