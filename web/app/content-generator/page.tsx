"use client"

import { useState } from "react"

type Industry = "טכנולוגיה" | "בריאות" | "פיננסים" | "חינוך" | "נדל\"ן" | "אחר"
type Goal = "מידע" | "מכירה" | "בניית אמון" | "חינוכי"

export default function ContentGeneratorPage() {
  const [topic, setTopic] = useState("")
  const [industry, setIndustry] = useState<Industry>("טכנולוגיה")
  const [audience, setAudience] = useState("")
  const [goal, setGoal] = useState<Goal>("מידע")

  const [primaryKeyword, setPrimaryKeyword] = useState("")
  const [secondaryKeywords, setSecondaryKeywords] = useState("")
  const [longtailKeywords, setLongtailKeywords] = useState("")

  const [info, setInfo] = useState("")
  const [benefits, setBenefits] = useState("")
  const [stories, setStories] = useState("")
  const [cta, setCta] = useState("")

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      topic,
      industry,
      audience,
      goal,
      seo: {
        primaryKeyword,
        secondaryKeywords: secondaryKeywords.split(",").map(s=>s.trim()).filter(Boolean),
        longtailKeywords: longtailKeywords.split(",").map(s=>s.trim()).filter(Boolean),
      },
      content: { info, benefits, stories, cta },
    }
    try { localStorage.setItem("marketing_content_form_draft", JSON.stringify(payload)) } catch {}
    alert("טיוטה נשמרה מקומית. בשלב הבא נחולל מאמר מלא עם SEO.")
  }

  return (
    <main className="mx-auto max-w-5xl p-6" dir="rtl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-1">מחולל תוכן שיווקי – טופס איסוף נתונים</h1>
        <p className="text-gray-600">מלאו את הנתונים הבסיסיים וה-SEO. נייצר מאמר ישראלי מותאם לקידום אורגני.</p>
      </header>

      <form onSubmit={onSubmit} className="space-y-8">
        {/* מידע בסיסי על הנושא */}
        <section className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-3">מידע בסיסי</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">נושא המאמר</label>
              <input value={topic} onChange={e=>setTopic(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="לדוגמה: קורסי פיתוח אתרים" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">תעשייה/תחום</label>
              <select value={industry} onChange={e=>setIndustry(e.target.value as Industry)} className="w-full border rounded p-2 text-sm">
                <option>טכנולוגיה</option>
                <option>בריאות</option>
                <option>פיננסים</option>
                <option>חינוך</option>
                <option>נדל"ן</option>
                <option>אחר</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700 mb-1">קהל יעד</label>
              <input value={audience} onChange={e=>setAudience(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="למי זה מיועד?" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">מטרת המאמר</label>
              <select value={goal} onChange={e=>setGoal(e.target.value as Goal)} className="w-full border rounded p-2 text-sm">
                <option>מידע</option>
                <option>מכירה</option>
                <option>בניית אמון</option>
                <option>חינוכי</option>
              </select>
            </div>
          </div>
        </section>

        {/* מילות מפתח לקידום אורגני */}
        <section className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-3">מילות מפתח (SEO)</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">מילת מפתח ראשית (חובה)</label>
              <input value={primaryKeyword} onChange={e=>setPrimaryKeyword(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="לדוגמה: קורס פיתוח אתרים" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">מילות מפתח משניות (מופרדות בפסיקים)</label>
              <input value={secondaryKeywords} onChange={e=>setSecondaryKeywords(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="HTML,CSS,JavaScript" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700 mb-1">מילות מפתח ארוכות (ביטויים של 3-5 מילים, פסיקים)</label>
              <input value={longtailKeywords} onChange={e=>setLongtailKeywords(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="איך לבחור קורס פיתוח אתרים" />
            </div>
          </div>
        </section>

        {/* תוכן ומידע */}
        <section className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-3">תוכן ומידע</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">תאר/י את המידע שתרצה לכלול</label>
              <textarea value={info} onChange={e=>setInfo(e.target.value)} className="w-full h-40 border rounded p-2 text-sm" placeholder="עיקרי הנושאים, נקודות חשובות..." />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">יתרונות/פתרונות שתרצה להדגיש</label>
              <textarea value={benefits} onChange={e=>setBenefits(e.target.value)} className="w-full h-28 border rounded p-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">דוגמאות או סיפורים רלוונטיים</label>
              <textarea value={stories} onChange={e=>setStories(e.target.value)} className="w-full h-28 border rounded p-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">קריאה לפעולה (אם רלוונטי)</label>
              <input value={cta} onChange={e=>setCta(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="צרו קשר, הירשמו, נסו חינם..." />
            </div>
          </div>
        </section>

        <div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">שמור טיוטת נתונים</button>
          <a href="/" className="ml-3 text-blue-600">חזרה לדף הראשי</a>
        </div>
      </form>
    </main>
  )
}


