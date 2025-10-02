'use client';

import { Button } from '../../../components/ui/Button';
import { InheritanceOrderData } from './types';
import { calculateInheritanceShares } from '../../../lib/calculations/inheritance-shares';

interface SummaryViewProps {
  data: InheritanceOrderData;
  onBack: () => void;
  onEdit: (step: 1 | 2 | 3) => void;
}

export function SummaryView({ data, onBack, onEdit }: SummaryViewProps) {
  // חישוב אוטומטי של חלקי היורשים
  const calculation = calculateInheritanceShares(
    data.hasSpouse,
    data.childrenCount,
    data.hasFather,
    data.hasMother,
    data.siblingsCount
  );

  const handleDownloadPDF = () => {
    alert('בקרוב: PDF');
  };

  const handleDownloadWord = async () => {
    try {
      const { exportInheritanceOrderToWord } = await import('../../../lib/export/inheritance-order-word');
      await exportInheritanceOrderToWord(data);
    } catch (e) {
      alert('שגיאה בייצוא Word');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">סיכום</h2>
        <p className="text-gray-600">בדוק שהכל נכון</p>
      </div>

      {/* פרטי המבקש */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">פרטי המבקש</h3>
          <Button variant="outline" size="sm" onClick={() => onEdit(1)}>
            ערוך
          </Button>
        </div>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">שם</dt>
            <dd className="font-medium">{data.applicant.name}</dd>
          </div>
          <div>
            <dt className="text-gray-500">תעודת זהות</dt>
            <dd className="font-medium">{data.applicant.id}</dd>
          </div>
          <div>
            <dt className="text-gray-500">אימייל</dt>
            <dd className="font-medium">{data.applicant.email}</dd>
          </div>
          <div>
            <dt className="text-gray-500">טלפון</dt>
            <dd className="font-medium">{data.applicant.phone}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-gray-500">קרבה למנוח</dt>
            <dd className="font-medium">{data.applicant.relationship}</dd>
          </div>
        </dl>
      </div>

      {/* פרטי המנוח */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">פרטי המנוח/ה</h3>
          <Button variant="outline" size="sm" onClick={() => onEdit(2)}>
            ערוך
          </Button>
        </div>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">שם</dt>
            <dd className="font-medium">{data.deceased.name}</dd>
          </div>
          <div>
            <dt className="text-gray-500">תעודת זהות</dt>
            <dd className="font-medium">{data.deceased.id}</dd>
          </div>
          <div>
            <dt className="text-gray-500">תאריך פטירה</dt>
            <dd className="font-medium">{data.deceased.deathDate}</dd>
          </div>
          <div>
            <dt className="text-gray-500">מצב משפחתי</dt>
            <dd className="font-medium">{data.deceased.maritalStatus}</dd>
          </div>
        </dl>
      </div>

      {/* משפחה */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">משפחה ויורשים</h3>
          <Button variant="outline" size="sm" onClick={() => onEdit(3)}>
            ערוך
          </Button>
        </div>

        {/* בן זוג */}
        {data.hasSpouse && data.spouse && (
          <div className="mb-4 pb-4 border-b">
            <h4 className="font-semibold text-blue-700 mb-2">💑 בן/בת זוג</h4>
            <div className="text-sm space-y-1 pr-4">
              <p><span className="text-gray-500">שם:</span> <span className="font-medium">{data.spouse.name}</span></p>
              <p><span className="text-gray-500">ת.ז:</span> <span className="font-medium">{data.spouse.id}</span></p>
              {data.spouse.address && (
                <p><span className="text-gray-500">כתובת:</span> <span className="font-medium">{data.spouse.address}</span></p>
              )}
            </div>
          </div>
        )}

        {/* ילדים */}
        {data.childrenCount > 0 && (
          <div className="mb-4 pb-4 border-b">
            <h4 className="font-semibold text-green-700 mb-2">👶 ילדים ({data.childrenCount})</h4>
            <div className="space-y-3">
              {data.children.map((child, i) => (
                <div key={i} className="bg-white rounded p-3 text-sm">
                  <p className="font-semibold">{i + 1}. {child.name || `ילד/ה ${i + 1}`}</p>
                  {child.id && <p className="text-gray-600">ת.ז: {child.id}</p>}
                  {child.address && <p className="text-gray-600 text-xs">{child.address}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* הורים */}
        {(data.hasFather || data.hasMother) && (
          <div className="mb-4 pb-4 border-b">
            <h4 className="font-semibold text-purple-700 mb-2">👴👵 הורים</h4>
            <div className="space-y-2 text-sm pr-4">
              {data.hasFather && data.father && (
                <div className="bg-white rounded p-2">
                  <p className="font-semibold">אב: {data.father.name}</p>
                  {data.father.id && <p className="text-gray-600">ת.ז: {data.father.id}</p>}
                </div>
              )}
              {data.hasMother && data.mother && (
                <div className="bg-white rounded p-2">
                  <p className="font-semibold">אם: {data.mother.name}</p>
                  {data.mother.id && <p className="text-gray-600">ת.ז: {data.mother.id}</p>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* אחים */}
        {data.siblingsCount > 0 && (
          <div>
            <h4 className="font-semibold text-orange-700 mb-2">👫 אחים/אחיות ({data.siblingsCount})</h4>
            <div className="space-y-2">
              {data.siblings.map((sibling, i) => (
                <div key={i} className="bg-white rounded p-3 text-sm">
                  <p className="font-semibold">{i + 1}. {sibling.name || `אח/אחות ${i + 1}`}</p>
                  {sibling.id && <p className="text-gray-600">ת.ז: {sibling.id}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {!data.hasSpouse && data.childrenCount === 0 && !data.hasFather && !data.hasMother && data.siblingsCount === 0 && (
          <p className="text-gray-500 text-sm italic">אין בני משפחה</p>
        )}
      </div>

      {/* חישוב אוטומטי של חלקים */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">
          🧮 חלוקה לפי חוק הירושה
        </h3>

        {/* הסברים */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <h4 className="font-medium text-gray-900 mb-2">הסבר:</h4>
          <ul className="space-y-1 text-sm text-gray-700">
            {calculation.explanations.map((exp, i) => (
              <li key={i}>• {exp}</li>
            ))}
          </ul>
        </div>

        {/* טבלת יורשים */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-100">
                <th className="px-4 py-2 text-right font-semibold">יורש</th>
                <th className="px-4 py-2 text-right font-semibold">קרבה</th>
                <th className="px-4 py-2 text-center font-semibold">חלק (%)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {calculation.heirs.map((heir, i) => (
                <tr key={i}>
                  <td className="px-4 py-3">{heir.name}</td>
                  <td className="px-4 py-3 text-gray-600">{heir.relationship}</td>
                  <td className="px-4 py-3 text-center font-semibold text-blue-700">
                    {heir.share}%
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-blue-100 font-bold">
                <td className="px-4 py-3" colSpan={2}>סה"כ</td>
                <td className="px-4 py-3 text-center">100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* כפתורי פעולה */}
      <div className="flex justify-between items-center pt-4 border-t">
        <Button variant="outline" onClick={onBack}>
          → חזור
        </Button>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              const confirmed = confirm('להתחיל מחדש?');
              if (confirmed) {
                localStorage.removeItem('inheritance-order-draft');
                window.location.reload();
              }
            }}
          >
            מחדש
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" size="lg" onClick={handleDownloadWord}>
              📄 Word
            </Button>
            <Button variant="primary" size="lg" onClick={handleDownloadPDF}>
              📄 PDF
            </Button>
          </div>
        </div>
      </div>

      {/* הערת שמירה */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
        <p className="font-medium">✓ נשמר אוטומטית</p>
      </div>
    </div>
  );
}

