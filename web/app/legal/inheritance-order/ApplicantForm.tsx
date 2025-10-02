'use client';

import { useState } from 'react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { IsraeliIDInput } from '../../../components/forms/IsraeliIDInput';
import { Applicant } from './types';

interface ApplicantFormProps {
  data: Applicant;
  onUpdate: (data: Applicant) => void;
  onNext: () => void;
}

export function ApplicantForm({ data, onUpdate, onNext }: ApplicantFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof Applicant, value: string) => {
    onUpdate({ ...data, [field]: value });
    // מחיקת שגיאה כשמשתמש מתקן
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.name.trim()) newErrors.name = 'שם מלא הוא שדה חובה';
    if (!data.id.trim()) newErrors.id = 'תעודת זהות היא שדה חובה';
    if (data.id.length !== 9) newErrors.id = 'תעודת זהות חייבת להכיל 9 ספרות';
    if (!data.address.trim()) newErrors.address = 'כתובת היא שדה חובה';
    if (!data.email.trim()) newErrors.email = 'אימייל הוא שדה חובה';
    if (!/@/.test(data.email)) newErrors.email = 'אימייל לא תקין';
    if (!data.phone.trim()) newErrors.phone = 'טלפון הוא שדה חובה';
    if (!data.relationship.trim()) newErrors.relationship = 'קרבה למנוח היא שדה חובה';

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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">פרטי המבקש</h2>
        <p className="text-gray-600">מלא את הפרטים שלך</p>
      </div>

      <Input
        label="שם מלא"
        required
        value={data.name}
        onChange={(e) => handleChange('name', e.target.value)}
        error={errors.name}
        placeholder="לדוגמה: יוסי כהן"
      />

      <IsraeliIDInput
        label="תעודת זהות"
        required
        value={data.id}
        onChange={(e) => handleChange('id', e.target.value)}
        error={errors.id}
      />

      <Input
        label="כתובת מלאה"
        required
        value={data.address}
        onChange={(e) => handleChange('address', e.target.value)}
        error={errors.address}
        placeholder="רחוב, מספר בית, עיר, מיקוד"
      />

      <Input
        label="אימייל"
        type="email"
        required
        value={data.email}
        onChange={(e) => handleChange('email', e.target.value)}
        error={errors.email}
        placeholder="example@email.com"
      />

      <Input
        label="טלפון"
        type="tel"
        required
        value={data.phone}
        onChange={(e) => handleChange('phone', e.target.value)}
        error={errors.phone}
        placeholder="050-1234567"
      />

      <Input
        label="קרבה למנוח"
        required
        value={data.relationship}
        onChange={(e) => handleChange('relationship', e.target.value)}
        error={errors.relationship}
        placeholder="בן, בת, אח, אחות"
        helpText="הקשר המשפחתי למנוח"
      />

      <div className="flex justify-end pt-4 border-t">
        <Button type="submit" variant="primary" size="lg">
          המשך ←
        </Button>
      </div>
    </form>
  );
}

