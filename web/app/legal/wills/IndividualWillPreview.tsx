'use client';

import React from 'react';
import type { IndividualWillData } from './types';
import { getGenderedText } from './types';

type Props = { data: IndividualWillData };

export default function IndividualWillPreview({ data }: Props) {
  const gender = data.testator.gender;
  
  const getText = (text: string) => getGenderedText(text, gender);
  
  return (
    <div className="bg-white border rounded-lg p-8 space-y-6" dir="rtl" style={{ fontFamily: 'Arial', textAlign: 'right', direction: 'rtl' }}>
      {/* כותרת */}
      <div style={{ textAlign: 'center', borderBottom: '2px solid #333', paddingBottom: '1rem', direction: 'rtl' }}>
        <h1 className="text-3xl font-bold mb-2" style={{ textAlign: 'center', direction: 'rtl' }}>צוואה</h1>
        <p className="text-sm text-gray-600" style={{ textAlign: 'center', direction: 'rtl' }}>
          נחתם{gender === 'female' ? 'ה' : ''} ביום: {data.date}
        </p>
      </div>

      {/* פתיחה */}
      <div className="text-base leading-relaxed" style={{ textAlign: 'right', direction: 'rtl' }}>
        <p className="mb-3" style={{ textAlign: 'right', direction: 'rtl' }}>הואיל כי אין אדם יודע את יום פקודתו;</p>
        <p className="mb-3" style={{ textAlign: 'right', direction: 'rtl' }}>
          והואיל כי ברצוני לערוך את צוואתי, ולפרט את רצוני האחרון והוראותיי בכל 
          הקשור לאשר ייעשה ברכושי לאחר פטירתי, לאחר אריכות ימים ושנים;
        </p>
        <p className="mb-3" style={{ textAlign: 'right', direction: 'rtl' }}>
          והואיל כי הנני למעלה מגיל שמונה עשרה שנים, {gender === 'female' ? 'אזרחית ישראלית ותושבת' : 'אזרח ישראלי ותושב'} מדינת ישראל;
        </p>
        <p className="mb-3" style={{ textAlign: 'right', direction: 'rtl' }}>
          לפיכך אני הח"מ <strong>{data.testator.name}</strong>, ת"ז <strong>{data.testator.id}</strong> מרחוב: <strong>{data.testator.address}</strong>, 
          לאחר שיקול דעת, ובהיותי בדעה צלולה ובכושר גמור להבחין בטיבה של צוואה, {gender === 'female' ? 'קובעת ומצהירה' : 'קובע ומצהיר'} בזה כדלקמן:
        </p>
      </div>

      {/* סעיפים סטנדרטיים */}
      <div className="space-y-4">
        <div style={{ paddingRight: '1rem', textAlign: 'right', direction: 'rtl' }}>
          <p className="font-bold mb-2" style={{ textAlign: 'right', direction: 'rtl' }}>
            <span style={{ display: 'inline-block', minWidth: '2rem', textAlign: 'right' }}>
              .{data.standardClauses.revocation.number}
            </span>
            <span className="underline">ביטול צוואות קודמות</span>
          </p>
          <p className="text-sm leading-relaxed" style={{ textAlign: 'right', direction: 'rtl' }}>
            {getText(data.standardClauses.revocation.text)}
          </p>
        </div>

        <div style={{ paddingRight: '1rem', textAlign: 'right', direction: 'rtl' }}>
          <p className="font-bold mb-2" style={{ textAlign: 'right', direction: 'rtl' }}>
            <span style={{ display: 'inline-block', minWidth: '2rem', textAlign: 'right' }}>
              .{data.standardClauses.debts.number}
            </span>
            <span className="underline">תשלום חובות והוצאות</span>
          </p>
          <p className="text-sm leading-relaxed" style={{ textAlign: 'right', direction: 'rtl' }}>
            {getText(data.standardClauses.debts.text)}
          </p>
        </div>

        <div style={{ paddingRight: '1rem', textAlign: 'right', direction: 'rtl' }}>
          <p className="font-bold mb-2" style={{ textAlign: 'right', direction: 'rtl' }}>
            <span style={{ display: 'inline-block', minWidth: '2rem', textAlign: 'right' }}>
              .{data.standardClauses.scope.number}
            </span>
            <span className="underline">היקף הצוואה</span>
          </p>
          <p className="text-sm leading-relaxed" style={{ textAlign: 'right', direction: 'rtl' }}>
            {getText(data.standardClauses.scope.text)}
          </p>
        </div>
      </div>

      {/* היקף העיזבון */}
      {data.estate.assets.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="font-bold text-lg mb-3">היקף העיזבון:</h3>
          
          <div className="pr-4">
            <p className="font-bold mb-2">.5</p>
            <p className="text-sm leading-relaxed mb-3">
              כל רכוש מכל מין וסוג שהוא בין במקרקעין בין מיטלטלין, לרבות זכויות מכל סוג שהוא 
              ו/או כל רכוש אחר (רשומים ושאינם רשומים), אשר בבעלותי כיום ו/או בהווה ו/או יגיעו 
              לידיי בעתיד, לרבות:
            </p>
            
            {/* תתי-סעיפים של נכסים */}
            <div className="space-y-3 pr-6">
              {data.estate.assets.map((asset, idx) => (
                <div key={idx} className="avoid-break">
                  <p className="font-bold text-sm mb-1">.5.{idx + 1}</p>
                  <p className="text-sm pr-4 leading-relaxed">{asset.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* חלוקת העיזבון - מיד אחרי היקף העיזבון */}
      {data.beneficiaries.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="font-bold text-lg mb-3">חלוקת העיזבון:</h3>
          <div className="pr-4">
            <p className="font-bold mb-2">.6</p>
            <p className="text-sm leading-relaxed mb-3">
              אני {gender === 'female' ? 'מצווה ומורישה' : 'מצווה ומוריש'} ל
              {data.beneficiaries.length === 1 ? 'יורש/ת' : 'יורשים'} בהתאם לחלוקה כמצוין בסעיף 5 לעיל, כדלקמן:
            </p>
            
            {/* תתי-סעיפים ליורשים */}
            <div className="space-y-3 pr-6">
              {data.beneficiaries.map((ben, idx) => (
                <div key={idx}>
                  <p className="font-bold text-sm mb-1">.6.{idx + 1}</p>
                  <p className="text-sm pr-4">
                    ל{ben.relationship || 'יורש/ת'}{' '}
                    <strong>{ben.name}</strong>
                    , נוש{gender === 'female' ? 'א' : 'ה'} ת.ז. <strong>{ben.id}</strong>
                    {' '}- חלק של <strong>{ben.share}</strong> מהעיזבון.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* סעיפים נוספים - אחרי החלוקה */}
      {data.additionalClauses.length > 0 && (
        <div className="space-y-4 border-t pt-4">
          <h3 className="font-bold text-lg mb-3">סעיפים נוספים:</h3>
          {data.additionalClauses.map((clause, clauseIdx) => (
            <div key={clauseIdx} className="pr-4 avoid-break">
              <p className="font-bold mb-2">.{clause.number}</p>
              <p className="text-sm leading-relaxed">{getText(clause.text)}</p>
              
              {/* תתי-סעיפים */}
              {clause.subItems && clause.subItems.length > 0 && (
                <div className="pr-6 mt-2 space-y-2">
                  {clause.subItems.map((subItem, subIdx) => (
                    subItem && (
                      <div key={subIdx} className="avoid-break">
                        <p className="font-bold text-sm mb-1">.{clause.number}.{subIdx + 1}</p>
                        <p className="text-sm pr-4 leading-relaxed">{getText(subItem)}</p>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* סעיפים אחרונים */}
      <div className="space-y-4 border-t pt-4">
        <div className="pr-4">
          <p className="font-bold mb-2">
            .{7 + data.additionalClauses.length} <span className="underline">פטירה מוקדמת של יורש</span>
          </p>
          <p className="text-sm leading-relaxed">{data.standardClauses.predeceased.text}</p>
        </div>

        <div className="pr-4">
          <p className="font-bold mb-2">
            .{7 + data.additionalClauses.length + 1} <span className="underline">התנגדות לצוואה</span>
          </p>
          <p className="text-sm leading-relaxed">{data.standardClauses.opposition.text}</p>
        </div>

        <div className="pr-4">
          <p className="font-bold mb-2">
            .{7 + data.additionalClauses.length + 2} <span className="underline">רוח טובה</span>
          </p>
          <p className="text-sm leading-relaxed">{data.standardClauses.goodFaith.text}</p>
        </div>
      </div>

      {/* הצהרת חתימה */}
      <div className="border-t pt-4 text-sm leading-relaxed">
        <p>{getText(data.standardClauses.declaration.text)}</p>
      </div>

      {/* חתימת המצווה */}
      <div className="border-t pt-6 mt-6">
        <div className="flex justify-between items-end">
          <div className="text-center">
            <div className="border-b-2 border-black w-48 mb-1"></div>
            <p className="text-sm">תאריך</p>
          </div>
          <div className="text-center">
            <div className="border-b-2 border-black w-48 mb-1"></div>
            <p className="text-sm">{data.testator.name}</p>
            <p className="text-xs text-gray-600">ת.ז. {data.testator.id}</p>
          </div>
        </div>
      </div>

      {/* הצהרת עדים */}
      <div className="border-t pt-6 mt-6 space-y-4">
        <h3 className="font-bold text-center">הצהרת העדים</h3>
        
        <p className="text-sm">אנו הח"מ:</p>
        
        {data.witnesses.map((witness, idx) => (
          <div key={idx} className="text-sm pl-4">
            .{idx + 1} {witness.name}, ת.ז. {witness.id}, מרחוב {witness.address}
          </div>
        ))}

        <p className="text-sm leading-relaxed mt-4">
          {getText(`אנו מעידות בזאת שהמצווה: ${data.testator.name}, נושאת ת"ז מס' ${data.testator.id}, חתמה בפנינו מרצונה הטוב והחופשי והצהירה כי זו צוואתה. 
          אנו מצהירות כי אנו לא קטינות ולא פסולות דין וכי אין לאף אחת מאיתנו כל טובת הנאה בעיזבון של המצווה. 
          אנו חותמות בתור עדות לצוואה בנוכחותה של המצווה ובנוכחות כל אחת מאיתנו.`)}
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
          * בצוואה הסופית, המצווה/ת חותמ{gender === 'female' ? 'ת' : ''} בכל עמוד בנוסף לחתימה בסוף המסמך
        </p>
      </div>
    </div>
  );
}

