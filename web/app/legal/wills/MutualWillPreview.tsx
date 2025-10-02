'use client';

import React from 'react';
import type { MutualWillData } from './types';

type Props = { data: MutualWillData };

export default function MutualWillPreview({ data }: Props) {
  const spouse1 = data.spouses[0];
  const spouse2 = data.spouses[1];
  
  return (
    <div className="bg-white border rounded-lg p-8 space-y-6" dir="rtl" style={{ fontFamily: 'Arial', textAlign: 'right', direction: 'rtl' }}>
      {/* כותרת */}
      <div style={{ textAlign: 'center', borderBottom: '2px solid #333', paddingBottom: '1rem', direction: 'rtl' }}>
        <h1 className="text-3xl font-bold mb-2" style={{ textAlign: 'center', direction: 'rtl' }}>צוואה הדדית</h1>
        <p className="text-sm text-gray-600" style={{ textAlign: 'center', direction: 'rtl' }}>
          נחתמה ביום: {data.date}
        </p>
      </div>

      {/* פתיחה */}
      <div className="text-base leading-relaxed space-y-3" style={{ textAlign: 'right', direction: 'rtl' }}>
        <p style={{ textAlign: 'right', direction: 'rtl' }}>בהיות אין אדם יודע יום פקודתו.</p>
        
        <p>
          וברצוננו לערוך צוואה הדדית בהתאם לסעיף 8א לחוק הירושה, תשכ"ה 1965, 
          ועל כל המשתמע מכך במסמך אחד, והדדית בתוכנה, בגין רכושנו וכל אשר לנו, 
          ולהביא בזה את רצוננו האחרון, ולפרט בה את הוראותינו על מה שיעשה ברכושנו 
          אחרי פטירתנו, ורצוננו הוא שינתן לצוואה זו תוקף חוקי, לכן, אנו החתומים מטה:
        </p>

        {/* פרטי המצווים */}
        <div className="pr-4 space-y-2 font-medium">
          <p>
            <strong>{spouse1.name}</strong>, נוש{spouse1.nickname ? 'א' : 'ה'} ת.ז. מס' <strong>{spouse1.id}</strong>
            {spouse1.nickname && ` (להלן: "${spouse1.nickname}")`} מרח': <strong>{spouse1.address}</strong>
          </p>
          <p>
            <strong>{spouse2.name}</strong>, נוש{spouse2.nickname ? 'א' : 'ה'} ת.ז. מס' <strong>{spouse2.id}</strong>
            {spouse2.nickname && ` (להלן: "${spouse2.nickname}")`} מרח': <strong>{spouse2.address}</strong>
          </p>
        </div>

        <p>
          בהיותנו בדעה צלולה וכשירים מכל הבחינות הדרושות על פי החוק ובידיעה ברורה את 
          אשר אנו עושים, מצווים בזה מרצוננו הטוב והגמור בלא כל אונס, הכרח ואיום, ובלא 
          השפעה מהזולת, תחבולה, או תרמית כדלקמן:
        </p>
      </div>

      {/* כללי */}
      <div>
        <h3 className="font-bold text-lg mb-3">כללי:</h3>
        
        <div className="space-y-4">
          {/* סעיפים סטנדרטיים */}
          <div className="pr-4">
            <p className="font-bold mb-2">
              .{data.standardClauses.marriage.number} <span className="underline">נישואין</span>
            </p>
            <p className="text-sm leading-relaxed">
              {data.standardClauses.marriage.text.replace('_____', data.marriageYear?.toString() || '_____')}
            </p>
          </div>

          <div className="pr-4">
            <p className="font-bold mb-2">
              .{data.standardClauses.revocation.number} <span className="underline">ביטול צוואות קודמות</span>
            </p>
            <p className="text-sm leading-relaxed">{data.standardClauses.revocation.text}</p>
          </div>

          <div className="pr-4">
            <p className="font-bold mb-2">
              .{data.standardClauses.debts.number} <span className="underline">תשלום חובות והוצאות</span>
            </p>
            <p className="text-sm leading-relaxed">{data.standardClauses.debts.text}</p>
          </div>

          <div className="pr-4">
            <p className="font-bold mb-2">
              .{data.standardClauses.rightToRevoke.number} <span className="underline">זכות ביטול</span>
            </p>
            <p className="text-sm leading-relaxed">{data.standardClauses.rightToRevoke.text}</p>
          </div>
        </div>
      </div>

      {/* היקף העיזבון */}
      <div className="border-t pt-4">
        <h3 className="font-bold text-lg mb-3">היקף העיזבון:</h3>
        
        <div className="pr-4">
          <p className="font-bold mb-2">
            .{data.standardClauses.estateScope.number} <span className="underline">תיאור הרכוש</span>
          </p>
          <p className="text-sm leading-relaxed mb-3">{data.standardClauses.estateScope.text}</p>
          
          {data.estate.assets.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium mb-3 pr-4">לרבות:</p>
              <div className="pr-6 space-y-3">
                {data.estate.assets.map((asset, idx) => (
                  <div key={idx} className="avoid-break">
                    <p className="text-sm">
                      <strong>{idx + 1}.</strong> {asset}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* הוראות חלוקת עיזבוננו - מיד אחרי היקף העיזבון */}
      {data.beneficiaries.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="font-bold text-lg mb-3">הוראות חלוקת עיזבוננו:</h3>
          
          <div className="pr-4">
            <p className="font-bold mb-2">
              .{5 + data.specialProvisions.length + 1}
            </p>
            <p className="text-sm leading-relaxed mb-3">
              {data.beneficiaries.length === 1 
                ? `במקרה בו שנינו נלך לבית עולמנו בעת ובעונה אחת ו/או לאחר פטירתו של זה מאיתנו שיאריך חיים מבינינו, הננו קובעים ומצווים כי כל רכושנו, המצוין לעיל, יעבור כמפורט להלן:`
                : 'במקרה בו שנינו נלך לבית עולמנו בעת ובעונה אחת ו/או לאחר פטירתו של זה מאיתנו שיאריך חיים מבינינו, הננו קובעים ומצווים כי כל רכושנו, המצוין לעיל, יעבור כמפורט להלן:'
              }
            </p>
            
            {/* תתי-סעיפים ליורשים */}
            <div className="space-y-4">
              {data.beneficiaries.map((ben, benIdx) => (
                <div key={benIdx} className="pr-6 avoid-break">
                  <p className="font-bold mb-2">
                    .{5 + data.specialProvisions.length + 1}.{benIdx + 1}
                  </p>
                  <p className="text-sm mb-2 leading-relaxed">
                    אנו מצווים ל{ben.relationship || 'יורש/ת שלנו'}{' '}
                    <strong>{ben.name}</strong>, הנוש{ben.name.endsWith('ה') || ben.name.endsWith('ת') ? 'א' : 'א'}ת תעודת זהות שמספרה{' '}
                    <strong>{ben.id}</strong>
                    {ben.name && ` (להלן: "${ben.name.split(' ')[0]}")`}
                    {ben.inheritanceDetails.length > 0 ? ' את הרכוש המצוין להלן:' : '.'}
                  </p>
                  
                  {/* תתי-תתי-סעיפים - פירוט הירושה */}
                  {ben.inheritanceDetails.length > 0 && (
                    <div className="pr-6 space-y-3 mt-2">
                      {ben.inheritanceDetails.map((detail, detailIdx) => (
                        detail && (
                          <div key={detailIdx} className="avoid-break">
                            <p className="font-bold text-sm mb-1">
                              .{5 + data.specialProvisions.length + 1}.{benIdx + 1}.{detailIdx + 1}
                            </p>
                            <p className="pr-4 text-sm leading-relaxed">{detail}</p>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* הוראות מיוחדות - לפני החלוקה (סעיפים 6, 7...) */}
      {data.specialProvisions.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="font-bold text-lg mb-3">הוראות מיוחדות:</h3>
          <div className="space-y-4">
            {data.specialProvisions.map((prov, provIdx) => (
              <div key={provIdx} className="pr-4 avoid-break">
                <p className="font-bold mb-2">.{prov.number}</p>
                <p className="text-sm leading-relaxed">{prov.text}</p>
                
                {/* תתי-סעיפים */}
                {prov.subItems && prov.subItems.length > 0 && (
                  <div className="pr-6 mt-2 space-y-2">
                    {prov.subItems.map((subItem, subIdx) => (
                      subItem && (
                        <div key={subIdx} className="avoid-break">
                          <p className="font-bold text-sm mb-1">.{prov.number}.{subIdx + 1}</p>
                          <p className="text-sm pr-4 leading-relaxed">{subItem}</p>
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* סעיף דרישה */}
      <div className="border-t pt-4">
        <div className="pr-4">
          <p className="font-bold mb-2">
            .{5 + data.specialProvisions.length + 1 + (data.beneficiaries.length > 0 ? 1 : 0) + 1}
          </p>
          <p className="text-sm leading-relaxed">{data.demandClause.text}</p>
        </div>
      </div>

      {/* סיום */}
      <div className="border-t pt-4 space-y-4">
        <h3 className="font-bold text-lg">סיום:</h3>
        
        {/* ברכה */}
        {data.closing.blessing && (
          <p className="text-sm leading-relaxed pr-4">{data.closing.blessing}</p>
        )}

        {/* הצהרת חתימה */}
        <p className="text-sm leading-relaxed pr-4">{data.closing.declaration}</p>
      </div>

      {/* חתימת המצווים */}
      <div className="border-t pt-6 mt-6">
        <p className="text-sm mb-4">היום: ____ בחודש _____ בשנה _____</p>
        
        <div className="grid grid-cols-2 gap-8 mt-6">
          {data.spouses.map((spouse, idx) => (
            <div key={idx} className="text-center">
              <div className="border-b-2 border-black mb-1"></div>
              <p className="text-sm font-medium">{spouse.name}</p>
              <p className="text-xs text-gray-600">ת.ז. {spouse.id}</p>
            </div>
          ))}
        </div>
      </div>

      {/* הצהרת עדים */}
      <div className="border-t pt-6 mt-6 space-y-4">
        <h3 className="font-bold text-center">הצהרת העדים</h3>
        
        <p className="text-sm">אנו הח"מ:</p>
        
        {data.witnesses.map((witness, idx) => (
          <div key={idx} className="text-sm pr-4">
            .{idx + 1} {witness.name}, ת.ז. {witness.id}, מרחוב {witness.address}
          </div>
        ))}

        <p className="text-sm leading-relaxed mt-4">
          מעידים/ות בזאת שהמצווים הנ"ל{' '}
          <strong>{spouse1.name}</strong> ו-<strong>{spouse2.name}</strong>{' '}
          חתמו בפנינו על צוואתם זו.
        </p>

        <p className="text-sm leading-relaxed">
          אנו מאשרים/ות בזאת כי כל אחד מאיתנו מעל גיל 18, וכי המצווים הצהירו בפנינו 
          כי זו היא צוואתם אשר נערכה ונחתמה על ידם, וכי הם חתמו על צוואה זו בפנינו 
          מרצונם הטוב והחופשי ובהיותם בדעה צלולה ומישובת ובלי כל סיוע או הכוונה 
          בנוכחות זה של זה.
        </p>

        <p className="text-sm mt-4">
          ולראיה באנו על החתום היום: ____ בחודש _____ בשנה _____
        </p>

        {/* חתימות עדים */}
        <div className="grid grid-cols-2 gap-8 mt-6">
          {data.witnesses.map((witness, idx) => (
            <div key={idx} className="text-center">
              <div className="border-b-2 border-black mb-1"></div>
              <p className="text-sm">{witness.name}</p>
              <p className="text-xs text-gray-600">עד {idx + 1}</p>
            </div>
          ))}
        </div>
      </div>

      {/* הערה על חתימה בכל עמוד */}
      <div className="border-t pt-4 mt-6 text-center">
        <p className="text-xs text-gray-500 italic">
          * בצוואה הסופית, שני המצווים חותמים בכל עמוד בנוסף לחתימה בסוף המסמך
        </p>
      </div>
    </div>
  );
}

