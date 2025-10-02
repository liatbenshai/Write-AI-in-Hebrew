'use client';

import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { IsraeliIDInput } from '../../../components/forms/IsraeliIDInput';
import { PowerOfAttorneyData } from './types';

interface PoaFormProps {
  data: PowerOfAttorneyData;
  onUpdate: (data: PowerOfAttorneyData) => void;
}

export function PoaForm({ data, onUpdate }: PoaFormProps) {
  const togglePower = (power: keyof typeof data.powers) => {
    if (typeof data.powers[power] === 'boolean') {
      onUpdate({
        ...data,
        powers: { ...data.powers, [power]: !data.powers[power] }
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* המייפה */}
      <div className="border-2 border-blue-100 rounded-lg p-6 bg-blue-50/30">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">המייפה (נותן ייפוי הכוח)</h3>
        <div className="space-y-4">
          <Input
            label="שם מלא"
            required
            value={data.principal.name}
            onChange={(e) => onUpdate({ ...data, principal: { ...data.principal, name: e.target.value } })}
          />
          <IsraeliIDInput
            label="תעודת זהות"
            required
            value={data.principal.id}
            onChange={(e) => onUpdate({ ...data, principal: { ...data.principal, id: e.target.value } })}
          />
          <Input
            label="כתובת"
            required
            value={data.principal.address}
            onChange={(e) => onUpdate({ ...data, principal: { ...data.principal, address: e.target.value } })}
          />
        </div>
      </div>

      {/* המיופה */}
      <div className="border-2 border-green-100 rounded-lg p-6 bg-green-50/30">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">המיופה (מקבל ייפוי הכוח)</h3>
        <div className="space-y-4">
          <Input
            label="שם מלא"
            required
            value={data.agent.name}
            onChange={(e) => onUpdate({ ...data, agent: { ...data.agent, name: e.target.value } })}
          />
          <IsraeliIDInput
            label="תעודת זהות"
            required
            value={data.agent.id}
            onChange={(e) => onUpdate({ ...data, agent: { ...data.agent, id: e.target.value } })}
          />
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isAttorney"
              checked={data.agent.isAttorney}
              onChange={(e) => onUpdate({ ...data, agent: { ...data.agent, isAttorney: e.target.checked } })}
              className="w-5 h-5 text-green-600 rounded"
            />
            <label htmlFor="isAttorney" className="font-medium">
              המיופה הוא עורך דין
            </label>
          </div>
          {data.agent.isAttorney && (
            <Input
              label="מספר רישיון"
              required
              value={data.agent.licenseNumber || ''}
              onChange={(e) => onUpdate({ ...data, agent: { ...data.agent, licenseNumber: e.target.value } })}
            />
          )}
        </div>
      </div>

      {/* סוג ייפוי הכוח */}
      <div className="border-2 border-purple-100 rounded-lg p-6 bg-purple-50/30">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">סוג ייפוי הכוח</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: 'general', label: 'כללי', desc: 'לכל ענייני המייפה' },
            { value: 'specific', label: 'מיוחד', desc: 'למטרה ספציפית' },
          ].map((option) => (
            <label
              key={option.value}
              className={`
                flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all
                ${data.type === option.value
                  ? 'border-purple-600 bg-purple-50 text-purple-700'
                  : 'border-gray-300 hover:border-gray-400'
                }
              `}
            >
              <input
                type="radio"
                name="type"
                value={option.value}
                checked={data.type === option.value}
                onChange={(e) => onUpdate({ ...data, type: e.target.value as any })}
                className="sr-only"
              />
              <span className="font-semibold">{option.label}</span>
              <span className="text-xs text-gray-600 mt-1">{option.desc}</span>
            </label>
          ))}
        </div>

        {data.type === 'specific' && (
          <div className="mt-4">
            <Input
              label="מטרת ייפוי הכוח"
              required
              value={data.purpose || ''}
              onChange={(e) => onUpdate({ ...data, purpose: e.target.value })}
              placeholder="להגשת בקשה לצו ירושה / למכירת דירה"
            />
          </div>
        )}
      </div>

      {/* סמכויות */}
      <div className="border-2 border-orange-100 rounded-lg p-6 bg-orange-50/30">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">סמכויות המיופה</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { key: 'realEstate', label: '🏠 נדל״ן', desc: 'קנייה, מכירה, השכרה' },
            { key: 'banking', label: '🏦 בנקאות', desc: 'חשבונות, משיכות, העברות' },
            { key: 'tax', label: '📊 מיסים', desc: 'דוחות, תשלומים, ייצוג' },
            { key: 'legal', label: '⚖️ משפטי', desc: 'בתי משפט, תביעות' },
            { key: 'inheritance', label: '📜 ירושה', desc: 'צווי ירושה, עיזבונות' },
            { key: 'medical', label: '⚕️ רפואי', desc: 'החלטות רפואיות' },
          ].map((power) => (
            <label
              key={power.key}
              className={`
                flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all
                ${data.powers[power.key as keyof typeof data.powers]
                  ? 'border-orange-600 bg-orange-50'
                  : 'border-gray-300 hover:border-gray-400'
                }
              `}
            >
              <input
                type="checkbox"
                checked={!!data.powers[power.key as keyof typeof data.powers]}
                onChange={() => togglePower(power.key as keyof typeof data.powers)}
                className="mt-1 w-5 h-5 text-orange-600 rounded"
              />
              <div>
                <div className="font-semibold text-gray-900">{power.label}</div>
                <div className="text-xs text-gray-600">{power.desc}</div>
              </div>
            </label>
          ))}
        </div>

        {data.powers.banking && (
          <div className="mt-4">
            <Input
              label="סכום מקסימלי לפעולות בנקאיות (₪)"
              type="number"
              value={data.powers.maxBankingAmount || ''}
              onChange={(e) => onUpdate({ ...data, powers: { ...data.powers, maxBankingAmount: parseInt(e.target.value) } })}
              placeholder="100000"
            />
          </div>
        )}
      </div>

      {/* תוקף */}
      <div className="border-2 border-indigo-100 rounded-lg p-6 bg-indigo-50/30">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">תוקף ייפוי הכוח</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: 'unlimited', label: 'ללא הגבלת זמן' },
              { value: 'until_date', label: 'עד תאריך מסוים' },
            ].map((option) => (
              <label
                key={option.value}
                className={`
                  flex items-center justify-center px-4 py-3 border-2 rounded-lg cursor-pointer
                  ${data.validity.type === option.value
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-medium'
                    : 'border-gray-300 hover:border-gray-400'
                  }
                `}
              >
                <input
                  type="radio"
                  name="validityType"
                  value={option.value}
                  checked={data.validity.type === option.value}
                  onChange={(e) => onUpdate({ ...data, validity: { ...data.validity, type: e.target.value as any } })}
                  className="sr-only"
                />
                {option.label}
              </label>
            ))}
          </div>

          {data.validity.type === 'until_date' && (
            <Input
              label="תוקף עד"
              type="date"
              required
              value={data.validity.endDate || ''}
              onChange={(e) => onUpdate({ ...data, validity: { ...data.validity, endDate: e.target.value } })}
            />
          )}

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={data.validity.irrevocable}
              onChange={(e) => onUpdate({ ...data, validity: { ...data.validity, irrevocable: e.target.checked } })}
              className="w-5 h-5 text-indigo-600 rounded"
            />
            <span className="font-medium">ייפוי כוח בלתי חוזר</span>
            <span className="text-xs text-gray-500">(לא ניתן לביטול)</span>
          </label>
        </div>
      </div>
    </div>
  );
}

