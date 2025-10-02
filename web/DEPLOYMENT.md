# 🚀 מדריך פריסה ל-Vercel

## דרישות מוקדמות

1. ✅ חשבון GitHub
2. ✅ חשבון Vercel
3. ✅ Anthropic API Key

---

## 📝 שלבי הפריסה

### שלב 1: העלאה ל-GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### שלב 2: פריסה ב-Vercel

1. היכנסי ל-https://vercel.com
2. לחצי על "Add New" → "Project"
3. בחרי את ה-repository שלך מ-GitHub
4. Vercel יזהה אוטומטית שזה Next.js
5. הוסיפי Environment Variable:
   - Key: `ANTHROPIC_API_KEY`
   - Value: המפתח שלך מ-Anthropic
6. לחצי "Deploy"

### שלב 3: המתנה לסיום

הפריסה תיקח 2-3 דקות. בסוף תקבלי:
- ✅ URL ציבורי (משהו כמו: `your-project.vercel.app`)
- ✅ SSL אוטומטי (https)
- ✅ כל התכונות עובדות!

---

## 🔒 הגדרת Environment Variables

אחרי הפריסה, ב-Vercel Dashboard:

1. Project Settings → Environment Variables
2. הוסיפי:
   - `ANTHROPIC_API_KEY` = המפתח שלך

---

## 🗄️ Database להרחבה עתידית (אופציונלי)

כשתרצי לשדרג את DNA Learning לשמירה מרכזית:

### אפשרות 1: Vercel Postgres (מומלץ)
```bash
vercel postgres create
```

### אפשרות 2: Supabase (חינם)
1. צרי פרויקט ב-https://supabase.com
2. העתיקי את ה-DATABASE_URL
3. הוסיפי ב-Vercel Environment Variables

---

## 🎯 בדיקה

אחרי הפריסה, בדקי:
- ✅ דף הבית טוען
- ✅ מודול צוואות עובד
- ✅ שיפור עברית משפטית עובד
- ✅ ייצוא ל-PDF/Word עובד

---

## 🆘 פתרון בעיות

### שגיאה: "Build failed"
- בדקי שה-ANTHROPIC_API_KEY מוגדר נכון
- בדקי שכל התלויות מותקנות

### שגיאה: "API not working"
- ודאי ש-ANTHROPIC_API_KEY תקין
- בדקי את ה-Console ב-Vercel Dashboard

### שגיאה: "Fonts not loading"
- זה תקין! הגופנים ייטענו אוטומטית

---

## 📊 מעקב שימוש

ב-Vercel Dashboard תוכלי לראות:
- 📈 כמה בקשות API
- 📊 זמני טעינה
- 🔍 לוגים של שגיאות

---

## 🔄 עדכונים עתידיים

כל פעם שתעשי push ל-GitHub:
```bash
git add .
git commit -m "Update description"
git push
```

Vercel יעשה deploy אוטומטי! ✨

---

## 💡 טיפים

1. **Custom Domain**: אפשר לחבר דומיין משלך ב-Vercel
2. **Analytics**: הפעילי Vercel Analytics (חינם!)
3. **Preview Deployments**: כל branch מקבל URL לבדיקה
4. **Rollback**: אפשר לחזור לגרסה קודמת בקליק

---

## ✨ מוכן לשימוש!

אחרי הפריסה, שתפי את ה-URL עם:
- 👥 המשרד שלך
- 💼 לקוחות
- 🌍 כל מי שצריך!

---

נוצר ב-2025 | פלטפורמה לשיפור עברית משפטית 🇮🇱

