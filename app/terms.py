from __future__ import annotations

from typing import Dict


# Hebrew domain-specific term dictionaries.
# Keys are lower-case; replacements are in Hebrew.

MARKETING_TERMS: Dict[str, str] = {
    "cta": "קריאה לפעולה",
    "lead": "ליד",
    "leads": "לידים",
    "newsletter": "ניוזלטר",
    "landing page": "עמוד נחיתה",
    "brand": "מותג",
    "branding": "מיתוג",
    "engagement": "מעורבות",
    "conversion": "המרה",
    "conversions": "המרות",
}

EDUCATION_TERMS: Dict[str, str] = {
    "assignment": "מטלה",
    "lecture": "הרצאה",
    "tutorial": "תרגול",
    "exam": "בחינה",
    "quiz": "חידון",
    "homework": "שיעורי בית",
    "syllabus": "סילבוס",
}

GOVERNMENT_TERMS: Dict[str, str] = {
    "notice": "הודעה",
    "policy": "מדיניות",
    "regulation": "תקנה",
    "regulations": "תקנות",
    "application": "בקשה",
}

LEGAL_TERMS: Dict[str, str] = {
    "agreement": "הסכם",
    "contract": "חוזה",
    "clause": "סעיף",
    "party": "צד",
    "parties": "צדדים",
}

TECH_TERMS: Dict[str, str] = {
    "cloud": "ענן",
    "endpoint": "נקודת קצה",
    "api": "API",
    "database": "מסד נתונים",
    "frontend": "פרונטאנד",
    "backend": "בקאנד",
    "latency": "זמן תגובה",
}

GENERAL_TERMS: Dict[str, str] = {
    "ai": "בינה מלאכותית",
    "faq": "שאלות ותשובות",
}

DOMAIN_TO_TERMS: Dict[str, Dict[str, str]] = {
    "marketing": MARKETING_TERMS,
    "education": EDUCATION_TERMS,
    "government": GOVERNMENT_TERMS,
    "legal": LEGAL_TERMS,
    "tech": TECH_TERMS,
    "general": GENERAL_TERMS,
}


