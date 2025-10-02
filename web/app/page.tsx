'use client';

import Link from 'next/link';

interface Module {
  id: string;
  title: string;
  description: string;
  href: string;
  status: 'active' | 'beta' | 'coming-soon';
  icon: string;
}

type ModuleHref = Module['href'];

const modules: Module[] = [
  {
    id: 'improve-hebrew',
    title: 'שיפור עברית',
    description: 'התאמת טקסטי AI לעברית אמיתית',
    href: '/hebrew-improver',
    status: 'active',
    icon: '✍️'
  },
  {
    id: 'tzo-yerusha',
    title: 'צו ירושה',
    description: 'בקשה לצו ירושה עם חישוב חלקים',
    href: '/legal/inheritance-order',
    status: 'beta',
    icon: '⚖️'
  },
  {
    id: 'tzo-kiyum',
    title: 'צו קיום צוואה',
    description: 'בקשה לצו קיום צוואה',
    href: '/legal/probate-order',
    status: 'beta',
    icon: '📜'
  },
  {
    id: 'wills',
    title: 'צוואות',
    description: 'רגילה או הדדית',
    href: '/legal/wills',
    status: 'beta',
    icon: '📜'
  },
  {
    id: 'poa',
    title: 'ייפוי כוח',
    description: 'מסמכי ייפוי כוח',
    href: '/legal/poa',
    status: 'beta',
    icon: '🤝'
  },
  {
    id: 'pleadings',
    title: 'כתבי טענות',
    description: 'כתבי טענות משפטיים',
    href: '/legal/pleadings',
    status: 'active',
    icon: '📋'
  },
  {
    id: 'attorney-fee',
    title: 'הסכם שכר טרחה',
    description: 'הסכם עם עורך דין',
    href: '/legal/attorney-fee',
    status: 'beta',
    icon: '💼'
  },
  {
    id: 'guardianship',
    title: 'בקשת אפוטרופסות',
    description: 'מינוי אפוטרופוס לחסוי',
    href: '/legal/guardianship',
    status: 'beta',
    icon: '🛡️'
  },
  {
    id: 'attorney-poa',
    title: 'ייפוי כוח לעו״ד',
    description: 'מהלקוח לעורך הדין',
    href: '/legal/attorney-poa',
    status: 'beta',
    icon: '⚖️'
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">פלטפורמה משפטית מונעת AI</h1>
          <p className="text-gray-600 mt-2">כלים חכמים לעורכי דין ולאנשי מקצוע משפטיים</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">בחר מודול</h2>
          <p className="text-gray-600">לחץ על מודול כדי להתחיל</p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            module.status === 'coming-soon' ? (
              <div
                key={module.id}
                className={`
                  group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-2 border-transparent opacity-60 cursor-not-allowed
                `}
              >
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded">בקרוב</span>
        </div>

                {/* Icon */}
                <div className="text-5xl mb-4 mt-6">{module.icon}</div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {module.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {module.description}
                </p>
              </div>
            ) : (
              <Link
                key={module.id}
                href={module.href as any}
                className={`
                  group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-2 border-transparent hover:-translate-y-1
                  ${module.status === 'active' ? 'hover:border-blue-500' : 'hover:border-indigo-400'}
                `}
              >
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  {module.status === 'active' ? (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">פעיל</span>
                  ) : (
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">בטא</span>
                  )}
            </div>

                {/* Icon */}
                <div className="text-5xl mb-4 mt-6">{module.icon}</div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {module.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {module.description}
                </p>

                {/* Arrow */}
                <div className="mt-4 text-blue-600 group-hover:translate-x-1 transition-transform inline-flex items-center">
                  <span className="text-sm font-medium">פתח מודול</span>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
              </div>
              </Link>
            )
                ))}
              </div>

        {/* Info Box */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-md p-8 border border-blue-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">💡 תכונות הפלטפורמה</h3>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🧮</div>
              <h4 className="font-semibold text-gray-900 mb-1">חישובים אוטומטיים</h4>
              <p className="text-sm text-gray-600">חלקי יורשים, שכר טרחה, נכסים</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">💾</div>
              <h4 className="font-semibold text-gray-900 mb-1">שמירה אוטומטית</h4>
              <p className="text-sm text-gray-600">כל שינוי נשמר מיד</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">📄</div>
              <h4 className="font-semibold text-gray-900 mb-1">ייצוא מסמכים</h4>
              <p className="text-sm text-gray-600">PDF ו-Word עם RTL</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 bg-gray-50 border-t py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-600 text-sm">
          <p>פלטפורמה משפטית מונעת AI • {new Date().getFullYear()}</p>
        </div>
      </footer>
    </main>
  );
}

