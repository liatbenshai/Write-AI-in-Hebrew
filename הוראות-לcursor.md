# הוראות ל-Cursor - בניית הפלטפורמה

## 📋 תוכן עניינים
1. [שלב 1: הקמת פרויקט בסיסי](#שלב-1)
2. [שלב 2: הגדרת מסד נתונים](#שלב-2)
3. [שלב 3: מערכת Authentication](#שלב-3)
4. [שלב 4: בניית טופס צו ירושה](#שלב-4)
5. [שלב 5: מערכת יצירת PDF](#שלב-5)
6. [שלב 6: טופס צו קיום צוואה](#שלב-6)
7. [שלב 7: מערכת העלאת קבצים](#שלב-7)
8. [שלב 8: Dashboard וניהול בקשות](#שלב-8)
9. [שלב 9: פרסום ייצור](#שלב-9)

---

## שלב 1: הקמת פרויקט בסיסי {#שלב-1}

### 1.1 יצירת פרויקט Next.js

```bash
npx create-next-app@latest inheritance-platform --typescript --tailwind --app --src-dir --import-alias "@/*"
cd inheritance-platform
```

בחר את האפשרויות הבאות:
- ✅ TypeScript
- ✅ ESLint
- ✅ Tailwind CSS
- ✅ `src/` directory
- ✅ App Router
- ✅ Import alias (@/*)

### 1.2 התקנת חבילות נדרשות

```bash
# Form management
npm install react-hook-form @hookform/resolvers zod

# Database
npm install @prisma/client
npm install -D prisma

# PDF generation
npm install @react-pdf/renderer

# UI Components
npm install lucide-react
npm install clsx tailwind-merge
npm install @radix-ui/react-dialog
npm install @radix-ui/react-select
npm install @radix-ui/react-checkbox

# File upload
npm install react-dropzone

# Date handling
npm install date-fns

# State management (optional)
npm install zustand
```

### 1.3 מבנה תיקיות בסיסי

```bash
mkdir -p src/app/{api,tzo-yerusha,tzo-kiyum,dashboard}
mkdir -p src/components/{forms,ui,templates,layout}
mkdir -p src/lib/{validation,calculations,pdf-generator,utils}
mkdir -p src/types
mkdir -p src/hooks
mkdir -p public/{fonts,templates}
mkdir -p prisma
```

### 1.4 הגדרת Tailwind RTL

עדכן את `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-heebo)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
```

צור `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    direction: rtl;
  }
  
  body {
    @apply font-sans;
  }
}
```

### 1.5 הורדת פונט Heebo

```bash
# הורד את הפונט מ-Google Fonts
# https://fonts.google.com/specimen/Heebo
# שים את הקבצים ב-public/fonts/
```

עדכן את `src/app/layout.tsx`:

```typescript
import { Heebo } from 'next/font/google'
import './globals.css'

const heebo = Heebo({
  subsets: ['hebrew'],
  variable: '--font-heebo',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body>{children}</body>
    </html>
  )
}
```

---

## שלב 2: הגדרת מסד נתונים {#שלב-2}

### 2.1 אתחול Prisma

```bash
npx prisma init
```

### 2.2 עדכן את `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/inheritance_db?schema=public"
```

### 2.3 הגדר את `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Users
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  phone     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  requests  Request[]
}

// Request types
enum RequestType {
  TZO_YERUSHA  // צו ירושה
  TZO_KIYUM    // צו קיום צוואה
}

enum RequestStatus {
  DRAFT        // טיוטה
  SUBMITTED    // הוגשה
  IN_REVIEW    // בבדיקה
  PUBLISHED    // פורסמה
  APPROVED     // אושרה
  REJECTED     // נדחתה
}

enum MaritalStatus {
  SINGLE      // רווק/ה
  MARRIED     // נשוי/אה
  WIDOWED     // אלמן/ה
  DIVORCED    // גרוש/ה
}

// Main request model
model Request {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  type      RequestType
  status    RequestStatus @default(DRAFT)
  
  // Deceased information
  deceasedName        String
  deceasedId          String
  deceasedAddress     String
  deathDate           DateTime
  deathPlace          String
  maritalStatus       MaritalStatus
  deathCertificateNum String?
  
  // Request data (stored as JSON)
  data      Json
  
  // Documents
  documents Document[]
  
  // Tracking
  submittedAt    DateTime?
  publishedAt    DateTime?
  approvedAt     DateTime?
  rejectedAt     DateTime?
  fileNumber     String?    @unique
  
  // Notes
  notes          String?
  rejectionReason String?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([userId])
  @@index([status])
  @@index([type])
}

enum DocumentType {
  DEATH_CERTIFICATE      // תעודת פטירה
  WILL                   // צוואה
  ID_COPY                // צילום תעודת זהות
  VEHICLE_LICENSE        // רישיון רכב
  PROPERTY_DEED          // טאבו
  WAIVER_AFFIDAVIT       // תצהיר הסתלקות
  HEIR_DEATH_CERT        // תעודת פטירה של יורש
  PAYMENT_RECEIPT        // אישור תשלום
  NOTIFICATION_RECEIPT   // אישור משלוח הודעות
  SIGNED_FORM            // טופס חתום
  OTHER                  // אחר
}

model Document {
  id         String   @id @default(cuid())
  requestId  String
  request    Request  @relation(fields: [requestId], references: [id], onDelete: Cascade)
  
  type       DocumentType
  fileName   String
  fileUrl    String
  fileSize   Int
  mimeType   String
  
  uploadedAt DateTime @default(now())
  
  @@index([requestId])
}
```

### 2.4 יצירת Migration

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 2.5 יצירת Prisma Client Singleton

צור `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

## שלב 3: מערכת Authentication {#שלב-3}

### 3.1 התקנת NextAuth

```bash
npm install next-auth @auth/prisma-adapter
npm install bcryptjs
npm install -D @types/bcryptjs
```

### 3.2 עדכן את Prisma Schema להוספת טבלאות Auth:

```prisma
// הוסף ל-schema.prisma

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// עדכן את User model
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  phone         String?
  password      String?
  
  accounts      Account[]
  sessions      Session[]
  requests      Request[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

הרץ migration:
```bash
npx prisma migrate dev --name add_auth
npx prisma generate
```

### 3.3 הגדר NextAuth

צור `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'אימייל', type: 'email' },
        password: { label: 'סיסמה', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
})

export { handler as GET, handler as POST }
```

### 3.4 צור דפי Login ו-Register

`src/app/login/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('אימייל או סיסמה שגויים')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">כניסה למערכת</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">אימייל</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">סיסמה</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            התחבר
          </button>
        </form>
        
        <p className="text-center mt-4 text-sm">
          אין לך חשבון?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            הירשם כאן
          </a>
        </p>
      </div>
    </div>
  )
}
```

---

## שלב 4: בניית טופס צו ירושה {#שלב-4}

### 4.1 יצירת Types

צור `src/types/tzo-yerusha.ts`:

```typescript
export interface Applicant {
  name: string
  id: string
  address: string
  email: string
  phone: string
  relationship: string
  hasLawyer: boolean
  lawyerDetails?: {
    name: string
    licenseNumber: string
    email: string
    phone: string
  }
}

export interface Deceased {
  name: string
  id: string
  lastAddress: string
  deathDate: string
  deathPlace: string
  maritalStatus: 'רווק' | 'נשוי' | 'אלמן' | 'גרוש'
  deathCertificateNumber: string
}

export interface Heir {
  name: string
  id: string
  address: string
  relationship: string
  share: number
  legalCapacity: 'מלאה' | 'קטין' | 'חסוי' | 'נעדר'
}

export interface Spouse extends Heir {
  isAlive: boolean
  deathDate?: string
  marriageDate?: string
  hasVehicle: boolean
  vehicleDetails?: string
  hasApartment: boolean
  apartmentDetails?: {
    block: string
    parcel: string
    address: string
    livedTogether: boolean
  }
}

export interface TzoYerushaData {
  applicant: Applicant
  deceased: Deceased
  hasWill: boolean
  spouse?: Spouse
  children: Heir[]
  parents?: {
    father?: Heir
    mother?: Heir
  }
  siblings?: Heir[]
  waivers: Array<{
    heirName: string
    heirId: string
    waiverDetails: string
    inFavorOf?: {
      name: string
      id: string
      relationship: string
    }
  }>
  deceasedHeirs: Array<{
    name: string
    id: string
    relationship: string
    deathDate: string
    theirHeirs: Heir[]
  }>
  finalHeirs: Heir[]
  documents: {
    deathCertificate: string
    notificationReceipts: string
    paymentReceipt: string
    otherDocuments: string[]
  }
  declaration: {
    declarantName: string
    declarantId: string
    date: string
    witnessName: string
    witnessType: 'עורך דין' | 'שופט' | 'דיין' | 'ראש רשות מקומית'
    witnessLicenseNumber?: string
  }
}
```

### 4.2 יצירת Validation Schemas

צור `src/lib/validation/israeli-id.ts`:

```typescript
/**
 * אלגוריתם לוהן לאימות תעודת זהות ישראלית
 */
export function validateIsraeliID(id: string): boolean {
  if (!/^\d{9}$/.test(id)) {
    return false
  }

  const digits = id.split('').map(Number)
  
  const sum = digits.reduce((acc, digit, index) => {
    const step = digit * ((index % 2) + 1)
    return acc + (step > 9 ? step - 9 : step)
  }, 0)

  return sum % 10 === 0
}

/**
 * פורמט תעודת זהות עם מקפים
 */
export function formatIsraeliID(id: string): string {
  if (id.length !== 9) return id
  return `${id.slice(0, 3)}-${id.slice(3, 6)}-${id.slice(6)}`
}
```

צור `src/lib/validation/schemas.ts`:

```typescript
import { z } from 'zod'
import { validateIsraeliID } from './israeli-id'

// תעודת זהות
export const israeliIDSchema = z
  .string()
  .length(9, 'תעודת זהות חייבת להכיל 9 ספרות')
  .regex(/^\d{9}$/, 'תעודת זהות חייבת להכיל רק ספרות')
  .refine(validateIsraeliID, 'תעודת זהות לא תקינה')

// תאריך
export const dateSchema = z
  .string()
  .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'פורמט תאריך לא תקין (DD/MM/YYYY)')
  .refine((date) => {
    const [day, month, year] = date.split('/').map(Number)
    const dateObj = new Date(year, month - 1, day)
    return dateObj < new Date() && dateObj.getTime() > 0
  }, 'התאריך חייב להיות בעבר')

// טלפון
export const phoneSchema = z
  .string()
  .regex(/^0\d{8,9}$/, 'מספר טלפון לא תקין')

// אימייל
export const emailSchema = z
  .string()
  .email('כתובת אימייל לא תקינה')

// מבקש
export const applicantSchema = z.object({
  name: z.string().min(2, 'שם חייב להכיל לפחות 2 תווים'),
  id: israeliIDSchema,
  address: z.string().min(5, 'כתובת חייבת להכיל לפחות 5 תווים'),
  email: emailSchema,
  phone: phoneSchema,
  relationship: z.string().min(2, 'יש לציין את הקרבה למנוח'),
  hasLawyer: z.boolean().default(false),
  lawyerDetails: z
    .object({
      name: z.string(),
      licenseNumber: z.string(),
      email: emailSchema,
      phone: phoneSchema,
    })
    .optional(),
})

// מנוח
export const deceasedSchema = z.object({
  name: z.string().min(2, 'שם חייב להכיל לפחות 2 תווים'),
  id: israeliIDSchema,
  lastAddress: z.string().min(5, 'כתובת חייבת להכיל לפחות 5 תווים'),
  deathDate: dateSchema,
  deathPlace: z.string().min(2, 'יש לציין מקום פטירה'),
  maritalStatus: z.enum(['רווק', 'נשוי', 'אלמן', 'גרוש']),
  deathCertificateNumber: z.string().min(1, 'יש להזין מספר תעודת פטירה'),
})

// יורש
export const heirSchema = z.object({
  name: z.string().min(2),
  id: israeliIDSchema,
  address: z.string().min(5),
  relationship: z.string(),
  share: z.number().min(0).max(100),
  legalCapacity: z.enum(['מלאה', 'קטין', 'חסוי', 'נעדר']).default('מלאה'),
})

// בן זוג
export const spouseSchema = heirSchema.extend({
  isAlive: z.boolean(),
  deathDate: z.string().optional(),
  marriageDate: z.string().optional(),
  hasVehicle: z.boolean().default(false),
  vehicleDetails: z.string().optional(),
  hasApartment: z.boolean().default(false),
  apartmentDetails: z
    .object({
      block: z.string(),
      parcel: z.string(),
      address: z.string(),
      livedTogether: z.boolean(),
    })
    .optional(),
})

// בקשת צו ירושה מלאה
export const tzoYerushaSchema = z.object({
  applicant: applicantSchema,
  deceased: deceasedSchema,
  hasWill: z.boolean().default(false),
  spouse: spouseSchema.optional(),
  children: z.array(heirSchema).default([]),
  parents: z
    .object({
      father: heirSchema.optional(),
      mother: heirSchema.optional(),
    })
    .optional(),
  siblings: z.array(heirSchema).optional(),
  waivers: z
    .array(
      z.object({
        heirName: z.string(),
        heirId: israeliIDSchema,
        waiverDetails: z.string(),
        inFavorOf: z
          .object({
            name: z.string(),
            id: israeliIDSchema,
            relationship: z.string(),
          })
          .optional(),
      })
    )
    .default([]),
  deceasedHeirs: z
    .array(
      z.object({
        name: z.string(),
        id: israeliIDSchema,
        relationship: z.string(),
        deathDate: dateSchema,
        theirHeirs: z.array(heirSchema),
      })
    )
    .default([]),
  finalHeirs: z
    .array(heirSchema)
    .refine(
      (heirs) => {
        const total = heirs.reduce((sum, heir) => sum + heir.share, 0)
        return Math.abs(total - 100) < 0.01
      },
      'סך החלקים חייב להיות 100%'
    ),
  documents: z.object({
    deathCertificate: z.string().url(),
    notificationReceipts: z.string().url(),
    paymentReceipt: z.string().url(),
    otherDocuments: z.array(z.string().url()).default([]),
  }),
  declaration: z.object({
    declarantName: z.string(),
    declarantId: israeliIDSchema,
    date: dateSchema,
    witnessName: z.string(),
    witnessType: z.enum([
      'עורך דין',
      'שופט',
      'דיין',
      'ראש רשות מקומית',
    ]),
    witnessLicenseNumber: z.string().optional(),
  }),
})

export type TzoYerushaData = z.infer<typeof tzoYerushaSchema>
```

### 4.3 פונקציית חישוב חלקים

צור `src/lib/calculations/inheritance-shares.ts`:

```typescript
import type { Heir } from '@/types/tzo-yerusha'

interface ShareCalculation {
  heirs: Heir[]
  explanations: string[]
}

/**
 * חישוב חלקי יורשים על פי חוק הירושה
 */
export function calculateInheritanceShares(
  hasSpouse: boolean,
  childrenCount: number,
  hasFather: boolean,
  hasMother: boolean,
  siblingsCount: number
): ShareCalculation {
  const heirs: Heir[] = []
  const explanations: string[] = []

  // מצב 1: בן זוג + ילדים
  if (hasSpouse && childrenCount > 0) {
    explanations.push('סעיף 10 לחוק הירושה: בן זוג + ילדים')
    explanations.push('בן הזוג יורש 50% מהעיזבון')
    explanations.push(`הילדים יורשים 50% בחלקים שווים (${(50 / childrenCount).toFixed(2)}% כל אחד)`)

    heirs.push({
      name: 'בן/בת זוג',
      id: '',
      address: '',
      relationship: 'בן/בת זוג',
      share: 50,
      legalCapacity: 'מלאה',
    })

    const childShare = 50 / childrenCount
    for (let i = 1; i <= childrenCount; i++) {
      heirs.push({
        name: `ילד/ה ${i}`,
        id: '',
        address: '',
        relationship: 'בן/בת',
        share: childShare,
        legalCapacity: 'מלאה',
      })
    }

    return { heirs, explanations }
  }

  // מצב 2: בן זוג + הורים (ללא ילדים)
  if (hasSpouse && (hasFather || hasMother)) {
    const parentCount = (hasFather ? 1 : 0) + (hasMother ? 1 : 0)
    const parentShare = 33.33 / parentCount

    explanations.push('סעיף 11 לחוק הירושה: בן זוג + הורים (ללא ילדים)')
    explanations.push('בן הזוג יורש 2/3 (66.67%) מהעיזבון')
    explanations.push(`ההורים יורשים 1/3 (33.33%) בחלקים שווים (${parentShare.toFixed(2)}% כל אחד)`)

    heirs.push({
      name: 'בן/בת זוג',
      id: '',
      address: '',
      relationship: 'בן/בת זוג',
      share: 66.67,
      legalCapacity: 'מלאה',
    })

    if (hasFather) {
      heirs.push({
        name: 'אב',
        id: '',
        address: '',
        relationship: 'אב',
        share: parentShare,
        legalCapacity: 'מלאה',
      })
    }

    if (hasMother) {
      heirs.push({
        name: 'אם',
        id: '',
        address: '',
        relationship: 'אם',
        share: parentShare,
        legalCapacity: 'מלאה',
      })
    }

    return { heirs, explanations }
  }

  // מצב 3: רק בן זוג (ללא ילדים והורים)
  if (hasSpouse) {
    explanations.push('סעיף 11 לחוק הירושה: רק בן זוג')
    explanations.push('בן הזוג יורש את כל העיזבון (100%)')

    heirs.push({
      name: 'בן/בת זוג',
      id: '',
      address: '',
      relationship: 'בן/בת זוג',
      share: 100,
      legalCapacity: 'מלאה',
    })

    return { heirs, explanations }
  }

  // מצב 4: רק ילדים (ללא בן זוג)
  if (childrenCount > 0) {
    const childShare = 100 / childrenCount

    explanations.push('סעיף 10 לחוק הירושה: רק ילדים (ללא בן זוג)')
    explanations.push(`הילדים יורשים את כל העיזבון בחלקים שווים (${childShare.toFixed(2)}% כל אחד)`)

    for (let i = 1; i <= childrenCount; i++) {
      heirs.push({
        name: `ילד/ה ${i}`,
        id: '',
        address: '',
        relationship: 'בן/בת',
        share: childShare,
        legalCapacity: 'מלאה',
      })
    }

    return { heirs, explanations }
  }

  // מצב 5: רק הורים (ללא בן זוג וילדים)
  if (hasFather || hasMother) {
    const parentCount = (hasFather ? 1 : 0) + (hasMother ? 1 : 0)
    const parentShare = 100 / parentCount

    explanations.push('סעיף 12 לחוק הירושה: רק הורים')
    explanations.push(`ההורים יורשים את כל העיזבון בחלקים שווים (${parentShare.toFixed(0)}% כל אחד)`)

    if (hasFather) {
      heirs.push({
        name: 'אב',
        id: '',
        address: '',
        relationship: 'אב',
        share: parentShare,
        legalCapacity: 'מלאה',
      })
    }

    if (hasMother) {
      heirs.push({
        name: 'אם',
        id: '',
        address: '',
        relationship: 'אם',
        share: parentShare,
        legalCapacity: 'מלאה',
      })
    }

    return { heirs, explanations }
  }

  // מצב 6: רק אחים
  if (siblingsCount > 0) {
    const siblingShare = 100 / siblingsCount

    explanations.push('סעיף 13 לחוק הירושה: רק אחים')
    explanations.push(`האחים יורשים את כל העיזבון בחלקים שווים (${siblingShare.toFixed(2)}% כל אחד)`)

    for (let i = 1; i <= siblingsCount; i++) {
      heirs.push({
        name: `אח/אחות ${i}`,
        id: '',
        address: '',
        relationship: 'אח/אחות',
        share: siblingShare,
        legalCapacity: 'מלאה',
      })
    }

    return { heirs, explanations }
  }

  // אין יורשים - המדינה
  explanations.push('סעיף 14 לחוק הירושה: אין יורשים')
  explanations.push('המדינה יורשת את כל העיזבון')

  heirs.push({
    name: 'מדינת ישראל',
    id: '',
    address: '',
    relationship: 'המדינה',
    share: 100,
    legalCapacity: 'מלאה',
  })

  return { heirs, explanations }
}

/**
 * בדיקה אם חלוקת החלקים תקינה (סכום 100%)
 */
export function validateSharesTotal(heirs: Heir[]): {
  isValid: boolean
  total: number
  message: string
} {
  const total = heirs.reduce((sum, heir) => sum + heir.share, 0)
  const isValid = Math.abs(total - 100) < 0.01

  return {
    isValid,
    total,
    message: isValid
      ? 'החלוקה תקינה'
      : `סכום החלקים הוא ${total.toFixed(2)}% ולא 100%`,
  }
}
```

---

להמשך...

האם אתה רוצה שאמשיך עם:
1. שלב 5 - מערכת יצירת PDF
2. קומפוננטות הטפסים
3. דוגמאות API routes
4. משהו אחר?
