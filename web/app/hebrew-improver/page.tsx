"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type Mode = 'legal' | 'content' | 'academic'

export default function HebrewImproverPage() {
  const [mode, setMode] = useState<Mode>('content')
  const [text, setText] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [before, setBefore] = useState('')
  const [after, setAfter] = useState('')
  const [changes, setChanges] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [usedDnaBanner, setUsedDnaBanner] = useState<string | null>(null)
  const [dnaExamples, setDnaExamples] = useState<Array<{ before: string; after: string | string[]; type: Mode; comment?: string }>>([])
  const [dnaSaved, setDnaSaved] = useState(false)
  const [note, setNote] = useState('')
  const [noteSaving, setNoteSaving] = useState(false)
  const [noteSaved, setNoteSaved] = useState(false)
  const [rephrase, setRephrase] = useState(false)
  const [synonymsInput, setSynonymsInput] = useState('')
  const [scoreBanner, setScoreBanner] = useState<string | null>(null)
  const [lastScore, setLastScore] = useState<number | null>(null)
  const [feedbackText, setFeedbackText] = useState('')

  type HistoryItem = { id: string; when: number; type: Mode; before: string; after: string; changes: string[] }
  const [history, setHistory] = useState<HistoryItem[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('hebrew_adapter_history')
      if (raw) setHistory(JSON.parse(raw))
    } catch {}
    try {
      const rawDna = localStorage.getItem('dnaExamples')
      if (rawDna) setDnaExamples(JSON.parse(rawDna))
    } catch {}
  }, [])

  function pushHistory(item: Omit<HistoryItem, 'id'|'when'>) {
    const rec: HistoryItem = { id: crypto.randomUUID(), when: Date.now(), ...item }
    const next = [rec, ...history].slice(0, 20)
    setHistory(next)
    try { localStorage.setItem('hebrew_adapter_history', JSON.stringify(next)) } catch {}
  }

  async function onSubmit() {
    setError(null)
    if (!text.trim()) {
      setError('נא להדביק טקסט או להעלות קובץ')
      return
    }
    setLoading(true)
    setBefore(text)
    setAfter('')
    setChanges([])
    try {
      const count = Math.min(8, Math.max(3, dnaExamples.length))
      const chosen = dnaExamples.slice(-count).map(ex => ({
        before: ex.before,
        after: Array.isArray(ex.after) ? ex.after[Math.floor(Math.random() * ex.after.length)] : ex.after,
        type: ex.type,
        comment: ex.comment,
      }))

      const endpoint = mode === 'legal' ? '/api/improve-legal' : '/api/improve-content'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          dnaExamples: chosen,
          rephrase,
          synonyms: synonymsInput.split(',').map(s => s.trim()).filter(Boolean).slice(0, 50),
        })
      })
      if (!res.ok) throw new Error('שגיאה מהשרת')
      let data: any = await res.json()
      if (typeof data === 'string') {
        const stripped = data.replace(/^```[a-zA-Z]*\n?|```$/g, '')
        try { data = JSON.parse(stripped) } catch { data = { improvedText: stripped } }
      }
      let improvedRaw: any = data?.improvedText ?? ''
      if (typeof improvedRaw === 'string' && /^[\[{]/.test(improvedRaw.trim())) {
        try {
          const inner = JSON.parse(improvedRaw)
          if (typeof inner?.improvedText === 'string') improvedRaw = inner.improvedText
        } catch {}
      }
      const improved: string = typeof improvedRaw === 'string' ? improvedRaw : ''
      const ch: string[] = Array.isArray(data?.changes) ? data.changes : []
      const usedDnaCount: number = typeof data?.usedDnaCount === 'number' ? data.usedDnaCount : 0
      const quality: number | undefined = typeof data?.qualityScore === 'number' ? data.qualityScore : undefined
      const improvements: number | undefined = typeof data?.improvements === 'number' ? data.improvements : (Array.isArray(ch) ? ch.length : undefined)
      setAfter(improved)
      setChanges(ch)
      pushHistory({ type: mode, before: text, after: improved, changes: ch })
      if (usedDnaCount > 0) {
        setUsedDnaBanner(`השתמשתי ב-${usedDnaCount} הערות קודמות בלמידה`)
        setTimeout(() => setUsedDnaBanner(null), 3000)
      }
      if (quality) {
        setLastScore(quality)
        setScoreBanner(`איכות התיקון: ${quality}/10${improvements ? ` — התיקון כלל ${improvements} שיפורים` : ''}`)
        setTimeout(() => setScoreBanner(null), 6000)
      }
    } catch (e: any) {
      setError(e.message || 'אירעה שגיאה')
    } finally {
      setLoading(false)
    }
  }

  async function submitTo(endpoint: '/api/improve-legal' | '/api/improve-content') {
    setError(null)
    if (!text.trim()) { setError('נא להדביק טקסט או להעלות קובץ'); return }
    setLoading(true)
    setBefore(text); setAfter(''); setChanges([])
    try {
      const count = Math.min(8, Math.max(3, dnaExamples.length))
      const chosen = dnaExamples.slice(-count).map(ex => ({
        before: ex.before,
        after: Array.isArray(ex.after) ? ex.after[Math.floor(Math.random() * ex.after.length)] : ex.after,
        comment: ex.comment,
      }))
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          dnaExamples: chosen,
          rephrase,
          synonyms: synonymsInput.split(',').map(s => s.trim()).filter(Boolean).slice(0, 50),
        })
      })
      if (!res.ok) throw new Error('שגיאה מהשרת')
      const data: any = await res.json()
      const improved = typeof data?.improvedText === 'string' ? data.improvedText : ''
      const ch: string[] = Array.isArray(data?.changes) ? data.changes : []
      const usedDnaCount: number = typeof data?.usedDnaCount === 'number' ? data.usedDnaCount : 0
      const quality: number | undefined = typeof data?.qualityScore === 'number' ? data.qualityScore : undefined
      const improvements: number | undefined = typeof data?.improvements === 'number' ? data.improvements : (Array.isArray(ch) ? ch.length : undefined)
      setAfter(improved); setChanges(ch)
      pushHistory({ type: mode, before: text, after: improved, changes: ch })
      if (usedDnaCount > 0) { setUsedDnaBanner(`השתמשתי ב-${usedDnaCount} הערות קודמות בלמידה`); setTimeout(() => setUsedDnaBanner(null), 3000) }
      if (quality) {
        setLastScore(quality)
        setScoreBanner(`איכות התיקון: ${quality}/10${improvements ? ` — התיקון כלל ${improvements} שיפורים` : ''}`)
        setTimeout(() => setScoreBanner(null), 6000)
      }
    } catch (e: any) { setError(e.message || 'אירעה שגיאה') } finally { setLoading(false) }
  }

  async function onGenerate() {
    setError(null)
    if (!text.trim()) {
      setError('נא להדביק טקסט (בריף/נושא)')
      return
    }
    setLoading(true)
    setBefore('')
    setAfter('')
    setChanges([])
    try {
      const endpoint = mode === 'legal' ? '/api/generate-legal' : '/api/generate-marketing'
      const body = mode === 'legal' ? { brief: text } : { topic: text, audience: { tone: mode === 'academic' ? 'neutral' : 'friendly' } }
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('שגיאה מהשרת')
      const data: { content?: string } = await res.json()
      setAfter(data.content || '')
    } catch (e: any) {
      setError(e.message || 'אירעה שגיאה')
    } finally {
      setLoading(false)
    }
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = () => setText(String(reader.result || ''))
    reader.readAsText(file)
  }

  function diffTokens(a: string, b: string) {
    const aw = a.split(/(\s+)/)
    const bw = b.split(/(\s+)/)
    const n = aw.length, m = bw.length
    const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0))
    for (let i = n - 1; i >= 0; i--) {
      for (let j = m - 1; j >= 0; j--) {
        dp[i][j] = aw[i] === bw[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1])
      }
    }
    const out: Array<{ t: string; k: 'same'|'add'|'del' }> = []
    let i = 0, j = 0
    while (i < n && j < m) {
      if (aw[i] === bw[j]) { out.push({ t: bw[j], k: 'same' }); i++; j++; }
      else if (dp[i + 1][j] >= dp[i][j + 1]) { out.push({ t: aw[i], k: 'del' }); i++; }
      else { out.push({ t: bw[j], k: 'add' }); j++; }
    }
    while (i < n) out.push({ t: aw[i++], k: 'del' })
    while (j < m) out.push({ t: bw[j++], k: 'add' })
    return out
  }

  const highlights = useMemo(() => diffTokens(before, after), [before, after])

  function saveDnaExample() {
    if (!before.trim() || !after.trim()) return
    const next = [...dnaExamples, { before, after, type: mode }].slice(-10)
    setDnaExamples(next)
    try { localStorage.setItem('dnaExamples', JSON.stringify(next)) } catch {}
    fetch('/api/learn', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: 'edit_saved', before, after, type: mode }) }).catch(()=>{})
    setDnaSaved(true)
    setTimeout(() => setDnaSaved(false), 2000)
  }

  async function submitNote() {
    if (!before.trim() || !after.trim()) return
    setNoteSaving(true)
    const trimmed = note.trim()
    const next = [...dnaExamples, { before, after, type: mode, comment: trimmed }].slice(-10)
    setDnaExamples(next)
    try { localStorage.setItem('dnaExamples', JSON.stringify(next)) } catch {}
    fetch('/api/learn', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind: 'feedback', before, after, comment: trimmed, type: mode }) }).catch(()=>{})
    setTimeout(() => { setNoteSaving(false); setNoteSaved(true); setTimeout(() => setNoteSaved(false), 2000) }, 400)
  }

  const learnedNotesCount = useMemo(() => dnaExamples.filter(x => (x.comment || '').trim().length > 0).length, [dnaExamples])

  return (
    <main className="mx-auto max-w-5xl p-6">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">התאמת טקסטי AI לעברית אמיתית</h1>
          <p className="text-gray-600">הדביקו טקסט או העלו קובץ, בחרו סגנון (משפטי/תוכן), וקבלו ניסוח עברי תקני עם השוואה לפני/אחרי.</p>
        </div>
        <Link href="/" className="text-blue-600 hover:text-blue-700 hover:underline">
          ← חזרה
        </Link>
      </header>

      <section className="mb-6">
        <div className="inline-flex gap-2 rounded-md border p-1 bg-gray-50">
          <button onClick={() => setMode('content')} className={`px-3 py-1 rounded ${mode==='content' ? 'bg-white border' : ''}`}>עברית תוכן</button>
          <button onClick={() => setMode('legal')} className={`px-3 py-1 rounded ${mode==='legal' ? 'bg-white border' : ''}`}>עברית משפטית</button>
          <button onClick={() => setMode('academic')} className={`px-3 py-1 rounded ${mode==='academic' ? 'bg-white border' : ''}`}>אקדמי</button>
        </div>
        <a href="/dna-import" className="ml-3 text-blue-600 inline-block">ייבוא DNA</a>
        {usedDnaBanner && (
          <div className="mt-3 text-xs text-green-800 bg-green-100 border border-green-200 rounded px-3 py-2 inline-block">
            {usedDnaBanner}
          </div>
        )}
        {scoreBanner && (
          <div className="mt-3 text-xs text-blue-800 bg-blue-100 border border-blue-200 rounded px-3 py-2 inline-block">
            {scoreBanner}
          </div>
        )}
      </section>

      <section className="grid md:grid-cols-2 gap-6 items-start">
        <div>
          <label className="block text-sm font-medium mb-2">טקסט מקור</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-48 border rounded p-3" placeholder="הדביקו כאן טקסט..."></textarea>
          <div className="mt-3 flex items-center gap-3">
            <label className="cursor-pointer text-blue-600">
              <input type="file" accept=".txt,.md,.rtf,.docx,.json" className="hidden" onChange={onFile} />
              העלאת קובץ
            </label>
            {fileName && <span className="text-sm text-gray-500">נבחר: {fileName}</span>}
          </div>
          {error && <p className="text-red-600 mt-2">{error}</p>}
          <div className="mt-4 flex gap-2 flex-wrap">
            <button onClick={() => submitTo('/api/improve-legal')} disabled={loading} className="px-4 py-2 bg-blue-700 text-white rounded disabled:opacity-50">
              {loading ? 'מעבד…' : 'תקן עברית משפטית'}
            </button>
            <button onClick={() => submitTo('/api/improve-content')} disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50">
              {loading ? 'מעבד…' : 'תקן תוכן שיווקי'}
            </button>
            <button onClick={onSubmit} disabled={loading} className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50">
              {loading ? 'מעבד…' : 'התאם לפי מצב נבחר'}
            </button>
            <button onClick={onGenerate} disabled={loading} className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50">
              {loading ? 'יוצר…' : 'צור מאפס'}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">השוואה</label>
          <div className="grid grid-cols-1 gap-4">
            <div className="border rounded p-3">
              <div className="text-xs text-gray-500 mb-1">לפני</div>
              <pre className="whitespace-pre-wrap text-sm">{before}</pre>
            </div>
            <div className="border rounded p-3 bg-gray-50">
          <div className="text-xs text-gray-500 mb-1">אחרי (ניתן לעריכה)</div>
          <textarea value={after} onChange={(e)=>setAfter(e.target.value)} className="w-full h-40 border rounded p-2 text-sm bg-white"></textarea>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={rephrase} onChange={(e)=>setRephrase(e.target.checked)} />
              ניסוח מחדש עם גיוון מילים
            </label>
            <div>
              <label className="block text-xs text-gray-600 mb-1">מאגר מילים (מופרד בפסיקים)</label>
              <input value={synonymsInput} onChange={(e)=>setSynonymsInput(e.target.value)} placeholder="למשל: מתאים, ראוי, הולם, רצוי" className="w-full border rounded p-2 text-sm bg-white" />
            </div>
          </div>
          <label className="block text-xs text-gray-600 mt-3 mb-1">הערות ותיקונים נוספים</label>
          <textarea value={note} onChange={(e)=>setNote(e.target.value)} placeholder="למשל: החלף 'מוסמכות' ב'מתאימות', השתמש בשפה יותר חמה..." className="w-full h-24 border rounded p-2 text-sm bg-white"></textarea>
          <div className="mt-2 flex items-center gap-3">
            <button onClick={saveDnaExample} className="px-3 py-1 text-sm border rounded" disabled={dnaSaved}>
              {dnaSaved ? 'נשמר ✓' : 'שמור כתיקון אישי'}
            </button>
            <button onClick={submitNote} className="px-3 py-1 text-sm border rounded bg-green-600 text-white" disabled={noteSaving}>
              {noteSaving ? 'שומר…' : 'שלח הערות ולמד'}
            </button>
            {noteSaved && <span className="text-xs text-green-700">✅ למדתי מההערה שלך!</span>}
            {learnedNotesCount > 0 && <span className="text-xs text-gray-600">יש לך {learnedNotesCount} הערות מכוונות ב‑DNA</span>}
          </div>
            </div>
            <div className="border rounded p-3">
              <div className="text-xs text-gray-500 mb-1">הדגשות שינויים</div>
              <div className="text-sm whitespace-pre-wrap leading-7">
                {highlights.map((h, i) => (
                  <span key={i} className={h.k==='add' ? 'bg-green-100 text-green-800' : h.k==='del' ? 'bg-red-100 line-through text-red-700' : ''}>{h.t}</span>
                ))}
              </div>
            </div>
            {changes.length > 0 && (
              <div className="border rounded p-3">
                <div className="text-xs text-gray-500 mb-1">שינויים עיקריים</div>
                <ul className="list-disc pr-6 text-sm space-y-1">
                  {changes.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="border rounded p-3">
              <div className="text-xs text-gray-500 mb-1">היסטוריה</div>
              <div className="max-h-56 overflow-auto divide-y">
                {history.length === 0 && <div className="p-2 text-sm text-gray-500">טרם בוצעו המרות.</div>}
                {history.map(h => (
                  <button key={h.id} className="w-full text-right p-2 hover:bg-gray-50" onClick={() => { setMode(h.type); setBefore(h.before); setAfter(h.after); setChanges(h.changes) }}>
                    <div className="text-xs text-gray-500">{new Date(h.when).toLocaleString('he-IL')}</div>
                    <div className="text-xs">סוג: {h.type === 'legal' ? 'משפטי' : 'תוכן'}</div>
                    <div className="text-sm line-clamp-2">{h.after || h.before}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {loading && learnedNotesCount > 0 && (
        <div className="mt-4 text-xs text-gray-600">נלמד מ-{learnedNotesCount} הערות קודמות…</div>
      )}
    </main>
  )
}

