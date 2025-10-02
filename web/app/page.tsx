'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1"></div>
            <div className="flex gap-3">
              <Link
                href="/clients"
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg font-medium"
              >
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>הלקוחות שלי</span>
              </Link>
              <Link
                href="/profile"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg font-medium"
              >
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>הפרופיל שלי</span>
              </Link>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              פלטפורמה ליצירת מסמכים משפטיים
            </h1>
            <p className="text-lg text-gray-600">
              צרו מסמכים משפטיים מקצועיים בקלות, בעברית תקנית ומדויקת
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Primary Actions - 3 Big Buttons */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            התחילו עכשיו
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Button 1: Attorney Fee Agreement */}
            <Link
              href="/legal/attorney-fee"
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-blue-200 hover:border-blue-500 hover:-translate-y-2"
            >
              <div className="text-6xl mb-4 text-center">💼</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center group-hover:text-blue-600 transition-colors">
                הסכם שכר טרחה
              </h3>
              <p className="text-gray-600 text-center mb-4">
                צרו הסכם שכר טרחה מקצועי עם חישוב אוטומטי של שכר מומלץ
              </p>
              <div className="text-center">
                <span className="inline-flex items-center text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                  <span>התחל</span>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </span>
              </div>
            </Link>

            {/* Button 2: Will Opposition */}
            <Link
              href="/legal/pleadings"
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-purple-200 hover:border-purple-500 hover:-translate-y-2"
            >
              <div className="text-6xl mb-4 text-center">⚖️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center group-hover:text-purple-600 transition-colors">
                התנגדות לצוואה
              </h3>
              <p className="text-gray-600 text-center mb-4">
                הגישו התנגדות לצוואה עם כל הנימוקים המשפטיים הנדרשים
              </p>
              <div className="text-center">
                <span className="inline-flex items-center text-purple-600 font-medium group-hover:translate-x-1 transition-transform">
                  <span>התחל</span>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </span>
              </div>
            </Link>

            {/* Button 3: More Documents */}
            <div className="group relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-transparent hover:-translate-y-2 cursor-pointer">
              <div className="text-6xl mb-4 text-center">📁</div>
              <h3 className="text-2xl font-bold text-white mb-3 text-center">
                עוד סוגי מסמכים
              </h3>
              <p className="text-indigo-100 text-center mb-4">
                צוואות, צווי ירושה, ייפוי כוח, ועוד מסמכים משפטיים
              </p>
              <div className="text-center">
                <span className="inline-flex items-center text-white font-medium">
                  <span>גלה עוד</span>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* How It Works - 3 Steps */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            כיצד זה עובד?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-full text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                בחרו סוג מסמך
              </h3>
              <p className="text-gray-600">
                לחצו על סוג המסמך שברצונכם ליצור - הסכם, צוואה, התנגדות או כל מסמך משפטי אחר
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500 text-white rounded-full text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                מלאו את הפרטים
              </h3>
              <p className="text-gray-600">
                השלימו את הפרטים הנדרשים בטופס פשוט ואינטואיטיבי. המערכת תציג תצוגה מקדימה בזמן אמת
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                ייצוא והדפסה
              </h3>
              <p className="text-gray-600">
                ייצאו את המסמך ל-PDF או Word, שלחו לחתימה דיגיטלית, או הדפיסו ישירות - הכל בעברית תקנית!
              </p>
            </div>

          </div>
        </section>

        {/* All Modules Grid */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              כל המודולים
            </h2>
            <Link 
              href="/hebrew-improver"
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              <span>שיפור עברית משפטית</span>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Wills */}
            <Link href="/legal/wills" className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border border-gray-200">
              <div className="text-4xl mb-3">📜</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">צוואות</h3>
              <p className="text-sm text-gray-600">צוואה יחיד או הדדית</p>
              <span className="inline-block mt-3 px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">
                בטא
              </span>
            </Link>

            {/* Inheritance Order */}
            <Link href="/legal/inheritance-order" className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border border-gray-200">
              <div className="text-4xl mb-3">⚖️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">צו ירושה</h3>
              <p className="text-sm text-gray-600">בקשה לצו ירושה</p>
              <span className="inline-block mt-3 px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">
                בטא
              </span>
            </Link>

            {/* Probate Order */}
            <Link href="/legal/probate-order" className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border border-gray-200">
              <div className="text-4xl mb-3">📋</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">צו קיום צוואה</h3>
              <p className="text-sm text-gray-600">בקשה לקיום צוואה</p>
              <span className="inline-block mt-3 px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">
                בטא
              </span>
            </Link>

            {/* POA */}
            <Link href="/legal/poa" className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border border-gray-200">
              <div className="text-4xl mb-3">✍️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">ייפוי כוח</h3>
              <p className="text-sm text-gray-600">ייפוי כוח כללי או מיוחד</p>
              <span className="inline-block mt-3 px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">
                בטא
              </span>
            </Link>

            {/* Attorney POA */}
            <Link href="/legal/attorney-poa" className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border border-gray-200">
              <div className="text-4xl mb-3">👔</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">ייפוי כוח לעו"ד</h3>
              <p className="text-sm text-gray-600">ייפוי כוח לעורך דין</p>
              <span className="inline-block mt-3 px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">
                בטא
              </span>
            </Link>

            {/* Guardianship */}
            <Link href="/legal/guardianship" className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border border-gray-200">
              <div className="text-4xl mb-3">👨‍👩‍👧</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">אפוטרופסות</h3>
              <p className="text-sm text-gray-600">בקשה למינוי אפוטרופוס</p>
              <span className="inline-block mt-3 px-3 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded-full">
                בקרוב
              </span>
            </Link>

            {/* Pleadings */}
            <Link href="/legal/pleadings" className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border border-gray-200">
              <div className="text-4xl mb-3">⚖️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">כתבי טענות</h3>
              <p className="text-sm text-gray-600">כתב תביעה או הגנה</p>
              <span className="inline-block mt-3 px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">
                בטא
              </span>
            </Link>

            {/* Attorney Fee */}
            <Link href="/legal/attorney-fee" className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border border-gray-200">
              <div className="text-4xl mb-3">💼</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">הסכם שכר טרחה</h3>
              <p className="text-sm text-gray-600">הסכם עם חישוב אוטומטי</p>
              <span className="inline-block mt-3 px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">
                בטא
              </span>
            </Link>

          </div>
        </section>

        {/* Features Highlight */}
        <section className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            💡 למה לבחור בפלטפורמה שלנו?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-3">✍️</div>
              <h3 className="font-bold text-gray-900 mb-2">עברית אמיתית</h3>
              <p className="text-gray-600 text-sm">
                מנוע AI מתקדם שמתקן עברית משפטית ומבטיח טקסט תקני ומקצועי
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-bold text-gray-900 mb-2">מהיר ופשוט</h3>
              <p className="text-gray-600 text-sm">
                ממשק אינטואיטיבי עם תצוגה מקדימה בזמן אמת וחישובים אוטומטיים
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="font-bold text-gray-900 mb-2">מאובטח ופרטי</h3>
              <p className="text-gray-600 text-sm">
                כל המידע נשמר בצורה מוצפנת ומאובטחת, עם גיבוי אוטומטי
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2025 פלטפורמה ליצירת מסמכים משפטיים | נבנה בישראל 🇮🇱
          </p>
        </div>
      </footer>

    </div>
  );
}
