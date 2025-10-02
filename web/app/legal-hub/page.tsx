'use client';

import Link from 'next/link';
import { FileText, Scale, PenLine } from 'lucide-react';
import type { Route } from 'next';

export default function LegalHubPage() {
  type Card = {
    href: Route;
    title: string;
    description: string;
    Icon: typeof Scale;
    gradient: string;
  };
  const cards: Card[] = [
    {
      href: '/legal/wills' as Route,
      title: 'צוואות',
      description: 'יחיד, הדדיות ונאמנות – בנייה חכמה ומותאמת אישית',
      Icon: Scale,
      gradient: 'from-blue-600 to-indigo-600',
    },
    {
      href: '/legal/pleadings' as Route,
      title: 'כתבי טענות',
      description: 'אזרחי, מסחרי, עבודה ומשפחה – תבניות מקצועיות',
      Icon: FileText,
      gradient: 'from-slate-700 to-gray-900',
    },
    {
      href: '/legal/poa' as Route,
      title: 'ייפויי כוח',
      description: 'כללי, מיוחד, בנקאי ונדל"ן – יצירה מהירה ונקייה',
      Icon: PenLine,
      gradient: 'from-emerald-600 to-teal-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="border-b bg-white/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">מרכז מסמכים משפטיים</h1>
              <p className="text-sm text-gray-600">כלים מקצועיים לעורכי דין בישראל</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">בחרו מודול להתחלה</h2>
          <p className="text-gray-600">תוכלו לשנות ולהתאים כל מסמך בזמן אמת</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cards.map(({ href, title, description, Icon, gradient }) => (
            <Link key={href} href={href} className="group">
              <div className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition-shadow overflow-hidden">
                <div className={`p-8 text-white bg-gradient-to-br ${gradient}`}>
                  <div className="flex items-center justify-between">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="mt-6 text-2xl font-bold">{title}</h3>
                  <p className="mt-2 text-white/90 text-sm">{description}</p>
                </div>
                <div className="p-6 text-left">
                  <span className="text-sm font-medium text-blue-700 group-hover:text-blue-800">
                    כניסה למודול →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}


