'use client';

import { useState } from 'react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { IsraeliIDInput } from '../../../components/forms/IsraeliIDInput';
import { Deceased } from './types';

interface DeceasedFormProps {
  data: Deceased;
  onUpdate: (data: Deceased) => void;
  onNext: () => void;
  onBack: () => void;
}

export function DeceasedForm({ data, onUpdate, onNext, onBack }: DeceasedFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof Deceased, value: any) => {
    onUpdate({ ...data, [field]: value });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.name.trim()) newErrors.name = 'שם המנוח הוא שדה חובה';
    if (!data.id.trim()) newErrors.id = 'תעודת זהות היא שדה חובה';
    if (data.id.length !== 9) newErrors.id = 'תעודת זהות חייבת להכיל 9 ספרות';
    if (!data.lastAddress.trim()) newErrors.lastAddress = 'כתובת מגורים אחרונה היא שדה חובה';
    if (!data.deathDate.trim()) newErrors.deathDate = 'תאריך פטירה הוא שדה חובה';
    if (!data.deathPlace.trim()) newErrors.deathPlace = 'מקום פטירה הוא שדה חובה';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">פרטי המנוח</h2>
        <p className="text-gray-600">מלא את הפרטים של המנוח</p>
      </div>

      <Input
        label="שם המנוח"
        required
        value={data.name}
        onChange={(e) => handleChange('name', e.target.value)}
        error={errors.name}
        placeholder="דוד כהן"
      />

      <IsraeliIDInput
        label="תעודת זהות"
        required
        value={data.id}
        onChange={(e) => handleChange('id', e.target.value)}
        error={errors.id}
      />

      <Input
        label="כתובת מגורים אחרונה"
        required
        value={data.lastAddress}
        onChange={(e) => handleChange('lastAddress', e.target.value)}
        error={errors.lastAddress}
        placeholder="רחוב, מספר בית, עיר"
      />

      <Input
        label="תאריך פטירה"
        type="date"
        required
        value={data.deathDate}
        onChange={(e) => handleChange('deathDate', e.target.value)}
        error={errors.deathDate}
      />

      <Input
        label="מקום פטירה"
        required
        value={data.deathPlace}
        onChange={(e) => handleChange('deathPlace', e.target.value)}
        error={errors.deathPlace}
        placeholder="בית חולים איכילוב, תל אביב"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          מצב משפחתי <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-4">
          {(['רווק', 'נשוי', 'אלמן', 'גרוש'] as const).map((status) => (
            <label
              key={status}
              className={`
                flex items-center justify-center px-4 py-3 border-2 rounded-lg cursor-pointer transition-all
                ${data.maritalStatus === status
                  ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium'
                  : 'border-gray-300 hover:border-gray-400'
                }
              `}
            >
              <input
                type="radio"
                name="maritalStatus"
                value={status}
                checked={data.maritalStatus === status}
                onChange={(e) => handleChange('maritalStatus', e.target.value as any)}
                className="sr-only"
              />
              {status}
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t">
        <Button type="button" variant="outline" onClick={onBack}>
          → חזור
        </Button>
        <Button type="submit" variant="primary" size="lg">
          המשך ←
        </Button>
      </div>
    </form>
  );
}

