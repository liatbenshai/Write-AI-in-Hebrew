'use client';

import React, { useState } from 'react';
import type { IndividualWillData, Gender, Beneficiary, Asset, Clause } from './types';
import { Input } from '../../../components/ui/Input';
import { IsraeliIDInput, PhoneInput, EmailInput, DateInput } from '../../../components/forms';
import { Button } from '../../../components/ui/Button';

type Props = {
  data: IndividualWillData;
  onChange: (data: IndividualWillData) => void;
};

export default function IndividualWillForm({ data, onChange }: Props) {
  // מצב ולידציה
  const [validationState, setValidationState] = useState({
    testatorId: false,
    testatorPhone: false,
    testatorEmail: false,
    witness1Id: false,
    witness2Id: false,
    witness1Phone: false,
    witness2Phone: false,
  });
  const updateTestator = (field: keyof typeof data.testator, value: any) => {
    onChange({
      ...data,
      testator: { ...data.testator, [field]: value },
    });
  };

  const addBeneficiary = () => {
    onChange({
      ...data,
      beneficiaries: [...data.beneficiaries, { name: '', id: '', relationship: '', share: '' }],
    });
  };

  const updateBeneficiary = (index: number, field: keyof Beneficiary, value: string) => {
    const newBeneficiaries = [...data.beneficiaries];
    newBeneficiaries[index] = { ...newBeneficiaries[index], [field]: value };
    onChange({ ...data, beneficiaries: newBeneficiaries });
  };

  const removeBeneficiary = (index: number) => {
    onChange({
      ...data,
      beneficiaries: data.beneficiaries.filter((_, i) => i !== index),
    });
  };

  const addAsset = () => {
    onChange({
      ...data,
      estate: {
        ...data.estate,
        assets: [...data.estate.assets, { type: 'other', description: '' }],
      },
    });
  };

  const updateAsset = (index: number, field: keyof Asset, value: any) => {
    const newAssets = [...data.estate.assets];
    newAssets[index] = { ...newAssets[index], [field]: value };
    onChange({
      ...data,
      estate: { ...data.estate, assets: newAssets },
    });
  };

  const getAssetPlaceholder = (type: string): string => {
    switch (type) {
      case 'apartment':
        return 'זכויות בדירה הרשומה בטאבו ברחוב _____, בעיר _____, גוש: _____, חלקה: ___, תת חלקה: ____, וכן מטלטליה.';
      case 'land':
        return 'מגרש ב_____, כ- ___ מ"ר, הידוע כגוש: _____, חלקה: _____.';
      case 'bank':
        return 'חשבון בנק המנוהל על שמי ב_____ (מספר בנק ___), סניף מספר ___, חשבון מספר _____, לרבות יתרת הכספים, פיקדונות וכלל הזכויות הכספיות.';
      case 'cash':
        return 'כלל הכספים במזומן הנמצאים ברשותי, לרבות שטרות כסף המוחזקים בביתי, בכספת או בכל מקום אחר.';
      case 'jewelry':
        return 'כלל התכשיטים השייכים לי למועד פטירתי, לרבות תכשיטי זהב, כסף, פלטינה, יהלומים ואבנים יקרות, שעונים, צמידים, שרשראות, עגילים, טבעות וסיכות.';
      case 'vehicle':
        return 'רכב הרשום על שמי במשרד הרישוי למועד פטירתי, מסוג _____, מספר רישוי _____.';
      case 'stocks':
        return 'ניירות ערך, מניות, אג"ח, קרנות נאמנות וכל נכס פיננסי אחר המוחזק על שמי.';
      default:
        return 'תיאור מפורט של הנכס...';
    }
  };

  const removeAsset = (index: number) => {
    onChange({
      ...data,
      estate: {
        ...data.estate,
        assets: data.estate.assets.filter((_, i) => i !== index),
      },
    });
  };

  const updateStandardClause = (key: keyof typeof data.standardClauses, text: string) => {
    onChange({
      ...data,
      standardClauses: {
        ...data.standardClauses,
        [key]: { ...data.standardClauses[key], text },
      },
    });
  };

  const addAdditionalClause = () => {
    const nextNumber = 5 + data.additionalClauses.length + 1; // אחרי חלוקה (סעיף 5)
    onChange({
      ...data,
      additionalClauses: [
        ...data.additionalClauses,
        { number: nextNumber, text: '', editable: true, subItems: [] },
      ],
    });
  };

  const updateAdditionalClause = (index: number, text: string) => {
    const newClauses = [...data.additionalClauses];
    newClauses[index].text = text;
    onChange({ ...data, additionalClauses: newClauses });
  };

  const removeAdditionalClause = (index: number) => {
    const filtered = data.additionalClauses.filter((_, i) => i !== index);
    // עדכן מספור
    filtered.forEach((c, i) => c.number = 7 + i);
    onChange({ ...data, additionalClauses: filtered });
  };

  const addSubItem = (clauseIndex: number) => {
    const newClauses = [...data.additionalClauses];
    if (!newClauses[clauseIndex].subItems) {
      newClauses[clauseIndex].subItems = [];
    }
    newClauses[clauseIndex].subItems!.push('');
    onChange({ ...data, additionalClauses: newClauses });
  };

  const updateSubItem = (clauseIndex: number, subIndex: number, value: string) => {
    const newClauses = [...data.additionalClauses];
    newClauses[clauseIndex].subItems![subIndex] = value;
    onChange({ ...data, additionalClauses: newClauses });
  };

  const removeSubItem = (clauseIndex: number, subIndex: number) => {
    const newClauses = [...data.additionalClauses];
    newClauses[clauseIndex].subItems = newClauses[clauseIndex].subItems!.filter((_, i) => i !== subIndex);
    onChange({ ...data, additionalClauses: newClauses });
  };

  // הוראות מיוחדות
  const addSpecialInstruction = () => {
    const nextNumber = 5 + data.additionalClauses.length + (data.specialInstructions?.length || 0) + 1;
    onChange({
      ...data,
      specialInstructions: [
        ...(data.specialInstructions || []),
        { number: nextNumber, text: '', editable: true, subItems: [] },
      ],
    });
  };

  const removeSpecialInstruction = (index: number) => {
    const filtered = (data.specialInstructions || []).filter((_, i) => i !== index);
    onChange({ ...data, specialInstructions: filtered });
  };

  const updateSpecialInstruction = (index: number, text: string) => {
    const newInstructions = [...(data.specialInstructions || [])];
    newInstructions[index] = { ...newInstructions[index], text };
    onChange({ ...data, specialInstructions: newInstructions });
  };

  const addSpecialSubItem = (instructionIdx: number) => {
    const newInstructions = [...(data.specialInstructions || [])];
    if (!newInstructions[instructionIdx].subItems) {
      newInstructions[instructionIdx].subItems = [];
    }
    newInstructions[instructionIdx].subItems = [...newInstructions[instructionIdx].subItems!, ''];
    onChange({ ...data, specialInstructions: newInstructions });
  };

  const updateSpecialSubItem = (instructionIdx: number, subIdx: number, text: string) => {
    const newInstructions = [...(data.specialInstructions || [])];
    newInstructions[instructionIdx].subItems![subIdx] = text;
    onChange({ ...data, specialInstructions: newInstructions });
  };

  const removeSpecialSubItem = (instructionIdx: number, subIdx: number) => {
    const newInstructions = [...(data.specialInstructions || [])];
    newInstructions[instructionIdx].subItems = newInstructions[instructionIdx].subItems?.filter((_, i) => i !== subIdx);
    onChange({ ...data, specialInstructions: newInstructions });
  };

  return (
    <div className="space-y-6">
      {/* המצווה */}
      <section className="bg-white border-2 border-blue-100 rounded-lg p-6">
        <h3 className="font-semibold text-lg mb-4 text-blue-900">👤 המצווה/ת</h3>
        
        {/* בחירת מגדר */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">מגדר</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'female', label: 'אישה' },
              { value: 'male', label: 'גבר' },
            ].map((option) => (
              <label
                key={option.value}
                className={`
                  flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer
                  ${data.testator.gender === option.value
                    ? 'border-blue-600 bg-blue-50 font-medium'
                    : 'border-gray-300 hover:border-gray-400'
                  }
                `}
              >
                <input
                  type="radio"
                  name="gender"
                  value={option.value}
                  checked={data.testator.gender === option.value}
                  onChange={(e) => updateTestator('gender', e.target.value as Gender)}
                  className="sr-only"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="שם מלא *"
            required
            value={data.testator.name}
            onChange={(e) => updateTestator('name', e.target.value)}
          />
          <IsraeliIDInput
            label="תעודת זהות *"
            required
            value={data.testator.id}
            onChange={(e) => updateTestator('id', e.target.value)}
            onValidationChange={(isValid) => 
              setValidationState(prev => ({ ...prev, testatorId: isValid }))
            }
          />
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <Input
            label="כתובת מלאה *"
            required
            value={data.testator.address}
            onChange={(e) => updateTestator('address', e.target.value)}
            placeholder="רחוב, מספר, עיר"
          />
          <PhoneInput
            label="טלפון"
            value={data.testator.phone || ''}
            onChange={(e) => updateTestator('phone', e.target.value)}
            onValidationChange={(isValid) => 
              setValidationState(prev => ({ ...prev, testatorPhone: isValid }))
            }
          />
        </div>
        
        <div className="mt-4">
          <EmailInput
            label="אימייל"
            value={data.testator.email || ''}
            onChange={(e) => updateTestator('email', e.target.value)}
            onValidationChange={(isValid) => 
              setValidationState(prev => ({ ...prev, testatorEmail: isValid }))
            }
          />
        </div>
        
        {/* אינדיקטור ולידציה */}
        <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${validationState.testatorId ? 'bg-green-500' : 'bg-gray-300'}`}></span>
            <span>ת.ז. תקינה</span>
          </div>
          {data.testator.phone && (
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${validationState.testatorPhone ? 'bg-green-500' : 'bg-gray-300'}`}></span>
              <span>טלפון תקין</span>
            </div>
          )}
          {data.testator.email && (
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${validationState.testatorEmail ? 'bg-green-500' : 'bg-gray-300'}`}></span>
              <span>אימייל תקין</span>
            </div>
          )}
        </div>
      </section>

      {/* היקף העיזבון */}
      <section className="bg-white border-2 border-green-100 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-green-900">🏛️ היקף העיזבון</h3>
          <Button variant="outline" size="sm" onClick={addAsset}>
            + הוסף נכס
          </Button>
        </div>

        {data.estate.assets.length > 0 ? (
          <div className="space-y-4">
            {data.estate.assets.map((asset, idx) => (
              <div key={idx} className="border-2 border-green-200 rounded-lg p-4 bg-green-50/50">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-green-900">
                    נכס {idx + 1} (יופיע כסעיף 5.{idx + 1})
                  </label>
                  <button
                    onClick={() => removeAsset(idx)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    מחק
                  </button>
                </div>
                
                <select
                  value={asset.type}
                  onChange={(e) => {
                    updateAsset(idx, 'type', e.target.value);
                    // עדכן גם את התיאור לפי הסוג
                    if (!asset.description) {
                      updateAsset(idx, 'description', getAssetPlaceholder(e.target.value));
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3"
                >
                  <option value="apartment">🏠 דירת מגורים</option>
                  <option value="land">🏞️ מגרש/קרקע</option>
                  <option value="bank">🏦 חשבון בנק</option>
                  <option value="cash">💵 כספים במזומן</option>
                  <option value="jewelry">💎 תכשיטים</option>
                  <option value="vehicle">🚗 רכב</option>
                  <option value="stocks">📈 ני"ע/מניות</option>
                  <option value="other">📦 אחר</option>
                </select>
                
                <textarea
                  value={asset.description}
                  onChange={(e) => updateAsset(idx, 'description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder={getAssetPlaceholder(asset.type)}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">לחץ על "הוסף נכס" להוספת נכסים (יופיעו כסעיפי משנה 5.1, 5.2 וכו')</p>
        )}
      </section>

      {/* יורשים */}
      <section className="bg-white border-2 border-purple-100 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-purple-900">👥 יורשים</h3>
          <Button variant="outline" size="sm" onClick={addBeneficiary}>
            + הוסף יורש
          </Button>
        </div>

        {data.beneficiaries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-right border">
              <thead className="bg-purple-50">
                <tr>
                  <th className="border p-2 font-semibold">שם מלא</th>
                  <th className="border p-2 font-semibold">תעודת זהות</th>
                  <th className="border p-2 font-semibold">קרבה</th>
                  <th className="border p-2 font-semibold">חלק</th>
                  <th className="border p-2 w-16"></th>
                </tr>
              </thead>
              <tbody>
                {data.beneficiaries.map((ben, idx) => (
                  <tr key={idx}>
                    <td className="border p-2">
                      <input
                        type="text"
                        value={ben.name}
                        onChange={(e) => updateBeneficiary(idx, 'name', e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                        placeholder="שם מלא"
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="text"
                        value={ben.id}
                        onChange={(e) => updateBeneficiary(idx, 'id', e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                        placeholder="ת.ז."
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="text"
                        value={ben.relationship}
                        onChange={(e) => updateBeneficiary(idx, 'relationship', e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                        placeholder='לדוגמה: "בן"'
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="text"
                        value={ben.share}
                        onChange={(e) => updateBeneficiary(idx, 'share', e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                        placeholder='לדוגמה: "1/3"'
                      />
                    </td>
                    <td className="border p-2 text-center">
                      <button
                        onClick={() => removeBeneficiary(idx)}
                        className="text-red-600 hover:text-red-700 text-xl"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">לחץ על "הוסף יורש" להוספת יורשים</p>
        )}
      </section>

      {/* סעיפים סטנדרטיים */}
      <section className="bg-white border-2 border-orange-100 rounded-lg p-6">
        <h3 className="font-semibold text-lg mb-4 text-orange-900">📋 סעיפים סטנדרטיים</h3>
        <p className="text-sm text-gray-600 mb-4">ניתן לערוך בהתאם לצורך</p>

        <div className="space-y-4">
          {(['revocation', 'debts', 'scope'] as const).map((key) => {
            const clause = data.standardClauses[key];
            return (
              <div key={key} className="border rounded p-3 bg-orange-50/30">
                <label className="block font-medium text-sm mb-2">
                  סעיף {clause.number}
                </label>
                <textarea
                  value={clause.text}
                  onChange={(e) => updateStandardClause(key, e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* סעיפים נוספים */}
      <section className="bg-white border-2 border-indigo-100 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-indigo-900">➕ סעיפים נוספים</h3>
          <Button variant="outline" size="sm" onClick={addAdditionalClause}>
            + הוסף סעיף
          </Button>
        </div>

        {data.additionalClauses.length > 0 ? (
          <div className="space-y-4">
            {data.additionalClauses.map((clause, clauseIdx) => (
              <div key={clauseIdx} className="border-2 border-indigo-200 rounded-lg p-4 bg-indigo-50/30">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-medium text-sm text-indigo-900">סעיף {clause.number}</label>
                  <button
                    onClick={() => removeAdditionalClause(clauseIdx)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    מחק סעיף
                  </button>
                </div>
                <textarea
                  value={clause.text}
                  onChange={(e) => updateAdditionalClause(clauseIdx, e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg text-sm mb-3"
                  placeholder="תוכן הסעיף הראשי..."
                />

                {/* תתי-סעיפים */}
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-indigo-800">
                      תתי-סעיפים ({clause.number}.1, {clause.number}.2...):
                    </label>
                    <button
                      onClick={() => addSubItem(clauseIdx)}
                      className="px-2 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      + תת-סעיף
                    </button>
                  </div>

                  {clause.subItems && clause.subItems.length > 0 && (
                    <div className="space-y-2">
                      {clause.subItems.map((subItem, subIdx) => (
                        <div key={subIdx} className="bg-white rounded border p-2">
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-medium text-gray-600">
                              תת-סעיף {clause.number}.{subIdx + 1}
                            </label>
                            <button
                              onClick={() => removeSubItem(clauseIdx, subIdx)}
                              className="text-red-600 hover:text-red-700 text-xs"
                            >
                              מחק
                            </button>
                          </div>
                          <textarea
                            value={subItem}
                            onChange={(e) => updateSubItem(clauseIdx, subIdx, e.target.value)}
                            rows={2}
                            className="w-full px-2 py-1 border rounded text-xs"
                            placeholder="תוכן תת-הסעיף..."
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">לחץ על "הוסף סעיף" להוספת סעיפים נוספים (עם אפשרות לתתי-סעיפים)</p>
        )}
      </section>

      {/* הוראות מיוחדות */}
      <section className="bg-white border-2 border-purple-300 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">🎯 הוראות מיוחדות</h3>
          <Button
            onClick={addSpecialInstruction}
            variant="secondary"
            size="sm"
          >
            + הוסף הוראה מיוחדת
          </Button>
        </div>

        {data.specialInstructions && data.specialInstructions.length > 0 ? (
          <div className="space-y-4">
            {data.specialInstructions.map((instruction, instructionIdx) => (
              <div key={instructionIdx} className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50/30">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-medium text-sm text-purple-900">הוראה מיוחדת {instruction.number}</label>
                  <button
                    onClick={() => removeSpecialInstruction(instructionIdx)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    מחק הוראה
                  </button>
                </div>
                <textarea
                  value={instruction.text}
                  onChange={(e) => updateSpecialInstruction(instructionIdx, e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg text-sm mb-3"
                  placeholder="תוכן ההוראה המיוחדת..."
                />

                {/* תתי-סעיפים */}
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-purple-800">
                      תתי-סעיפים ({instruction.number}.1, {instruction.number}.2...):
                    </label>
                    <button
                      onClick={() => addSpecialSubItem(instructionIdx)}
                      className="px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                      + תת-סעיף
                    </button>
                  </div>

                  {instruction.subItems && instruction.subItems.length > 0 && (
                    <div className="space-y-2">
                      {instruction.subItems.map((subItem, subIdx) => (
                        <div key={subIdx} className="bg-white rounded border p-2">
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-medium text-gray-600">
                              תת-סעיף {instruction.number}.{subIdx + 1}
                            </label>
                            <button
                              onClick={() => removeSpecialSubItem(instructionIdx, subIdx)}
                              className="text-red-600 hover:text-red-700 text-xs"
                            >
                              מחק
                            </button>
                          </div>
                          <textarea
                            value={subItem}
                            onChange={(e) => updateSpecialSubItem(instructionIdx, subIdx, e.target.value)}
                            rows={2}
                            className="w-full px-2 py-1 border rounded text-xs"
                            placeholder="תוכן תת-הסעיף..."
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">לחץ על "הוסף הוראה מיוחדת" להוספת הוראות מיוחדות (עם אפשרות לתתי-סעיפים)</p>
        )}
      </section>

      {/* עדים */}
      <section className="bg-white border-2 border-gray-300 rounded-lg p-6">
        <h3 className="font-semibold text-lg mb-4">✍️ עדים</h3>
        {data.witnesses.map((witness, idx) => (
          <div key={idx} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="font-medium mb-3 text-gray-800">עד {idx + 1} *</p>
            <div className="grid md:grid-cols-2 gap-3">
              <Input
                label="שם מלא *"
                required
                value={witness.name}
                onChange={(e) => {
                  const newWitnesses: [any, any] = [...data.witnesses] as [any, any];
                  newWitnesses[idx].name = e.target.value;
                  onChange({ ...data, witnesses: newWitnesses });
                }}
              />
              <IsraeliIDInput
                label="תעודת זהות *"
                required
                value={witness.id}
                onChange={(e) => {
                  const newWitnesses: [any, any] = [...data.witnesses] as [any, any];
                  newWitnesses[idx].id = e.target.value;
                  onChange({ ...data, witnesses: newWitnesses });
                }}
                onValidationChange={(isValid) => 
                  setValidationState(prev => ({ 
                    ...prev, 
                    [`witness${idx + 1}Id`]: isValid 
                  }))
                }
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-3 mt-3">
              <Input
                label="כתובת *"
                required
                value={witness.address}
                onChange={(e) => {
                  const newWitnesses: [any, any] = [...data.witnesses] as [any, any];
                  newWitnesses[idx].address = e.target.value;
                  onChange({ ...data, witnesses: newWitnesses });
                }}
                placeholder="רחוב, מספר, עיר"
              />
              <PhoneInput
                label="טלפון"
                value={witness.phone || ''}
                onChange={(e) => {
                  const newWitnesses: [any, any] = [...data.witnesses] as [any, any];
                  newWitnesses[idx].phone = e.target.value;
                  onChange({ ...data, witnesses: newWitnesses });
                }}
                onValidationChange={(isValid) => 
                  setValidationState(prev => ({ 
                    ...prev, 
                    [`witness${idx + 1}Phone`]: isValid 
                  }))
                }
              />
            </div>
            
            <div className="mt-3">
              <EmailInput
                label="אימייל"
                value={witness.email || ''}
                onChange={(e) => {
                  const newWitnesses: [any, any] = [...data.witnesses] as [any, any];
                  newWitnesses[idx].email = e.target.value;
                  onChange({ ...data, witnesses: newWitnesses });
                }}
              />
            </div>
            
            {/* אינדיקטור ולידציה לעד */}
            <div className="mt-3 p-2 bg-white rounded text-xs border">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${validationState[`witness${idx + 1}Id`] ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span>ת.ז. תקינה</span>
              </div>
              {witness.phone && (
                <div className="flex items-center gap-2 mt-1">
                  <span className={`w-2 h-2 rounded-full ${validationState[`witness${idx + 1}Phone`] ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  <span>טלפון תקין</span>
                </div>
              )}
            </div>
          </div>
        ))}
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">חשוב לדעת:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• העדים חייבים להיות מעל גיל 18</li>
            <li>• העדים לא יכולים להיות יורשים או בעלי אינטרס בצוואה</li>
            <li>• חתימת העדים חייבת להתבצע בנוכחות המצווה</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

