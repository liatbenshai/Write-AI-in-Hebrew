'use client';

import React from 'react';
import type { MutualWillData, Spouse, MutualBeneficiary, MutualClause } from './types';
import { Input } from '../../../components/ui/Input';
import { IsraeliIDInput } from '../../../components/forms/IsraeliIDInput';
import { Button } from '../../../components/ui/Button';
import MutualWillEstateForm from './MutualWillEstateForm';

type Props = {
  data: MutualWillData;
  onChange: (data: MutualWillData) => void;
};

export default function MutualWillForm({ data, onChange }: Props) {
  const updateSpouse = (index: 0 | 1, field: keyof Spouse, value: any) => {
    const newSpouses: [Spouse, Spouse] = [...data.spouses] as [Spouse, Spouse];
    newSpouses[index] = { ...newSpouses[index], [field]: value };
    onChange({ ...data, spouses: newSpouses });
  };

  const addBeneficiary = () => {
    onChange({
      ...data,
      beneficiaries: [
        ...data.beneficiaries,
        { 
          name: '', 
          id: '', 
          relationship: '', 
          inheritanceDetails: ['']
        }
      ],
    });
  };

  const updateBeneficiary = (index: number, field: keyof MutualBeneficiary, value: any) => {
    const newBeneficiaries = [...data.beneficiaries];
    newBeneficiaries[index] = { ...newBeneficiaries[index], [field]: value };
    onChange({ ...data, beneficiaries: newBeneficiaries });
  };

  const addInheritanceDetail = (beneficiaryIndex: number) => {
    const newBeneficiaries = [...data.beneficiaries];
    newBeneficiaries[beneficiaryIndex].inheritanceDetails.push('');
    onChange({ ...data, beneficiaries: newBeneficiaries });
  };

  const updateInheritanceDetail = (beneficiaryIndex: number, detailIndex: number, value: string) => {
    const newBeneficiaries = [...data.beneficiaries];
    newBeneficiaries[beneficiaryIndex].inheritanceDetails[detailIndex] = value;
    onChange({ ...data, beneficiaries: newBeneficiaries });
  };

  const removeInheritanceDetail = (beneficiaryIndex: number, detailIndex: number) => {
    const newBeneficiaries = [...data.beneficiaries];
    newBeneficiaries[beneficiaryIndex].inheritanceDetails = 
      newBeneficiaries[beneficiaryIndex].inheritanceDetails.filter((_, i) => i !== detailIndex);
    onChange({ ...data, beneficiaries: newBeneficiaries });
  };

  const removeBeneficiary = (index: number) => {
    onChange({
      ...data,
      beneficiaries: data.beneficiaries.filter((_, i) => i !== index),
    });
  };

  const updateEstateAssets = (assets: string[]) => {
    onChange({
      ...data,
      estate: { ...data.estate, assets },
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

  const addSpecialProvision = () => {
    const nextNumber = 6 + data.specialProvisions.length; // אחרי סעיף 5 (היקף עיזבון)
    onChange({
      ...data,
      specialProvisions: [
        ...data.specialProvisions,
        { number: nextNumber, text: '', subItems: [] },
      ],
    });
  };

  const updateSpecialProvision = (index: number, text: string) => {
    const newProvisions = [...data.specialProvisions];
    newProvisions[index].text = text;
    onChange({ ...data, specialProvisions: newProvisions });
  };

  const removeSpecialProvision = (index: number) => {
    const filtered = data.specialProvisions.filter((_, i) => i !== index);
    // עדכן מספור
    filtered.forEach((p, i) => p.number = 6 + i);
    onChange({ ...data, specialProvisions: filtered });
  };

  const addProvisionSubItem = (provIndex: number) => {
    const newProvisions = [...data.specialProvisions];
    if (!newProvisions[provIndex].subItems) {
      newProvisions[provIndex].subItems = [];
    }
    newProvisions[provIndex].subItems!.push('');
    onChange({ ...data, specialProvisions: newProvisions });
  };

  const updateProvisionSubItem = (provIndex: number, subIndex: number, value: string) => {
    const newProvisions = [...data.specialProvisions];
    newProvisions[provIndex].subItems![subIndex] = value;
    onChange({ ...data, specialProvisions: newProvisions });
  };

  const removeProvisionSubItem = (provIndex: number, subIndex: number) => {
    const newProvisions = [...data.specialProvisions];
    newProvisions[provIndex].subItems = newProvisions[provIndex].subItems!.filter((_, i) => i !== subIndex);
    onChange({ ...data, specialProvisions: newProvisions });
  };

  return (
    <div className="space-y-6">
      {/* בני הזוג */}
      <section className="bg-white border-2 border-blue-100 rounded-lg p-6">
        <h3 className="font-semibold text-lg mb-4 text-blue-900">👥 בני הזוג המצווים</h3>
        
        {data.spouses.map((spouse, idx) => (
          <div key={idx} className="mb-6 pb-6 border-b last:border-b-0 last:pb-0">
            <p className="font-medium mb-3 text-blue-800">בן/בת זוג {idx + 1}</p>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="שם מלא"
                required
                value={spouse.name}
                onChange={(e) => updateSpouse(idx as 0 | 1, 'name', e.target.value)}
              />
              <IsraeliIDInput
                label="תעודת זהות"
                required
                value={spouse.id}
                onChange={(e) => updateSpouse(idx as 0 | 1, 'id', e.target.value)}
              />
            </div>
            <Input
              label="כתובת מלאה"
              required
              value={spouse.address}
              onChange={(e) => updateSpouse(idx as 0 | 1, 'address', e.target.value)}
              className="mt-4"
              placeholder="רחוב, מספר, עיר"
            />
            <Input
              label='כינוי בצוואה (לדוגמה: "משה")'
              value={spouse.nickname || ''}
              onChange={(e) => updateSpouse(idx as 0 | 1, 'nickname', e.target.value)}
              className="mt-4"
              placeholder='איך לקרוא לו/לה בצוואה'
            />
          </div>
        ))}

        <Input
          label="שנת נישואין"
          type="number"
          required
          value={data.marriageYear || ''}
          onChange={(e) => onChange({ ...data, marriageYear: parseInt(e.target.value) })}
          className="mt-4"
          placeholder="לדוגמה: 1995"
        />
      </section>

      {/* היקף העיזבון */}
      <section className="bg-white border-2 border-green-100 rounded-lg p-6">
        <h3 className="font-semibold text-lg mb-4 text-green-900">🏛️ היקף העיזבון</h3>
        <p className="text-sm text-gray-600 mb-4">
          פירוט הנכסים, חשבונות בנק, ניירות ערך, קרנות, ביטוחים וכו'
        </p>
        <MutualWillEstateForm 
          assets={data.estate.assets} 
          onChange={updateEstateAssets} 
        />
      </section>

      {/* סעיפים סטנדרטיים */}
      <section className="bg-white border-2 border-orange-100 rounded-lg p-6">
        <h3 className="font-semibold text-lg mb-4 text-orange-900">📋 סעיפים סטנדרטיים</h3>
        <p className="text-sm text-gray-600 mb-4">ניתן לערוך בהתאם לצורך</p>

        <div className="space-y-4">
          {(['marriage', 'revocation', 'debts', 'rightToRevoke'] as const).map((key) => {
            const clause = data.standardClauses[key];
            return (
              <div key={key} className="border rounded p-3 bg-orange-50/30">
                <label className="block font-medium text-sm mb-2">
                  סעיף {clause.number}
                </label>
                <textarea
                  value={clause.text}
                  onChange={(e) => updateStandardClause(key, e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* יורשים */}
      <section className="bg-white border-2 border-purple-100 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-purple-900">👥 יורשים והוראות חלוקה</h3>
          <Button variant="outline" size="sm" onClick={addBeneficiary}>
            + הוסף יורש
          </Button>
        </div>

        {data.beneficiaries.length > 0 ? (
          <div className="space-y-6">
            {data.beneficiaries.map((ben, benIdx) => (
              <div key={benIdx} className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50/30">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium text-purple-900">יורש {benIdx + 1}</p>
                  <button
                    onClick={() => removeBeneficiary(benIdx)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    מחק יורש
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-3 mb-4">
                  <Input
                    label="שם מלא"
                    value={ben.name}
                    onChange={(e) => updateBeneficiary(benIdx, 'name', e.target.value)}
                  />
                  <IsraeliIDInput
                    label="תעודת זהות"
                    value={ben.id}
                    onChange={(e) => updateBeneficiary(benIdx, 'id', e.target.value)}
                  />
                  <Input
                    label="קרבה"
                    value={ben.relationship}
                    onChange={(e) => updateBeneficiary(benIdx, 'relationship', e.target.value)}
                    placeholder='לדוגמה: "בתנו"'
                  />
                </div>

                {/* פירוט ירושה - תתי-סעיפים */}
                <div className="mt-4 border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">
                      תתי-סעיפים (יופיעו כ-8.{benIdx + 1}.1, 8.{benIdx + 1}.2 וכו'):
                    </label>
                    <button
                      onClick={() => addInheritanceDetail(benIdx)}
                      className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                      + הוסף תת-סעיף
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    כל תת-סעיף מתאר פריט ספציפי שהיורש/ת מקבל/ת
                  </p>
                  <div className="space-y-3">
                    {ben.inheritanceDetails.map((detail, detailIdx) => (
                      <div key={detailIdx} className="bg-white rounded border p-3">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-medium text-purple-800">
                            תת-סעיף 8.{benIdx + 1}.{detailIdx + 1}
                          </label>
                          {ben.inheritanceDetails.length > 1 && (
                            <button
                              onClick={() => removeInheritanceDetail(benIdx, detailIdx)}
                              className="text-red-600 hover:text-red-700 text-sm"
                            >
                              מחק
                            </button>
                          )}
                        </div>
                        <textarea
                          value={detail}
                          onChange={(e) => updateInheritanceDetail(benIdx, detailIdx, e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border rounded text-sm"
                          placeholder={`לדוגמה: "את מלוא זכויותינו (100%) בדירת המגורים ברחוב ויצמן 9, תל אביב, הידועה כגוש: 1234, חלקה: 56, תת חלקה: 78, וכן את מטלטליה המחוברים חיבור של קבע."`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">לחץ על "הוסף יורש" להוספת יורשים</p>
        )}
      </section>

      {/* הוראות מיוחדות */}
      <section className="bg-white border-2 border-indigo-100 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-indigo-900">⚖️ הוראות מיוחדות</h3>
          <Button variant="outline" size="sm" onClick={addSpecialProvision}>
            + הוסף הוראה
          </Button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          למשל: זכות מגורים, איסור מכירה, תנאים מיוחדים - עם אפשרות לתתי-סעיפים
        </p>

        {data.specialProvisions.length > 0 ? (
          <div className="space-y-4">
            {data.specialProvisions.map((prov, provIdx) => (
              <div key={provIdx} className="border-2 border-indigo-200 rounded-lg p-4 bg-indigo-50/30">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-medium text-sm text-indigo-900">סעיף {prov.number}</label>
                  <button
                    onClick={() => removeSpecialProvision(provIdx)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    מחק סעיף
                  </button>
                </div>
                <textarea
                  value={prov.text}
                  onChange={(e) => updateSpecialProvision(provIdx, e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg text-sm mb-3"
                  placeholder="תוכן ההוראה הראשי..."
                />

                {/* תתי-סעיפים */}
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-indigo-800">
                      תתי-סעיפים ({prov.number}.1, {prov.number}.2...):
                    </label>
                    <button
                      onClick={() => addProvisionSubItem(provIdx)}
                      className="px-2 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      + תת-סעיף
                    </button>
                  </div>

                  {prov.subItems && prov.subItems.length > 0 && (
                    <div className="space-y-2">
                      {prov.subItems.map((subItem, subIdx) => (
                        <div key={subIdx} className="bg-white rounded border p-2">
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-medium text-gray-600">
                              {prov.number}.{subIdx + 1}
                            </label>
                            <button
                              onClick={() => removeProvisionSubItem(provIdx, subIdx)}
                              className="text-red-600 hover:text-red-700 text-xs"
                            >
                              מחק
                            </button>
                          </div>
                          <textarea
                            value={subItem}
                            onChange={(e) => updateProvisionSubItem(provIdx, subIdx, e.target.value)}
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
          <p className="text-gray-500 text-sm">לחץ על "הוסף הוראה" להוספת הוראות מיוחדות (עם אפשרות לתתי-סעיפים)</p>
        )}
      </section>

      {/* ברכה סיום */}
      <section className="bg-white border-2 border-pink-100 rounded-lg p-6">
        <h3 className="font-semibold text-lg mb-4 text-pink-900">💝 ברכה וסיום</h3>
        <textarea
          value={data.closing.blessing}
          onChange={(e) => onChange({ 
            ...data, 
            closing: { ...data.closing, blessing: e.target.value }
          })}
          rows={3}
          className="w-full px-3 py-2 border rounded-lg text-sm"
          placeholder="ברכה לבנים, נכדים ומשפחה..."
        />
      </section>

      {/* עדים */}
      <section className="bg-white border-2 border-gray-300 rounded-lg p-6">
        <h3 className="font-semibold text-lg mb-4">✍️ עדים</h3>
        {data.witnesses.map((witness, idx) => (
          <div key={idx} className="mb-4 p-3 bg-gray-50 rounded">
            <p className="font-medium mb-2">עד {idx + 1}</p>
            <div className="grid md:grid-cols-2 gap-3">
              <Input
                label="שם מלא"
                value={witness.name}
                onChange={(e) => {
                  const newWitnesses: [any, any] = [...data.witnesses] as [any, any];
                  newWitnesses[idx].name = e.target.value;
                  onChange({ ...data, witnesses: newWitnesses });
                }}
              />
              <IsraeliIDInput
                label="תעודת זהות"
                value={witness.id}
                onChange={(e) => {
                  const newWitnesses: [any, any] = [...data.witnesses] as [any, any];
                  newWitnesses[idx].id = e.target.value;
                  onChange({ ...data, witnesses: newWitnesses });
                }}
              />
            </div>
            <Input
              label="כתובת"
              value={witness.address}
              onChange={(e) => {
                const newWitnesses: [any, any] = [...data.witnesses] as [any, any];
                newWitnesses[idx].address = e.target.value;
                onChange({ ...data, witnesses: newWitnesses });
              }}
              className="mt-3"
            />
          </div>
        ))}
      </section>
    </div>
  );
}

