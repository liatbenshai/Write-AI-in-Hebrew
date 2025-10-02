'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getInitialData, GuardianshipData, Asset, FamilyMember } from './types';
import { Input } from '../../../components/ui/Input';
import { IsraeliIDInput } from '../../../components/forms/IsraeliIDInput';
import { Button } from '../../../components/ui/Button';

export default function GuardianshipPage() {
  const [data, setData] = useState<GuardianshipData>(getInitialData());

  useEffect(() => {
    const saved = localStorage.getItem('guardianship-draft');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('guardianship-draft', JSON.stringify(data));
  }, [data]);

  const totalAssets = data.assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalIncome = data.monthlyIncome.pension + data.monthlyIncome.socialSecurity + data.monthlyIncome.other;
  const totalExpenses = data.monthlyExpenses.housing + data.monthlyExpenses.food + data.monthlyExpenses.medical + data.monthlyExpenses.other;
  const monthlyBalance = totalIncome - totalExpenses;

  const addAsset = () => {
    setData({
      ...data,
      assets: [...data.assets, { id: crypto.randomUUID(), type: 'bank', description: '', value: 0 }]
    });
  };

  const addFamilyMember = () => {
    setData({
      ...data,
      familyMembers: [...data.familyMembers, { id: crypto.randomUUID(), name: '', relationship: '', age: 0, address: '', agreesToAppointment: null }]
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">בקשת אפוטרופסות</h1>
            <p className="text-sm text-gray-600 mt-1">בקשה למינוי אפוטרופוס</p>
          </div>
          <Link href="/" className="text-blue-600 hover:text-blue-700 hover:underline">
            ← חזרה
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow-md p-8 space-y-8">
          
          {/* פרטי החסוי */}
          <div className="border-2 border-blue-100 rounded-lg p-6 bg-blue-50/30">
            <h3 className="text-lg font-semibold mb-4">👤 החסוי</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="שם"
                required
                value={data.ward.name}
                onChange={(e) => setData({ ...data, ward: { ...data.ward, name: e.target.value } })}
              />
              <IsraeliIDInput
                label="תעודת זהות"
                required
                value={data.ward.id}
                onChange={(e) => setData({ ...data, ward: { ...data.ward, id: e.target.value } })}
              />
              <Input
                label="תאריך לידה"
                type="date"
                required
                value={data.ward.dateOfBirth}
                onChange={(e) => setData({ ...data, ward: { ...data.ward, dateOfBirth: e.target.value } })}
              />
            </div>
          </div>

          {/* פרטי המבקש */}
          <div className="border-2 border-green-100 rounded-lg p-6 bg-green-50/30">
            <h3 className="text-lg font-semibold mb-4">📝 המבקש</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="שם"
                required
                value={data.applicant.name}
                onChange={(e) => setData({ ...data, applicant: { ...data.applicant, name: e.target.value } })}
              />
              <IsraeliIDInput
                label="תעודת זהות"
                required
                value={data.applicant.id}
                onChange={(e) => setData({ ...data, applicant: { ...data.applicant, id: e.target.value } })}
              />
              <Input
                label="קרבה לחסוי"
                required
                value={data.applicant.relationshipToWard}
                onChange={(e) => setData({ ...data, applicant: { ...data.applicant, relationshipToWard: e.target.value } })}
                placeholder="בן, בת, אח, אחות"
              />
            </div>
          </div>

          {/* נכסים */}
          <div className="border-2 border-purple-100 rounded-lg p-6 bg-purple-50/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">💰 נכסי החסוי</h3>
              <Button size="sm" onClick={addAsset}>+ הוסף נכס</Button>
            </div>
            
            {data.assets.map((asset, i) => (
              <div key={asset.id} className="bg-white rounded p-4 mb-3 border">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-sm">נכס {i + 1}</span>
                  <button
                    onClick={() => setData({ ...data, assets: data.assets.filter(a => a.id !== asset.id) })}
                    className="text-red-600 text-sm"
                  >
                    ✕ הסר
                  </button>
                </div>
                <div className="grid md:grid-cols-3 gap-3">
                  <select
                    value={asset.type}
                    onChange={(e) => {
                      const newAssets = [...data.assets];
                      newAssets[i] = { ...newAssets[i], type: e.target.value as any };
                      setData({ ...data, assets: newAssets });
                    }}
                    className="px-3 py-2 border rounded"
                  >
                    <option value="real_estate">🏠 נדל״ן</option>
                    <option value="bank">💰 חשבון בנק</option>
                    <option value="investment">📈 השקעה</option>
                    <option value="pension">💳 פנסיה</option>
                    <option value="other">📦 אחר</option>
                  </select>
                  <Input
                    value={asset.description}
                    onChange={(e) => {
                      const newAssets = [...data.assets];
                      newAssets[i] = { ...newAssets[i], description: e.target.value };
                      setData({ ...data, assets: newAssets });
                    }}
                    placeholder="תיאור"
                  />
                  <Input
                    type="number"
                    value={asset.value || ''}
                    onChange={(e) => {
                      const newAssets = [...data.assets];
                      newAssets[i] = { ...newAssets[i], value: parseFloat(e.target.value) || 0 };
                      setData({ ...data, assets: newAssets });
                    }}
                    placeholder="ערך (₪)"
                  />
                </div>
              </div>
            ))}
            
            <div className="mt-4 p-4 bg-purple-100 rounded font-bold text-center">
              סה״כ נכסים: {totalAssets.toLocaleString('he-IL')} ₪
            </div>
          </div>

          {/* הכנסות והוצאות */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-2 border-green-100 rounded-lg p-6 bg-green-50/30">
              <h3 className="text-lg font-semibold mb-4">📈 הכנסות חודשיות</h3>
              <div className="space-y-3">
                <Input
                  label="פנסיה"
                  type="number"
                  value={data.monthlyIncome.pension || ''}
                  onChange={(e) => setData({ ...data, monthlyIncome: { ...data.monthlyIncome, pension: parseFloat(e.target.value) || 0 } })}
                  placeholder="0"
                />
                <Input
                  label="ביטוח לאומי"
                  type="number"
                  value={data.monthlyIncome.socialSecurity || ''}
                  onChange={(e) => setData({ ...data, monthlyIncome: { ...data.monthlyIncome, socialSecurity: parseFloat(e.target.value) || 0 } })}
                  placeholder="0"
                />
                <Input
                  label="אחר"
                  type="number"
                  value={data.monthlyIncome.other || ''}
                  onChange={(e) => setData({ ...data, monthlyIncome: { ...data.monthlyIncome, other: parseFloat(e.target.value) || 0 } })}
                  placeholder="0"
                />
                <div className="pt-2 border-t font-semibold">
                  סה״כ: {totalIncome.toLocaleString('he-IL')} ₪
                </div>
              </div>
            </div>

            <div className="border-2 border-red-100 rounded-lg p-6 bg-red-50/30">
              <h3 className="text-lg font-semibold mb-4">📉 הוצאות חודשיות</h3>
              <div className="space-y-3">
                <Input
                  label="דיור"
                  type="number"
                  value={data.monthlyExpenses.housing || ''}
                  onChange={(e) => setData({ ...data, monthlyExpenses: { ...data.monthlyExpenses, housing: parseFloat(e.target.value) || 0 } })}
                  placeholder="0"
                />
                <Input
                  label="מזון"
                  type="number"
                  value={data.monthlyExpenses.food || ''}
                  onChange={(e) => setData({ ...data, monthlyExpenses: { ...data.monthlyExpenses, food: parseFloat(e.target.value) || 0 } })}
                  placeholder="0"
                />
                <Input
                  label="טיפול רפואי"
                  type="number"
                  value={data.monthlyExpenses.medical || ''}
                  onChange={(e) => setData({ ...data, monthlyExpenses: { ...data.monthlyExpenses, medical: parseFloat(e.target.value) || 0 } })}
                  placeholder="0"
                />
                <Input
                  label="אחר"
                  type="number"
                  value={data.monthlyExpenses.other || ''}
                  onChange={(e) => setData({ ...data, monthlyExpenses: { ...data.monthlyExpenses, other: parseFloat(e.target.value) || 0 } })}
                  placeholder="0"
                />
                <div className="pt-2 border-t font-semibold">
                  סה״כ: {totalExpenses.toLocaleString('he-IL')} ₪
                </div>
              </div>
            </div>
          </div>

          {/* איזון */}
          <div className={`p-4 rounded-lg text-center font-bold ${monthlyBalance >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            איזון חודשי: {monthlyBalance >= 0 ? '+' : ''}{monthlyBalance.toLocaleString('he-IL')} ₪
          </div>

          {/* בני משפחה */}
          <div className="border-2 border-orange-100 rounded-lg p-6 bg-orange-50/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">👨‍👩‍👧‍👦 בני משפחה</h3>
              <Button size="sm" onClick={addFamilyMember}>+ הוסף</Button>
            </div>
            
            {data.familyMembers.length === 0 ? (
              <p className="text-gray-500 text-sm">לא הוספו בני משפחה</p>
            ) : (
              <div className="space-y-3">
                {data.familyMembers.map((member, i) => (
                  <div key={member.id} className="bg-white rounded p-4 border">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-sm">בן משפחה {i + 1}</span>
                      <button
                        onClick={() => setData({ ...data, familyMembers: data.familyMembers.filter(m => m.id !== member.id) })}
                        className="text-red-600 text-sm"
                      >
                        ✕ הסר
                      </button>
                    </div>
                    <div className="grid md:grid-cols-4 gap-3">
                      <Input
                        value={member.name}
                        onChange={(e) => {
                          const newMembers = [...data.familyMembers];
                          newMembers[i] = { ...newMembers[i], name: e.target.value };
                          setData({ ...data, familyMembers: newMembers });
                        }}
                        placeholder="שם"
                      />
                      <Input
                        value={member.relationship}
                        onChange={(e) => {
                          const newMembers = [...data.familyMembers];
                          newMembers[i] = { ...newMembers[i], relationship: e.target.value };
                          setData({ ...data, familyMembers: newMembers });
                        }}
                        placeholder="בן, בת, אח"
                      />
                      <Input
                        type="number"
                        value={member.age || ''}
                        onChange={(e) => {
                          const newMembers = [...data.familyMembers];
                          newMembers[i] = { ...newMembers[i], age: parseInt(e.target.value) || 0 };
                          setData({ ...data, familyMembers: newMembers });
                        }}
                        placeholder="גיל"
                      />
                      <label className="flex items-center justify-center gap-2 border rounded px-3 py-2">
                        <input
                          type="checkbox"
                          checked={member.agreesToAppointment === true}
                          onChange={(e) => {
                            const newMembers = [...data.familyMembers];
                            newMembers[i] = { ...newMembers[i], agreesToAppointment: e.target.checked };
                            setData({ ...data, familyMembers: newMembers });
                          }}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">מסכים</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* סמכויות */}
          <div className="border-2 border-indigo-100 rounded-lg p-6 bg-indigo-50/30">
            <h3 className="text-lg font-semibold mb-4">🛡️ סמכויות מבוקשות</h3>
            <div className="space-y-3">
              {[
                { key: 'manageProperty', label: 'ניהול רכוש', desc: 'אפוטרופוס על הרכוש' },
                { key: 'healthDecisions', label: 'החלטות רפואיות', desc: 'אפוטרופוס על הגוף' },
                { key: 'legalRepresentation', label: 'ייצוג משפטי', desc: 'ייצוג בהליכים' },
                { key: 'residenceDecisions', label: 'מקום מגורים', desc: 'החלטה על מקום מגורים' },
              ].map((power) => (
                <label
                  key={power.key}
                  className="flex items-start gap-3 p-3 border rounded hover:bg-white cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={data.requestedPowers[power.key as keyof typeof data.requestedPowers] as boolean}
                    onChange={(e) => setData({
                      ...data,
                      requestedPowers: { ...data.requestedPowers, [power.key]: e.target.checked }
                    })}
                    className="mt-1 w-5 h-5"
                  />
                  <div>
                    <div className="font-semibold">{power.label}</div>
                    <div className="text-xs text-gray-600">{power.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* כפתורי פעולה */}
          <div className="flex justify-between items-center pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => {
                if (confirm('להתחיל מחדש?')) {
                  localStorage.removeItem('guardianship-draft');
                  setData(getInitialData());
                }
              }}
            >
              מחדש
            </Button>
            <Button variant="primary" size="lg" onClick={() => alert('בקרוב: PDF')}>
              📄 הורד PDF
            </Button>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
            <p className="font-medium">✓ נשמר אוטומטית</p>
          </div>
        </div>
      </main>
    </div>
  );
}

