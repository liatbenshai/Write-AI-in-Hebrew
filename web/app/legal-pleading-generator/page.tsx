"use client"

import React, { useState } from "react"

type CourtTier = "בית משפט השלום" | "בית המשפט המחוזי" | "בית המשפט העליון" | "בית הדין לעבודה"
type ProceedingType = "אזרחי" | "דיני עבודה" | "דיני משפחה" | "מנהלי"

export default function LegalPleadingGeneratorPage() {
  const [courtTier, setCourtTier] = useState<CourtTier>("בית המשפט המחוזי")
  const [regionCity, setRegionCity] = useState("")
  const [caseNumber, setCaseNumber] = useState("")
  const [plaintiff, setPlaintiff] = useState("")
  const [defendant, setDefendant] = useState("")
  const [plaintiffCounsel, setPlaintiffCounsel] = useState("") // עו"ד + רישיון
  const [defendantCounsel, setDefendantCounsel] = useState("")
  const [proceedingType, setProceedingType] = useState<ProceedingType>("אזרחי")

  // חלקי התוכן לפי התקנות
  const [partASummary, setPartASummary] = useState("") // עד 100 מילים
  const [partBPreliminary, setPartBPreliminary] = useState("")
  const [partCDetails, setPartCDetails] = useState("")
  const [remedies, setRemedies] = useState("")
  const [generated, setGenerated] = useState("")
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [expanding, setExpanding] = useState(false)

  function limitTo100Words(text: string): string {
    const words = text.trim().split(/\s+/).filter(Boolean)
    if (words.length <= 100) return text
    return words.slice(0, 100).join(" ")
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    // בשלב זה אנו רק מציגים תקציר נתונים בקונסול/התראה. שלב 2 יחולל מסמך.
    // ניתן לשמור ל-localStorage זמנית.
    const payload = {
      courtTier,
      regionCity,
      caseNumber,
      plaintiff,
      defendant,
      plaintiffCounsel,
      defendantCounsel: defendantCounsel || undefined,
      proceedingType,
      content: {
        partA: partASummary,
        partB: partBPreliminary,
        partC: partCDetails,
        remedies,
      },
    }
    try { localStorage.setItem("pleading_form_draft", JSON.stringify(payload)) } catch {}
    alert("הטופס נשמר מקומית. בשלב הבא ניצור את המסמך המלא.")
  }

  async function generateDocument() {
    setLoading(true)
    setGenerated("")
    try {
      const court = regionCity?.trim() ? `לכבוד ${courtTier} ב${regionCity.trim()}` : `לכבוד ${courtTier}`
      const caseType = `ת.א. (${proceedingType})`
      const body = {
        court,
        caseType,
        caseNumber,
        plaintiff,
        defendant,
        city: regionCity || undefined,
        lawyerName: plaintiffCounsel || undefined,
        partA: partASummary || undefined,
        partB: partBPreliminary || undefined,
        partC: partCDetails || undefined,
        remedies: remedies || undefined,
      }
      const res = await fetch('/api/pleading-template', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Server error')
      setGenerated(data.improvedText || '')
    } catch (err: any) {
      alert(`שגיאה ביצירת המסמך: ${err?.message || err}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-5xl p-6" dir="rtl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-1">מחולל כתבי טענות – טופס איסוף נתונים</h1>
        <p className="text-gray-600">מלאי/ה את הנתונים. בשלב הבא נאחד למסמך עברית משפטית תקנית ללא הוספת עובדות.</p>
      </header>

      <form onSubmit={onSubmit} className="space-y-8">
        {/* נתוני תיק בסיסיים */}
        <section className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-3">נתוני תיק</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">ערכאה</label>
              <select value={courtTier} onChange={e=>setCourtTier(e.target.value as CourtTier)} className="w-full border rounded p-2 text-sm">
                <option>בית משפט השלום</option>
                <option>בית המשפט המחוזי</option>
                <option>בית המשפט העליון</option>
                <option>בית הדין לעבודה</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">מחוז/עיר</label>
              <input value={regionCity} onChange={e=>setRegionCity(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="לדוגמה: תל אביב-יפו" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">מספר תיק</label>
              <input value={caseNumber} onChange={e=>setCaseNumber(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="ת.א. (אזרחי) 12345-01-25" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">שם התובע</label>
              <input value={plaintiff} onChange={e=>setPlaintiff(e.target.value)} className="w-full border rounded p-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">שם הנתבע</label>
              <input value={defendant} onChange={e=>setDefendant(e.target.value)} className="w-full border rounded p-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">באי כוח התובע (עו"ד + רישיון)</label>
              <input value={plaintiffCounsel} onChange={e=>setPlaintiffCounsel(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="עו״ד פלוני (מס' רישיון 12345)" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">באי כוח הנתבע (אופציונלי)</label>
              <input value={defendantCounsel} onChange={e=>setDefendantCounsel(e.target.value)} className="w-full border rounded p-2 text-sm" />
            </div>
          </div>
        </section>

        {/* סוג ההליך */}
        <section className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-3">סוג ההליך</h2>
          <div>
            <select value={proceedingType} onChange={e=>setProceedingType(e.target.value as ProceedingType)} className="w-full border rounded p-2 text-sm">
              <option>אזרחי</option>
              <option>דיני עבודה</option>
              <option>דיני משפחה</option>
              <option>מנהלי</option>
            </select>
          </div>
        </section>

        {/* איסוף תוכן לחלקים */}
        <section className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-3">איסוף תוכן לפי חלקים</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-700 mb-1">חלק א' – תמצית העובדות הבסיסיות (עד 100 מילים)</label>
              <textarea
                value={partASummary}
                onChange={e=>{
                  const limited = limitTo100Words(e.target.value)
                  setPartASummary(limited)
                }}
                className="w-full h-28 border rounded p-2 text-sm"
                placeholder="נקודות עיקריות תמציתיות"
              />
              <p className="text-xs text-gray-500 mt-1">מילים: {partASummary.trim() ? partASummary.trim().split(/\s+/).filter(Boolean).length : 0} / 100</p>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">חלק ב' – טענות מקדמיות (אם יש)</label>
              <textarea value={partBPreliminary} onChange={e=>setPartBPreliminary(e.target.value)} className="w-full h-32 border rounded p-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">חלק ג' – פירוט מלא של העובדות והטענות</label>
              <textarea value={partCDetails} onChange={e=>setPartCDetails(e.target.value)} className="w-full h-48 border rounded p-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">הסעד המבוקש</label>
              <textarea value={remedies} onChange={e=>setRemedies(e.target.value)} className="w-full h-32 border rounded p-2 text-sm" placeholder="לדוגמה: פיצוי כספי, צו עשה/לא תעשה..." />
            </div>
          </div>
        </section>

        <div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">שמור טיוטת נתונים</button>
          <button type="button" onClick={generateDocument} disabled={loading} className="ml-3 px-4 py-2 bg-emerald-600 text-white rounded disabled:opacity-50">{loading ? 'יוצר…' : 'צור מסמך'}</button>
          <button type="button" onClick={async ()=>{
            setExpanding(true)
            try {
              const baseText = [
                partASummary && `חלק א': ${partASummary}`,
                partBPreliminary && `חלק ב': ${partBPreliminary}`,
                partCDetails && `חלק ג': ${partCDetails}`,
                remedies && `סעדים: ${remedies}`,
              ].filter(Boolean).join('\n\n') || '—'
              const res = await fetch('/api/expand-legal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ baseText }) })
              const data = await res.json()
              if (!res.ok) throw new Error(data?.error || 'Server error')
              setGenerated(String(data.expandedText || ''))
            } catch (e: any) {
              alert(e?.message || 'שגיאה בהרחבת הטקסט')
            } finally {
              setExpanding(false)
            }
          }} className="ml-3 px-4 py-2 bg-orange-600 text-white rounded disabled:opacity-50" disabled={expanding}>{expanding ? 'מרחיב…' : 'הרחב תוכן משפטי'}</button>
          <a href="/" className="ml-3 text-blue-600">חזרה לדף הראשי</a>
        </div>

        {generated && (
          <section className="border rounded p-4 mt-6">
            <h2 className="text-lg font-semibold mb-3">טיוטת מסמך שנוצרה</h2>
            <textarea readOnly className="w-full h-96 border rounded p-2 text-sm font-mono whitespace-pre" value={generated} />
            <div className="mt-3 flex items-center gap-3">
              <button type="button" onClick={async ()=>{
                try {
                  setDownloading(true)
                  const court = regionCity?.trim() ? `לכבוד ${courtTier} ב${regionCity.trim()}` : `לכבוד ${courtTier}`
                  const caseType = `ת.א. (${proceedingType})`
                  const body = {
                    court,
                    caseType,
                    caseNumber,
                    plaintiff,
                    defendant,
                    city: regionCity || undefined,
                    lawyerName: plaintiffCounsel || undefined,
                    partA: partASummary || undefined,
                    partB: partBPreliminary || undefined,
                    partC: partCDetails || undefined,
                    remedies: remedies || undefined,
                  }
                  const res = await fetch('/api/pleading-docx', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
                  if (!res.ok) throw new Error('DOCX generation failed')
                  const blob = await res.blob()
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `pleading_${caseNumber || 'draft'}.docx`
                  a.click()
                  URL.revokeObjectURL(url)
                } catch (e: any) {
                  alert(e?.message || 'שגיאה בהורדת DOCX')
                } finally {
                  setDownloading(false)
                }
              }} className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50" disabled={downloading}>{downloading ? 'מכין DOCX…' : 'הורד DOCX בעימוד תקני'}</button>
              <button type="button" onClick={()=>{
                const blob = new Blob([generated], { type: 'text/plain;charset=utf-8' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'pleading_draft.txt'
                a.click()
                URL.revokeObjectURL(url)
              }} className="px-4 py-2 bg-blue-600 text-white rounded">הורד TXT</button>
            </div>
          </section>
        )}
        <p className="text-xs text-gray-500 mt-4">המערכת מסייעת בעיצוב וארגון המידע בלבד. האחריות לתוכן המשפטי והדיוק היא על עורך הדין בלבד.</p>
      </form>
    </main>
  )
}


