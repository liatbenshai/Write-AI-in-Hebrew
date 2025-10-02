import { NextRequest, NextResponse } from 'next/server'

type LearnEvent = {
  kind: 'edit_saved' | 'feedback';
  before: string;
  after: string;
  changes?: string[];
  score?: number;
  feedback?: 'up' | 'down';
  comment?: string;
  type?: 'legal' | 'content' | 'academic';
  ts?: number;
}

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body: LearnEvent = await req.json()
    if (!body?.before || !body?.after) return NextResponse.json({ error: 'missing fields' }, { status: 400 })
    
    const event: LearnEvent = {
      ...body,
      ts: body.ts || Date.now(),
    }
    
    // TODO: בעתיד - שמירה ב-database מרכזי
    // כרגע: החזרת האירוע ללקוח לשמירה ב-localStorage
    // זה מאפשר למידה אישית לכל משתמש
    
    // אפשר להוסיף כאן לוגיקה של:
    // 1. שמירה ב-file system לגיבוי
    // 2. ניתוח דפוסים נפוצים
    // 3. שיתוף דוגמאות בין משתמשים (אם מורשה)
    
    return NextResponse.json({ 
      ok: true, 
      event,
      message: 'הדוגמה נשמרה ותשפיע על שיפורים עתידיים' 
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ ok: true })
}


