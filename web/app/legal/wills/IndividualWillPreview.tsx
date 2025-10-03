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
        <p className="mb-4" style={{ textAlign: 'right', direction: 'rtl' }}>
          לפיכך אני הח"מ <strong>{data.testator.name}</strong>, (להלן: "<strong>{data.testator.name.split(' ')[1] || data.testator.name}</strong>") ת"ז <strong>{data.testator.id}</strong>. 
          מרחוב: <strong>{data.testator.address}</strong>. 
          לאחר שיקול דעת, ובהיותי בדעה צלולה ובכושר גמור להבחין בטיבה של צוואה, 
          הנני מצווה בזאת בדעה מוגמרת וללא כל השפעה בלתי הוגנת עליי מצד כלשהו, 
          את מה שייעשה ברכושי לאחר מותי, {gender === 'female' ? 'קובעת ומצהירה' : 'קובע ומצהיר'} כמפורט להלן:
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
      <div className="border-t pt-4">
        <h3 className="font-bold text-lg mb-3">היקף העיזבון:</h3>
        
        <div className="pr-4">
          <p className="font-bold mb-2">.4</p>
          <p className="text-sm leading-relaxed mb-3">
            {data.standardClauses.scope.text}
          </p>
          
          {/* תתי-סעיפים של נכסים */}
          {data.estate.assets.length > 0 && (
            <div className="space-y-3 pr-6">
              {data.estate.assets.map((asset, idx) => (
                <div key={idx} className="avoid-break">
                  <p className="font-bold text-sm mb-1">.4.{idx + 1}</p>
                  <p className="text-sm pr-4 leading-relaxed">{asset.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* חלוקת העיזבון - מיד אחרי היקף העיזבון */}
      {data.beneficiaries.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="font-bold text-lg mb-3">חלוקת העיזבון:</h3>
          <div className="pr-4">
            <p className="font-bold mb-2">.5</p>
            <p className="text-sm leading-relaxed mb-3">
              אני {gender === 'female' ? 'מצווה ומורישה' : 'מצווה ומוריש'} ל
              {data.beneficiaries.length === 1 ? 'יורש/ת' : 'יורשים'} בהתאם לחלוקה כמצוין בסעיף 4 לעיל, כדלקמן:
            </p>
            
            {/* תתי-סעיפים ליורשים */}
            <div className="space-y-3 pr-6">
              {data.beneficiaries.map((ben, idx) => (
                <div key={idx}>
                  <p className="font-bold text-sm mb-1">.5.{idx + 1}</p>
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
              <p className="font-bold mb-2">.{5 + clauseIdx + 1}</p>
              <p className="text-sm leading-relaxed">{getText(clause.text)}</p>
              
              {/* תתי-סעיפים */}
              {clause.subItems && clause.subItems.length > 0 && (
                <div className="pr-6 mt-2 space-y-2">
                  {clause.subItems.map((subItem, subIdx) => (
                    subItem && (
                      <div key={subIdx} className="avoid-break">
                        <p className="font-bold text-sm mb-1">.{5 + clauseIdx + 1}.{subIdx + 1}</p>
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

      {/* הוראות מיוחדות */}
      {data.specialInstructions && data.specialInstructions.length > 0 && (
        <div className="space-y-4 border-t pt-4">
          <h3 className="font-bold text-lg mb-3">הוראות מיוחדות:</h3>
          {data.specialInstructions.map((instruction, instructionIdx) => (
            <div key={instructionIdx} className="pr-4 avoid-break">
              <p className="font-bold mb-2">.{5 + data.additionalClauses.length + instructionIdx + 1}</p>
              <p className="text-sm leading-relaxed">{getText(instruction.text)}</p>
              
              {/* תתי-סעיפים */}
              {instruction.subItems && instruction.subItems.length > 0 && (
                <div className="pr-6 mt-2 space-y-2">
                  {instruction.subItems.map((subItem, subIdx) => (
                    subItem && (
                      <div key={subIdx} className="avoid-break">
                        <p className="font-bold text-sm mb-1">.{5 + data.additionalClauses.length + instructionIdx + 1}.{subIdx + 1}</p>
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

      {/* כותרות */}
      {data.headings && data.headings.length > 0 && (
        <div className="space-y-4 border-t pt-4">
          {data.headings.map((heading, headingIdx) => (
            <div key={headingIdx} className="avoid-break">
              {heading.level === 1 && (
                <h2 className="font-bold text-xl mb-3 mt-6" style={{ textAlign: 'right', direction: 'rtl' }}>
                  {heading.text}
                </h2>
              )}
              {heading.level === 2 && (
                <h3 className="font-bold text-lg mb-2 mt-4" style={{ textAlign: 'right', direction: 'rtl' }}>
                  {heading.text}
                </h3>
              )}
              {heading.level === 3 && (
                <h4 className="font-bold text-base mb-2 mt-3" style={{ textAlign: 'right', direction: 'rtl' }}>
                  {heading.text}
                </h4>
              )}
            </div>
          ))}
        </div>
      )}

      {/* סעיפים אחרונים */}
      <div className="space-y-4 border-t pt-4">
        {data.beneficiaries.length > 0 && (
          <div className="pr-4">
            <p className="font-bold mb-2">
              .{5 + data.additionalClauses.length + (data.specialInstructions?.length || 0) + 1} <span className="underline">פטירה מוקדמת של יורש</span>
            </p>
            <p className="text-sm leading-relaxed">{data.standardClauses.predeceased.text}</p>
          </div>
        )}

        <div className="pr-4">
          <p className="font-bold mb-2">
            .{5 + data.additionalClauses.length + (data.specialInstructions?.length || 0) + 2} <span className="underline">התנגדות לצוואה</span>
          </p>
          <p className="text-sm leading-relaxed">{data.standardClauses.opposition.text}</p>
        </div>

        <div className="pr-4">
          <p className="font-bold mb-2">
            .{5 + data.additionalClauses.length + (data.specialInstructions?.length || 0) + 3} <span className="underline">רוח טובה</span>
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
        
        <p className="text-sm leading-relaxed" style={{ textAlign: 'right', direction: 'rtl' }}>
          {data.witnesses.every(w => w.name.includes(' ')) ? (
            // אם יש שמות מלאים, נניח שהם נשים (ברירת מחדל)
            <>
              אנו מעידות בזאת שהמצווה הנ"ל <strong>{data.testator.name}</strong>, הנוש{gender === 'female' ? 'א' : 'ה'} תעודת זהות <strong>{data.testator.id}</strong> 
              חתם בנוכחותנו על צוואתו הנ"ל לאחר שהצהיר בפנינו שזאת צוואתו האחרונה שאותה עשה מרצונו הטוב והחופשי בהיותו בדעה צלולה ובלי כל אונס או כפיה, 
              וביקש מאיתנו להיות עדות לחתימתו ולאשר בחתימת ידנו שכך הצהיר וחתם בפנינו.
            </>
          ) : (
            <>
              אנו מעידים בזאת שהמצווה הנ"ל <strong>{data.testator.name}</strong>, הנוש{gender === 'female' ? 'א' : 'ה'} תעודת זהות <strong>{data.testator.id}</strong> 
              חתם בנוכחותנו על צוואתו הנ"ל לאחר שהצהיר בפנינו שזאת צוואתו האחרונה שאותה עשה מרצונו הטוב והחופשי בהיותו בדעה צלולה ובלי כל אונס או כפיה, 
              וביקש מאיתנו להיות עדים לחתימתו ולאשר בחתימת ידנו שכך הצהיר וחתם בפנינו.
            </>
          )}
        </p>
        
        <p className="text-sm leading-relaxed" style={{ textAlign: 'right', direction: 'rtl' }}>
          {data.witnesses.every(w => w.name.includes(' ')) ? (
            // נשים
            <>
              ועוד אנו מצהירות כי אנו לא קטינות ולא פסולות דין וכי אין בינינו ובין המצווה יחס של קרבה כלשהיא, 
              אין לנו כל טובת הנאה בעיזבון המצווה הנ"ל, והננו חותמות ומאשרות בזה כי המצווה הנ"ל חתם בפנינו על שטר צוואה זה 
              לאחר שהצהיר בפנינו כי זו צוואתו ובזה אנו חותמות בתור עדות לצוואה בנוכחות של המצווה הנ"ל ובנוכחות כל אחת מאיתנו.
            </>
          ) : (
            // גברים
            <>
              ועוד אנו מצהירים כי אנו לא קטינים ולא פסולי דין וכי אין בינינו ובין המצווה יחס של קרבה כלשהיא, 
              אין לנו כל טובת הנאה בעיזבון המצווה הנ"ל, והננו חותמים ומאשרים בזה כי המצווה הנ"ל חתם בפנינו על שטר צוואה זה 
              לאחר שהצהיר בפנינו כי זו צוואתו ובזה אנו חותמים בתור עדות לצוואה בנוכחות של המצווה הנ"ל ובנוכחות כל אחד מאיתנו.
            </>
          )}
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

