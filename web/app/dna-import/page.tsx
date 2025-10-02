"use client"

import { useMemo, useState } from 'react'

type Mode = 'legal' | 'content'
type DnaExample = { before: string; after: string | string[]; type: Mode; comment?: string }

export default function DnaImportPage() {
  const [fileName, setFileName] = useState<string | null>(null)
  const [raw, setRaw] = useState('')
  const [examples, setExamples] = useState<DnaExample[]>([])
  const [error, setError] = useState<string | null>(null)
  const [savedMsg, setSavedMsg] = useState<string | null>(null)

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null); setSavedMsg(null)
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = () => setRaw(String(reader.result || ''))
    reader.readAsText(file)
  }

  function splitCsvLine(line: string): string[] {
    const out: string[] = []
    let cur = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
        else { inQuotes = !inQuotes }
      } else if (ch === ',' && !inQuotes) {
        out.push(cur); cur = ''
      } else {
        cur += ch
      }
    }
    out.push(cur)
    return out.map(s => s.trim())
  }

  function parse(): void {
    setError(null); setSavedMsg(null)
    try {
      const text = raw.trim()
      if (!text) { setExamples([]); return }
      // Detect JSONL by braces at start of lines
      const isJsonl = text.split(/\r?\n/).slice(0, 3).every(l => l.trim().startsWith('{') || l.trim().length === 0)
      if (isJsonl) {
        const rows: DnaExample[] = []
        for (const line of text.split(/\r?\n/)) {
          const t = line.trim(); if (!t) continue
          const obj = JSON.parse(t)
          if (!obj.before || !obj.after) continue
          const after = Array.isArray(obj.after) ? obj.after.map((x: unknown) => String(x)) : String(obj.after)
          rows.push({ before: String(obj.before), after, type: (obj.type === 'legal' ? 'legal' : 'content'), comment: obj.comment ? String(obj.comment) : undefined })
        }
        setExamples(rows)
        return
      }
      // Otherwise try CSV with header: before,after,type,comment
      const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0)
      if (lines.length === 0) { setExamples([]); return }
      const header = splitCsvLine(lines[0]).map(h => h.toLowerCase())
      const idxBefore = header.indexOf('before')
      const idxAfter = header.indexOf('after')
      const idxType = header.indexOf('type')
      const idxComment = header.indexOf('comment')
      if (idxBefore < 0 || idxAfter < 0) throw new Error('CSV חייב להכיל עמודות before, after (type, comment אופציונלי)')
      const rows: DnaExample[] = []
      for (const line of lines.slice(1)) {
        const cols = splitCsvLine(line)
        const before = cols[idxBefore] || ''
        const afterRaw = cols[idxAfter] || ''
        if (!before || !afterRaw) continue
        // Support JSON array in CSV after column
        let after: string | string[] = afterRaw
        const trimmed = afterRaw.trim()
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
          try { after = JSON.parse(trimmed).map((x: unknown) => String(x)) } catch {}
        }
        const type: Mode = (cols[idxType] === 'legal' ? 'legal' : 'content')
        const comment = idxComment >= 0 ? (cols[idxComment] || '') : ''
        rows.push({ before, after, type, comment })
      }
      setExamples(rows)
    } catch (e: any) {
      setError(e.message || 'שגיאת ניתוח קובץ')
      setExamples([])
    }
  }

  const preview = useMemo(() => examples.slice(0, 10), [examples])

  function onSave() {
    try {
      const currentRaw = localStorage.getItem('dnaExamples')
      const current: DnaExample[] = currentRaw ? JSON.parse(currentRaw) : []
      const key = (x: DnaExample) => `${x.type}|${x.before}|${x.after}|${x.comment || ''}`
      const seen = new Set(current.map(key))
      const merged: DnaExample[] = [...current]
      for (const ex of examples) {
        const k = key(ex)
        if (!seen.has(k)) { merged.push(ex); seen.add(k) }
      }
      // Limit to 1000 entries to keep storage reasonable
      const limited = merged.slice(-1000)
      localStorage.setItem('dnaExamples', JSON.stringify(limited))
      setSavedMsg(`נשמרו ${examples.length} דוגמאות (סה"כ ${limited.length})`) 
    } catch (e: any) {
      setError(e.message || 'שגיאת שמירה ל‑localStorage')
    }
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold mb-2">ייבוא DNA</h1>
      <p className="text-gray-600 mb-4">העלאת קובץ JSONL/CSV עם עמודות: before, after, type (legal/content), comment (אופציונלי).</p>

      <div className="mb-4 flex items-center gap-3">
        <input type="file" accept=".jsonl,.csv" onChange={onFile} />
        {fileName && <span className="text-sm text-gray-500">נבחר: {fileName}</span>}
        <button onClick={parse} className="px-3 py-1 border rounded">נתח קובץ</button>
        <a href="/" className="ml-auto text-blue-600">חזרה לדף הבית</a>
      </div>

      {error && <div className="mb-3 text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 text-sm">{error}</div>}
      {savedMsg && <div className="mb-3 text-green-800 bg-green-100 border border-green-200 rounded px-3 py-2 text-sm">{savedMsg}</div>}

      <div className="mb-2 text-sm">נמצאו {examples.length} דוגמאות</div>
      {examples.length > 0 && (
        <div className="mb-4 overflow-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-right">type</th>
                <th className="p-2 text-right">before</th>
                <th className="p-2 text-right">after</th>
                <th className="p-2 text-right">comment</th>
              </tr>
            </thead>
            <tbody>
              {preview.map((ex, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2 align-top">{ex.type}</td>
                  <td className="p-2 align-top whitespace-pre-wrap">{ex.before}</td>
                  <td className="p-2 align-top whitespace-pre-wrap">{ex.after}</td>
                  <td className="p-2 align-top whitespace-pre-wrap">{ex.comment || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {examples.length > preview.length && (
            <div className="p-2 text-xs text-gray-500">מציג {preview.length} מתוך {examples.length}…</div>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={onSave} disabled={examples.length === 0} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">שמור ל‑DNA</button>
      </div>
    </main>
  )
}


