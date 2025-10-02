'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getInitialData, PowerOfAttorneyData } from './types';
import { PoaForm } from './PoaForm';
import { Button } from '../../../components/ui/Button';

export default function PoaModulePage() {
  const [data, setData] = useState<PowerOfAttorneyData>(getInitialData());

  useEffect(() => {
    const saved = localStorage.getItem('poa-draft');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('poa-draft', JSON.stringify(data));
  }, [data]);

  const handleReset = () => {
    if (confirm('להתחיל מחדש?')) {
      localStorage.removeItem('poa-draft');
      setData(getInitialData());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ייפוי כוח</h1>
            <p className="text-sm text-gray-600 mt-1">מסמך ייפוי כוח</p>
          </div>
          <Link href="/" className="text-blue-600 hover:text-blue-700 hover:underline">
            ← חזרה
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow-md p-8">
          <PoaForm data={data} onUpdate={setData} />

          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <Button variant="outline" onClick={handleReset}>
              מחדש
            </Button>
            <Button variant="primary" size="lg" onClick={() => alert('בקרוב: PDF')}>
              📄 הורד PDF
            </Button>
          </div>

          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
            <p className="font-medium">✓ נשמר אוטומטית</p>
          </div>
        </div>
      </main>
    </div>
  );
}


