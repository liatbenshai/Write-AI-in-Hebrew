'use client';

import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { IsraeliIDInput } from '../../../components/forms/IsraeliIDInput';
import { ProbateOrderData, Beneficiary, Witness } from './types';

interface ProbateFormProps {
  data: ProbateOrderData;
  onUpdate: (data: ProbateOrderData) => void;
}

export function ProbateForm({ data, onUpdate }: ProbateFormProps) {
  const addBeneficiary = () => {
    onUpdate({
      ...data,
      beneficiaries: [...data.beneficiaries, { name: '', id: '', address: '', shareDescription: '' }]
    });
  };

  const updateBeneficiary = (index: number, updates: Partial<Beneficiary>) => {
    const newBeneficiaries = [...data.beneficiaries];
    newBeneficiaries[index] = { ...newBeneficiaries[index], ...updates };
    onUpdate({ ...data, beneficiaries: newBeneficiaries });
  };

  const removeBeneficiary = (index: number) => {
    onUpdate({
      ...data,
      beneficiaries: data.beneficiaries.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-8">
      {/* פרטי המבקש */}
      <div className="border-2 border-blue-100 rounded-lg p-6 bg-blue-50/30">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">פרטי המבקש</h3>
        <div className="space-y-4">
          <Input
            label="שם מלא"
            required
            value={data.applicant.name}
            onChange={(e) => onUpdate({ ...data, applicant: { ...data.applicant, name: e.target.value } })}
          />
          <IsraeliIDInput
            label="תעודת זהות"
            required
            value={data.applicant.id}
            onChange={(e) => onUpdate({ ...data, applicant: { ...data.applicant, id: e.target.value } })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              יחס לצוואה <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'executor', label: 'מנהל עיזבון' },
                { value: 'beneficiary', label: 'זוכה' },
                { value: 'heir', label: 'יורש' },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`
                    flex items-center justify-center px-3 py-2 border-2 rounded-lg cursor-pointer transition-all
                    ${data.applicant.relationshipToWill === option.value
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium'
                      : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="relationshipToWill"
                    value={option.value}
                    checked={data.applicant.relationshipToWill === option.value}
                    onChange={(e) => onUpdate({ ...data, applicant: { ...data.applicant, relationshipToWill: e.target.value as any } })}
                    className="sr-only"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* פרטי המנוח */}
      <div className="border-2 border-purple-100 rounded-lg p-6 bg-purple-50/30">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">פרטי המנוח</h3>
        <div className="space-y-4">
          <Input
            label="שם המנוח"
            required
            value={data.deceased.name}
            onChange={(e) => onUpdate({ ...data, deceased: { ...data.deceased, name: e.target.value } })}
          />
          <IsraeliIDInput
            label="תעודת זהות"
            required
            value={data.deceased.id}
            onChange={(e) => onUpdate({ ...data, deceased: { ...data.deceased, id: e.target.value } })}
          />
          <Input
            label="תאריך פטירה"
            type="date"
            required
            value={data.deceased.deathDate}
            onChange={(e) => onUpdate({ ...data, deceased: { ...data.deceased, deathDate: e.target.value } })}
          />
        </div>
      </div>

      {/* פרטי הצוואה */}
      <div className="border-2 border-green-100 rounded-lg p-6 bg-green-50/30">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📜 פרטי הצוואה</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              סוג הצוואה <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'holographic', label: 'עצמית' },
                { value: 'witnessed', label: 'בפני עדים' },
                { value: 'authority', label: 'בפני רשות' },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`
                    flex items-center justify-center px-3 py-2 border-2 rounded-lg cursor-pointer transition-all text-sm
                    ${data.will.type === option.value
                      ? 'border-green-600 bg-green-50 text-green-700 font-medium'
                      : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="willType"
                    value={option.value}
                    checked={data.will.type === option.value}
                    onChange={(e) => onUpdate({ ...data, will: { ...data.will, type: e.target.value as any } })}
                    className="sr-only"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          <Input
            label="תאריך עריכת הצוואה"
            type="date"
            required
            value={data.will.dateWritten}
            onChange={(e) => onUpdate({ ...data, will: { ...data.will, dateWritten: e.target.value } })}
          />

          <Input
            label="מקום שמירת הצוואה"
            required
            value={data.will.location}
            onChange={(e) => onUpdate({ ...data, will: { ...data.will, location: e.target.value } })}
            placeholder="אצל עו״ד / בבית / בבנק"
          />

          {/* עדים - רק לצוואה בפני עדים */}
          {data.will.type === 'witnessed' && (
            <div className="mt-6 p-4 bg-white rounded border-2 border-green-300">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">עדים</h4>
                <Button
                  size="sm"
                  type="button"
                  onClick={() => {
                    const newWitnesses = [...data.will.witnesses, { name: '', id: '', address: '' }];
                    onUpdate({ ...data, will: { ...data.will, witnesses: newWitnesses } });
                  }}
                  disabled={data.will.witnesses.length >= 2}
                >
                  + הוסף עד
                </Button>
              </div>
              <p className="text-xs text-gray-600 mb-3">צוואה בפני עדים דורשת 2 עדים</p>
              
              {data.will.witnesses.map((witness, i) => (
                <div key={i} className="bg-gray-50 rounded p-3 mb-3 border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">עד {i + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newWitnesses = data.will.witnesses.filter((_, idx) => idx !== i);
                        onUpdate({ ...data, will: { ...data.will, witnesses: newWitnesses } });
                      }}
                      className="text-red-600 text-sm"
                    >
                      ✕ הסר
                    </button>
                  </div>
                  <div className="space-y-2">
                    <Input
                      label="שם"
                      required
                      value={witness.name}
                      onChange={(e) => {
                        const newWitnesses = [...data.will.witnesses];
                        newWitnesses[i] = { ...newWitnesses[i], name: e.target.value };
                        onUpdate({ ...data, will: { ...data.will, witnesses: newWitnesses } });
                      }}
                      placeholder="שם מלא"
                    />
                    <IsraeliIDInput
                      label="תעודת זהות"
                      required
                      value={witness.id}
                      onChange={(e) => {
                        const newWitnesses = [...data.will.witnesses];
                        newWitnesses[i] = { ...newWitnesses[i], id: e.target.value };
                        onUpdate({ ...data, will: { ...data.will, witnesses: newWitnesses } });
                      }}
                    />
                    <Input
                      label="כתובת"
                      required
                      value={witness.address}
                      onChange={(e) => {
                        const newWitnesses = [...data.will.witnesses];
                        newWitnesses[i] = { ...newWitnesses[i], address: e.target.value };
                        onUpdate({ ...data, will: { ...data.will, witnesses: newWitnesses } });
                      }}
                      placeholder="כתובת מלאה"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* רשות - רק לצוואה בפני רשות */}
          {data.will.type === 'authority' && (
            <div className="mt-6 p-4 bg-white rounded border-2 border-green-300">
              <h4 className="font-semibold mb-3">פרטי הרשות</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">סוג רשות</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'attorney', label: 'עורך דין' },
                      { value: 'judge', label: 'שופט' },
                      { value: 'religious_court', label: 'בית דין דתי' },
                      { value: 'municipality', label: 'רשות מקומית' },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={`
                          flex items-center justify-center px-3 py-2 border-2 rounded cursor-pointer text-sm
                          ${data.will.authority?.type === opt.value
                            ? 'border-green-600 bg-green-50 font-medium'
                            : 'border-gray-300 hover:border-gray-400'
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name="authorityType"
                          value={opt.value}
                          checked={data.will.authority?.type === opt.value}
                          onChange={(e) => onUpdate({
                            ...data,
                            will: {
                              ...data.will,
                              authority: {
                                type: e.target.value as any,
                                name: data.will.authority?.name || '',
                                licenseNumber: data.will.authority?.licenseNumber || '',
                                date: data.will.authority?.date || '',
                              }
                            }
                          })}
                          className="sr-only"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
                
                <Input
                  label="שם"
                  required
                  value={data.will.authority?.name || ''}
                  onChange={(e) => onUpdate({
                    ...data,
                    will: {
                      ...data.will,
                      authority: { ...data.will.authority!, name: e.target.value }
                    }
                  })}
                />
                
                {(data.will.authority?.type === 'attorney' || data.will.authority?.type === 'judge') && (
                  <Input
                    label="מספר רישיון"
                    required
                    value={data.will.authority?.licenseNumber || ''}
                    onChange={(e) => onUpdate({
                      ...data,
                      will: {
                        ...data.will,
                        authority: { ...data.will.authority!, licenseNumber: e.target.value }
                      }
                    })}
                  />
                )}
                
                <Input
                  label="תאריך"
                  type="date"
                  required
                  value={data.will.authority?.date || ''}
                  onChange={(e) => onUpdate({
                    ...data,
                    will: {
                      ...data.will,
                      authority: { ...data.will.authority!, date: e.target.value }
                    }
                  })}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* זוכים בצוואה */}
      <div className="border-2 border-orange-100 rounded-lg p-6 bg-orange-50/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">👥 זוכים בצוואה</h3>
          <Button size="sm" onClick={addBeneficiary}>
            + הוסף זוכה
          </Button>
        </div>

        {data.beneficiaries.length === 0 ? (
          <p className="text-gray-500 text-sm italic">לחץ "הוסף זוכה" כדי להתחיל</p>
        ) : (
          <div className="space-y-4">
            {data.beneficiaries.map((ben, i) => (
              <div key={i} className="bg-white rounded-lg p-4 border border-orange-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">זוכה {i + 1}</h4>
                  <button
                    onClick={() => removeBeneficiary(i)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    ✕ הסר
                  </button>
                </div>
                <div className="space-y-3">
                  <Input
                    label="שם"
                    required
                    value={ben.name}
                    onChange={(e) => updateBeneficiary(i, { name: e.target.value })}
                  />
                  <IsraeliIDInput
                    label="תעודת זהות"
                    required
                    value={ben.id}
                    onChange={(e) => updateBeneficiary(i, { id: e.target.value })}
                  />
                  <Input
                    label="מה הוא מקבל"
                    required
                    value={ben.shareDescription}
                    onChange={(e) => updateBeneficiary(i, { shareDescription: e.target.value })}
                    placeholder="הדירה / 50% / החשבון בבנק"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

