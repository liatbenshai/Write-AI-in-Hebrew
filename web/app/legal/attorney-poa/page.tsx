'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getInitialData, AttorneyPOAData } from './types';
import { Input } from '../../../components/ui/Input';
import { IsraeliIDInput } from '../../../components/forms/IsraeliIDInput';
import { Button } from '../../../components/ui/Button';

export default function AttorneyPOAPage() {
  const [data, setData] = useState<AttorneyPOAData>(getInitialData());

  useEffect(() => {
    const saved = localStorage.getItem('attorney-poa-draft');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('attorney-poa-draft', JSON.stringify(data));
  }, [data]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ייפוי כוח לעורך דין</h1>
            <p className="text-sm text-gray-600 mt-1">מסמך ייפוי כוח מהלקוח לעו״ד</p>
          </div>
          <Link href="/" className="text-blue-600 hover:text-blue-700 hover:underline">
            ← חזרה
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow-md p-8 space-y-8">
          
          {/* סוג */}
          <div className="border-2 border-blue-100 rounded-lg p-6 bg-blue-50/30">
            <h3 className="text-lg font-semibold mb-4">סוג ייפוי הכוח</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'general', label: 'כללי', desc: 'לכל עניין משפטי' },
                { value: 'inheritance', label: 'ירושה', desc: 'רק לצו ירושה' },
                { value: 'court_case', label: 'תיק משפטי', desc: 'לתיק ספציפי' },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`
                    flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer
                    ${data.type === opt.value
                      ? 'border-blue-600 bg-blue-50 font-medium'
                      : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="type"
                    value={opt.value}
                    checked={data.type === opt.value}
                    onChange={(e) => setData({ ...data, type: e.target.value as any })}
                    className="sr-only"
                  />
                  <span className="font-semibold">{opt.label}</span>
                  <span className="text-xs text-gray-600 mt-1">{opt.desc}</span>
                </label>
              ))}
            </div>
          </div>

          {/* הלקוח */}
          <div className="border-2 border-green-100 rounded-lg p-6 bg-green-50/30">
            <h3 className="text-lg font-semibold mb-4">👤 הלקוח (נותן ייפוי הכוח)</h3>
            <div className="grid md:grid-cols-2 gap-4">
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

          {/* עורך הדין */}
          <div className="border-2 border-purple-100 rounded-lg p-6 bg-purple-50/30">
            <h3 className="text-lg font-semibold mb-4">⚖️ עורך הדין</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="שם"
                required
                value={data.attorney.name}
                onChange={(e) => setData({ ...data, attorney: { ...data.attorney, name: e.target.value } })}
                placeholder='עו"ד שם מלא'
              />
              <Input
                label="מספר רישיון"
                required
                value={data.attorney.licenseNumber}
                onChange={(e) => setData({ ...data, attorney: { ...data.attorney, licenseNumber: e.target.value } })}
              />
            </div>
          </div>

          {/* פרטים נוספים לפי סוג */}
          {data.type === 'inheritance' && (
            <div className="border-2 border-orange-100 rounded-lg p-6 bg-orange-50/30">
              <h3 className="text-lg font-semibold mb-4">📜 פרטי המנוח</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="שם המנוח"
                  required
                  value={data.specificMatter?.inheritance?.deceasedName || ''}
                  onChange={(e) => setData({
                    ...data,
                    specificMatter: {
                      ...data.specificMatter,
                      inheritance: {
                        deceasedName: e.target.value,
                        deceasedId: data.specificMatter?.inheritance?.deceasedId || '',
                        dateOfDeath: data.specificMatter?.inheritance?.dateOfDeath || '',
                      }
                    }
                  })}
                />
                <Input
                  label="תאריך פטירה"
                  type="date"
                  required
                  value={data.specificMatter?.inheritance?.dateOfDeath || ''}
                  onChange={(e) => setData({
                    ...data,
                    specificMatter: {
                      ...data.specificMatter,
                      inheritance: {
                        ...data.specificMatter?.inheritance!,
                        dateOfDeath: e.target.value,
                      }
                    }
                  })}
                />
              </div>
            </div>
          )}

          {data.type === 'court_case' && (
            <div className="border-2 border-orange-100 rounded-lg p-6 bg-orange-50/30">
              <h3 className="text-lg font-semibold mb-4">⚖️ פרטי התיק</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="מספר תיק"
                  value={data.specificMatter?.courtCase?.caseNumber || ''}
                  onChange={(e) => setData({
                    ...data,
                    specificMatter: {
                      ...data.specificMatter,
                      courtCase: {
                        ...data.specificMatter?.courtCase,
                        caseNumber: e.target.value,
                      }
                    }
                  })}
                  placeholder="אם קיים"
                />
                <Input
                  label="בית משפט"
                  value={data.specificMatter?.courtCase?.court || ''}
                  onChange={(e) => setData({
                    ...data,
                    specificMatter: {
                      ...data.specificMatter,
                      courtCase: {
                        ...data.specificMatter?.courtCase,
                        court: e.target.value,
                      }
                    }
                  })}
                />
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => {
                if (confirm('להתחיל מחדש?')) {
                  localStorage.removeItem('attorney-poa-draft');
                  setData(getInitialData());
                }
              }}
            >
              מחדש
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" size="lg" onClick={() => alert('בקרוב: Word')}>
                📄 הורד Word
              </Button>
              <Button variant="primary" size="lg" onClick={() => alert('בקרוב: PDF')}>
                📄 הורד PDF
              </Button>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
            <p className="font-medium">✓ נשמר אוטומטית</p>
          </div>
        </div>
      </main>
    </div>
  );
}

