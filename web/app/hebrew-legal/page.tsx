'use client';

import React, { useMemo, useState } from 'react';
import { 
  Home, 
  FileEdit, 
  FileText, 
  ArrowRight, 
  ArrowLeft, 
  Download, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Scale,
  Users,
  Building
} from 'lucide-react';

import { TERMS_DATABASE } from './terms';
import { buildWholeWordRegex, highlightOccurrences } from './utils';

const HebrewLegalPlatform = () => {
  type Correction = { original: string; corrected: string; comment: string };
  type TextCorrectionState = {
    originalText: string;
    correctedText: string;
    isProcessing: boolean;
    corrections: Correction[];
  };
  const [currentModule, setCurrentModule] = useState('home');
  const [textCorrectionData, setTextCorrectionData] = useState<TextCorrectionState>({
    originalText: '',
    correctedText: '',
    isProcessing: false,
    corrections: []
  });
  
  // State עבור מודול הצוואות (מהקוד הקודם)
  const [willData, setWillData] = useState({
    fullName: '',
    idNumber: '',
    street: '',
    city: '',
    numChildren: 3,
    children: ['', '', ''],
    excludedPerson: '',
    assets: {
      apartment: { enabled: true, address: '', city: '', block: '', plot: '', subPlot: '' },
      bankAccount: { enabled: true, bank: '', branch: '', account: '' },
      cash: { enabled: true },
      jewelry: { enabled: true },
      vehicle: { enabled: false },
      digital: { enabled: true }
    },
    witnesses: [
      { name: '', id: '', address: '' },
      { name: '', id: '', address: '' }
    ],
    date: new Date().toISOString().split('T')[0]
  });

  const [activeWillSection, setActiveWillSection] = useState('personal');
  const [showWillPreview, setShowWillPreview] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // בניית רשימת ביטויים לכל הקטגוריות
  const allTerms = useMemo(() => {
    return Object.values(TERMS_DATABASE).flat();
  }, []);

  const correctText = () => {
    setTextCorrectionData(prev => ({ ...prev, isProcessing: true, corrections: [] }));

    let correctedText = textCorrectionData.originalText;
    const corrections: Correction[] = [];

    // נעדיף תמיד את התיקון הראשון (דטרמיניסטי) ברשימת after
    for (const term of allTerms) {
      const regex = buildWholeWordRegex(term.before);
      if (regex.test(correctedText)) {
        correctedText = correctedText.replace(regex, term.after[0]);
        corrections.push({ original: term.before, corrected: term.after[0], comment: term.comment });
      }
    }

    setTimeout(() => {
      setTextCorrectionData(prev => ({
        ...prev,
        correctedText,
        isProcessing: false,
        corrections
      }));
    }, 300); // קצר ומהיר
  };

  // פונקציה להעתקת טקסט
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  // פונקציות מודול הצוואות (מהקוד הקודם)
  const updateChildrenCount = (count: number) => {
    const newChildren = Array(count).fill('').map((_, i) => willData.children[i] || '');
    setWillData(prev => ({ ...prev, numChildren: count, children: newChildren }));
  };

  const updateChildName = (index: number, name: string) => {
    const newChildren = [...willData.children];
    newChildren[index] = name;
    setWillData(prev => ({ ...prev, children: newChildren }));
  };

  const updateAsset = (assetType: string, field: string, value: any) => {
    setWillData(prev => ({
      ...prev,
      assets: { ...prev.assets, [assetType]: { ...prev.assets[assetType as keyof typeof prev.assets], [field]: value } }
    }));
  };

  const updateWitness = (index: number, field: string, value: string) => {
    const newWitnesses = [...willData.witnesses];
    newWitnesses[index] = { ...newWitnesses[index], [field]: value } as any;
    setWillData(prev => ({ ...prev, witnesses: newWitnesses }));
  };

  const generateWill = () => {
    const today = new Date(willData.date);
    const hebrewMonths = [
      'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
      'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
    ];
    const dateStr = `${today.getDate()}, בחודש ${hebrewMonths[today.getMonth()]} ${today.getFullYear()}`;
    const inheritance = willData.numChildren === 1 ? 'את כל רכושי' :
                       willData.numChildren === 2 ? 'בחלקים שווים - מחצית (1/2) לכל אחד' :
                       willData.numChildren === 3 ? 'בחלקים שווים - שליש (1/3) לכל אחד' :
                       willData.numChildren === 4 ? 'בחלקים שווים - רבע (1/4) לכל אחד' :
                       'בחלקים שווים';

    return `צוואה

הואיל כי אין אדם יודע את יום פקודתו;
והואיל כי ברצוני לערוך את צוואתי, ולפרט את רצוני האחרון והוראותיי בכל הקשור לאשר ייעשה ברכושי לאחר פטירתי, לאחר אריכות ימים ושנים;
והואיל כי הנני למעלה מגיל שמונה עשרה שנים, אזרחית ישראלית ותושבת מדינת ישראל;

לפיכך אני הח"מ ${willData.fullName}, ת"ז ${willData.idNumber}. מרחוב: ${willData.street}, ${willData.city}, לאחר שיקול דעת, ובהיותי בדעה צלולה ובכושר גמור להבחין בטיבה של צוואה, הנני מצווה בזאת בדעה מוגמרת וללא כל השפעה בלתי הוגנת עליי מצד כלשהו, את מה שייעשה ברכושי לאחר מותי, קובעת ומצהירה כמפורט להלן:

1. למען הסר ספק, אני מבטלת בזה ביטול גמור, מוחלט ושלם, כל צוואה ו/או הוראה שנתתי בעבר לפני תאריך חתימה על צוואה זו, בין בכתב ובין בעל פה בקשור לרכושי ולנכסיי.

2. אני מורה ליורשיי אשר יבצעו את צוואתי לשלם מתוך עיזבוני את כל חובותיי שיעמדו לפירעון בעת פטירתי, הוצאות הבאתי לארץ אם פטירתי תהא בחו"ל והוצאות קבורתי, כולל הקמת מצבה מתאימה על קברי וכן כל ההוצאות הכרוכות במתן צו לקיום צוואתי.

3. צוואתי זו חלה ותחול על כל רכושי מכל מין וסוג, בין בארץ ובין בחו"ל, ללא יוצא מן הכלל, בין אם הוא בבעלותי הבלעדית ובין אם בבעלותי המשותפת עם אחרים.

4. יש לי ${willData.numChildren} ילדים: ${willData.children.filter(name => name.trim()).join(', ')}.

6. הנני מצווה ומורישה לילדיי ${inheritance} כמפורט להלן:
${willData.children.map((child, index) => 
  child.trim() ? `6.${index + 1} ${willData.numChildren === 1 ? 'את כל רכושי' : 
                  willData.numChildren === 2 ? 'מחצית (1/2)' :
                  willData.numChildren === 3 ? 'שליש (1/3)' :
                  willData.numChildren === 4 ? 'רבע (1/4)' : 
                  `חלק שווה`} – ${child}` : ''
).filter(Boolean).join('\n')}

נחתם בעיר: ${willData.city} היום, ${dateStr}

                                    _________________
                                        ${willData.fullName}

אנו הח"מ:
1. ${willData.witnesses[0].name} ת"ז ${willData.witnesses[0].id}, מרחוב: ${willData.witnesses[0].address}
2. ${willData.witnesses[1].name} ת"ז ${willData.witnesses[1].id}, מרחוב: ${willData.witnesses[1].address}`;
  };

  const modules = [
    {
      id: 'correction',
      title: 'תיקון טקסטים לעברית',
      description: 'המר "אנגלית מתורגמת" לעברית טבעית מדוברת',
      icon: <Sparkles className="w-8 h-8" />,
      color: 'from-purple-600 to-pink-600',
      users: ['כותבי תוכן', 'חברות', 'משרדי פרסום']
    },
    {
      id: 'documents',
      title: 'יצירת מסמכים משפטיים',
      description: 'צור צוואות, כתבי טענות והסכמים בעברית מקצועית',
      icon: <Scale className="w-8 h-8" />,
      color: 'from-blue-600 to-indigo-600',
      users: ['עורכי דין', 'לשכות עו"ד', 'אנשים פרטיים']
    }
  ];

  const renderHome = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">עברית טבעית</h1>
                <p className="text-sm text-gray-600">פלטפורמה משפטית מתקדמת</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                עורכי דין וכותבי תוכן
              </span>
              <span className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                תוצאות מקצועיות
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            הפלטפורמה הישראלית הראשונה
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              לעברית טבעית ומשפט דיגיטלי
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            סיימו עם "אנגלית מתורגמת לעברית" וצרו מסמכים משפטיים מקצועיים 
            בעברית טבעית מדוברת תוך דקות ספורות
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {modules.map(module => (
            <div 
              key={module.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              onClick={() => setCurrentModule(module.id)}
            >
              <div className={`p-8 bg-gradient-to-br ${module.color} rounded-t-2xl text-white`}>
                <div className="flex items-center justify-between mb-4">
                  {module.icon}
                  <ArrowLeft className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{module.title}</h3>
                <p className="text-white/90">{module.description}</p>
              </div>
              
              <div className="p-8">
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">מיועד עבור:</h4>
                  <div className="flex flex-wrap gap-2">
                    {module.users.map((user, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {user}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button 
                  className={`w-full py-3 px-6 bg-gradient-to-r ${module.color} text-white rounded-lg font-semibold hover:opacity-90 transition-opacity`}
                  onClick={() => setCurrentModule(module.id)}
                >
                  התחל עכשיו
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">תוצאות מיידיות</h3>
            <p className="text-gray-600">קבל מסמכים מושלמים תוך דקות ספורות</p>
          </div>
          
          <div className="p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">עברית טבעית אמיתית</h3>
            <p className="text-gray-600">לא עוד תרגומים מכשולים מאנגלית</p>
          </div>
          
          <div className="p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Scale className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">תקינות משפטית</h3>
            <p className="text-gray-600">מסמכים עומדים בכל התקנים הישראליים</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTextCorrection = () => (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => setCurrentModule('home')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
            חזור לדף הבית
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-800">תיקון טקסטים לעברית טבעית</h1>
          </div>
        </div>
        <p className="text-gray-600 text-center">
          הכנס טקסט שנכתב על ידי AI (ChatGPT, Claude, Gemini) וקבל גרסה בעברית טבעית מדוברת
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-right">טקסט מקורי</h2>
          <textarea
            value={textCorrectionData.originalText}
            onChange={(e) => setTextCorrectionData(prev => ({ ...prev, originalText: (e.target as HTMLTextAreaElement).value }))}
            placeholder="הדבק כאן טקסט שנוצר על ידי ChatGPT, Claude או Gemini..."
            className="w-full h-64 p-4 border rounded-lg resize-none text-right"
            disabled={textCorrectionData.isProcessing}
          />
          
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-500">
              {textCorrectionData.originalText.length} תווים
            </span>
            <button
              onClick={correctText}
              disabled={!textCorrectionData.originalText.trim() || textCorrectionData.isProcessing}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {textCorrectionData.isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  מתקן...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  תקן לעברית טבעית
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 text-right">טקסט מתוקן</h2>
            {textCorrectionData.correctedText && (
              <button
                onClick={() => copyToClipboard(textCorrectionData.correctedText)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                {copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copySuccess ? 'הועתק!' : 'העתק'}
              </button>
            )}
          </div>
          
          <div className="h-64 p-4 bg-gray-50 rounded-lg text-right overflow-y-auto">
            {textCorrectionData.correctedText ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">לפני</h4>
                  <div className="prose prose-sm max-w-none rtl text-right" dangerouslySetInnerHTML={{
                    __html: highlightOccurrences(textCorrectionData.originalText, textCorrectionData.corrections.map(c => c.original))
                  }} />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">אחרי</h4>
                  <div className="prose prose-sm max-w-none rtl text-right" dangerouslySetInnerHTML={{
                    __html: highlightOccurrences(textCorrectionData.correctedText, textCorrectionData.corrections.map(c => c.corrected), 'bg-green-100')
                  }} />
                </div>
              </div>
            ) : (
              <p className="text-gray-400 italic">הטקסט המתוקן יופיע כאן...</p>
            )}
          </div>
        </div>
      </div>

      {/* Corrections Summary */}
      {textCorrectionData.corrections.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-right">תיקונים שבוצעו</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {textCorrectionData.corrections.map((correction, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">מקורי:</p>
                  <p className="font-medium text-red-600 mb-2">{correction.original}</p>
                  <p className="text-sm text-gray-500 mb-1">תיקון:</p>
                  <p className="font-medium text-green-600 mb-2">{correction.corrected}</p>
                  <p className="text-xs text-gray-400">{correction.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderWillGenerator = () => {
    const willSections = [
      { id: 'personal', title: 'פרטים אישיים', icon: '👤' },
      { id: 'family', title: 'משפחה', icon: '👨‍👩‍👧‍👦' },
      { id: 'assets', title: 'נכסים', icon: '🏠' },
      { id: 'witnesses', title: 'עדים', icon: '✍️' }
    ];

    const SectionHeader = ({ section, isActive, onClick }: any) => (
      <button
        onClick={() => onClick(section.id)}
        className={`w-full p-4 text-right rounded-lg transition-all ${
          isActive 
            ? 'bg-blue-50 border-2 border-blue-300 text-blue-800' 
            : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
        }`}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">{section.icon}</span>
            <span className="font-semibold">{section.title}</span>
          </div>
          {isActive ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>
    );

    return (
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => setCurrentModule('home')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
              חזור לדף הבית
            </button>
            <div className="flex items-center gap-2">
              <Scale className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">מחולל צוואות עברית</h1>
            </div>
          </div>
          <p className="text-gray-600 text-center">
            צור צוואה משפטית מקצועית בעברית טבעית תוך מילוי טופס פשוט
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-4">
            {willSections.map(section => (
              <div key={section.id}>
                <SectionHeader 
                  section={section}
                  isActive={activeWillSection === section.id}
                  onClick={setActiveWillSection}
                />
                
                {activeWillSection === section.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                    
                    {/* Personal Details */}
                    {section.id === 'personal' && (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={willData.fullName}
                          onChange={(e) => setWillData(prev => ({ ...prev, fullName: (e.target as HTMLInputElement).value }))}
                          className="w-full p-3 border rounded-lg text-right"
                          placeholder="שם מלא"
                        />
                        <input
                          type="text"
                          value={willData.idNumber}
                          onChange={(e) => setWillData(prev => ({ ...prev, idNumber: (e.target as HTMLInputElement).value }))}
                          className="w-full p-3 border rounded-lg text-right"
                          placeholder="מספר תעודת זהות"
                        />
                        <input
                          type="text"
                          value={willData.street}
                          onChange={(e) => setWillData(prev => ({ ...prev, street: (e.target as HTMLInputElement).value }))}
                          className="w-full p-3 border rounded-lg text-right"
                          placeholder="כתובת רחוב"
                        />
                        <input
                          type="text"
                          value={willData.city}
                          onChange={(e) => setWillData(prev => ({ ...prev, city: (e.target as HTMLInputElement).value }))}
                          className="w-full p-3 border rounded-lg text-right"
                          placeholder="עיר מגורים"
                        />
                      </div>
                    )}

                    {/* Family */}
                    {section.id === 'family' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-right text-sm font-medium text-gray-700 mb-2">
                            מספר ילדים
                          </label>
                          <select
                            value={willData.numChildren}
                            onChange={(e) => updateChildrenCount(parseInt((e.target as HTMLSelectElement).value))}
                            className="w-full p-3 border rounded-lg text-right"
                          >
                            {[1,2,3,4,5].map(num => (
                              <option key={num} value={num}>{num}</option>
                            ))}
                          </select>
                        </div>
                        
                        {willData.children.map((child, index) => (
                          <div key={index}>
                            <label className="block text-right text-sm font-medium text-gray-700 mb-1">
                              שם ילד/ה {index + 1}
                            </label>
                            <input
                              type="text"
                              value={child}
                              onChange={(e) => updateChildName(index, (e.target as HTMLInputElement).value)}
                              className="w-full p-3 border rounded-lg text-right"
                              placeholder="שם מלא"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Assets - simplified version */}
                    {section.id === 'assets' && (
                      <div className="space-y-4">
                        {/* Apartment */}
                        <div className="border-b pb-4">
                          <label className="flex items-center text-right mb-3">
                            <input
                              type="checkbox"
                              checked={willData.assets.apartment.enabled}
                              onChange={(e) => updateAsset('apartment', 'enabled', (e.target as HTMLInputElement).checked)}
                              className="ml-2"
                            />
                            <span className="font-medium">🏠 דירת מגורים</span>
                          </label>
                          
                          {willData.assets.apartment.enabled && (
                            <div className="space-y-2">
                              <input
                                type="text"
                                placeholder="כתובת הדירה"
                                value={willData.assets.apartment.address}
                                onChange={(e) => updateAsset('apartment', 'address', (e.target as HTMLInputElement).value)}
                                className="w-full p-2 border rounded text-right"
                              />
                              <input
                                type="text"
                                placeholder="עיר"
                                value={willData.assets.apartment.city}
                                onChange={(e) => updateAsset('apartment', 'city', (e.target as HTMLInputElement).value)}
                                className="w-full p-2 border rounded text-right"
                              />
                            </div>
                          )}
                        </div>

                        {/* Bank Account */}
                        <div className="border-b pb-4">
                          <label className="flex items-center text-right mb-3">
                            <input
                              type="checkbox"
                              checked={willData.assets.bankAccount.enabled}
                              onChange={(e) => updateAsset('bankAccount', 'enabled', (e.target as HTMLInputElement).checked)}
                              className="ml-2"
                            />
                            <span className="font-medium">🏦 חשבון בנק</span>
                          </label>
                          
                          {willData.assets.bankAccount.enabled && (
                            <div className="space-y-2">
                              <input
                                type="text"
                                placeholder="שם הבנק"
                                value={willData.assets.bankAccount.bank}
                                onChange={(e) => updateAsset('bankAccount', 'bank', (e.target as HTMLInputElement).value)}
                                className="w-full p-2 border rounded text-right"
                              />
                            </div>
                          )}
                        </div>

                        {/* Other assets as checkboxes */}
                        {[
                          { key: 'cash', label: '💰 כספים במזומן' },
                          { key: 'jewelry', label: '💎 תכשיטים' },
                          { key: 'vehicle', label: '🚗 רכב' },
                          { key: 'digital', label: '💻 נכסים דיגיטליים' }
                        ].map((asset: any) => (
                          <div key={asset.key}>
                            <label className="flex items-center text-right">
                              <input
                                type="checkbox"
                                checked={(willData.assets as any)[asset.key].enabled}
                                onChange={(e) => updateAsset(asset.key, 'enabled', (e.target as HTMLInputElement).checked)}
                                className="ml-2"
                              />
                              <span className="font-medium">{asset.label}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Witnesses */}
                    {section.id === 'witnesses' && (
                      <div className="space-y-6">
                        {willData.witnesses.map((witness, index) => (
                          <div key={index} className="border-b pb-4">
                            <h4 className="font-medium mb-3 text-right">עד {index + 1}</h4>
                            <div className="space-y-3">
                              <input
                                type="text"
                                placeholder="שם מלא"
                                value={witness.name}
                                onChange={(e) => updateWitness(index, 'name', (e.target as HTMLInputElement).value)}
                                className="w-full p-3 border rounded-lg text-right"
                              />
                              <input
                                type="text"
                                placeholder="מספר תעודת זהות"
                                value={witness.id}
                                onChange={(e) => updateWitness(index, 'id', (e.target as HTMLInputElement).value)}
                                className="w-full p-3 border rounded-lg text-right"
                              />
                              <input
                                type="text"
                                placeholder="כתובת מלאה"
                                value={witness.address}
                                onChange={(e) => updateWitness(index, 'address', (e.target as HTMLInputElement).value)}
                                className="w-full p-3 border rounded-lg text-right"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {/* Buttons */}
            <div className="mt-8">
              <button
                onClick={() => setShowWillPreview(!showWillPreview)}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <FileText size={20} />
                {showWillPreview ? 'הסתר תצוגה מקדימה' : 'הצג תצוגה מקדימה'}
              </button>
            </div>
          </div>

          {/* Preview */}
          {showWillPreview && (
            <div className="bg-white border rounded-lg">
              <div className="p-4 bg-gray-100 border-b flex items-center justify-between">
                <h3 className="font-semibold text-right">תצוגה מקדימה - צוואה</h3>
                <button
                  onClick={() => {
                    const element = document.createElement('a');
                    const file = new Blob([generateWill()], { type: 'text/plain;charset=utf-8' });
                    element.href = URL.createObjectURL(file);
                    element.download = `צוואה_${willData.fullName || 'ללא_שם'}.txt`;
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                  }}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  <Download size={16} />
                  הורד קובץ
                </button>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm text-right whitespace-pre-wrap font-mono leading-relaxed">
                  {generateWill()}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Main Render
  switch (currentModule) {
    case 'correction':
      return renderTextCorrection();
    case 'documents':
      return renderWillGenerator();
    default:
      return renderHome();
  }
};

export default HebrewLegalPlatform;


