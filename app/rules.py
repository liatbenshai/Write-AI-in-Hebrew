from __future__ import annotations

from dataclasses import dataclass
from typing import Callable, List

from .schemas import AudienceConfig
from .terms import DOMAIN_TO_TERMS
import re


Transform = Callable[[str, AudienceConfig], str]


@dataclass
class Rule:
    name: str
    apply: Transform


def trim_whitespace(text: str, _: AudienceConfig) -> str:
    return "\n".join(line.strip() for line in text.strip().splitlines())


def normalize_punctuation(text: str, _: AudienceConfig) -> str:
    replacements = {
        "…": "...",
        # convert ascii hyphen to Hebrew makaf where surrounded by Hebrew letters (handled later)
        "–": "-",
        "—": "-",
        "´": "'",
        "`": "'",
        '“': '"',
        '”': '"',
        "’": "'",
    }
    for src, dst in replacements.items():
        text = text.replace(src, dst)
    # Ensure single space after punctuation
    for p in [".", ",", ";", ":", "!", "?"]:
        text = text.replace(f"{p}  ", f"{p} ")
    return text


def hebrew_formality(text: str, cfg: AudienceConfig) -> str:
    # Very lightweight tone adjustments as placeholders
    if cfg.tone == "formal":
        text = text.replace("את/ה", "אתה/את").replace("היי", "שלום")
        text = text.replace("תודה!", "תודה רבה.")
    elif cfg.tone == "casual":
        text = text.replace("שלום", "היי").replace("ברצוננו", "אנחנו רוצים")
    return text


def spelling_normalization(text: str, cfg: AudienceConfig) -> str:
    # Conservative, common pairs only. No aggressive morphology.
    mode = getattr(cfg, "spelling_mode", "off")
    if mode == "off":
        return text
    pairs_male = {
        "לעיתים": "לעתים",
        "מאורע": "מאורע",  # unchanged example
        "מייל": "דוא""ל",  # optional style; leave if unwanted
        "פייסבוק": "פייסבוק",  # unchanged
    }
    pairs_haser = {
        "לעתים": "לעיתים",
    }
    pairs = pairs_male if mode == "ktiv_male" else pairs_haser
    for src, dst in pairs.items():
        text = text.replace(src, dst)
    return text


def remove_niqqud(text: str, cfg: AudienceConfig) -> str:
    if cfg.enforce_niqqud:
        return text
    # Strip basic niqqud range
    return "".join(ch for ch in text if not (0x0591 <= ord(ch) <= 0x05BD or 0x05BF == ord(ch) or 0x05C1 <= ord(ch) <= 0x05C7))


def enforce_rtl_marks(text: str, cfg: AudienceConfig) -> str:
    if not cfg.rtl:
        return text
    # Simple heuristic: wrap with RLE/PDF for better RTL in mixed text
    RLE = "\u202B"
    PDF = "\u202C"
    return f"{RLE}{text}{PDF}"


def normalize_dates_units(text: str, _: AudienceConfig) -> str:
    # Basic patterns: dates dd/mm/yyyy -> dd.mm.yyyy or textual Hebrew months
    # Units: km, kg, cm, % -> הוספת רווח אחיד והמרה בסיסית
    # This is intentionally conservative.
    # Date: 12/03/2025 -> 12.03.2025
    text = re.sub(r"\b(\d{1,2})/(\d{1,2})/(\d{4})\b", r"\1.\2.\3", text)
    # Percent: 50% -> 50%
    text = re.sub(r"\s*%\b", "%", text)
    # Add thin space between number and unit (approx: regular space)
    for unit in ["ק""ג", "ק""מ", "ס""מ", "מ""מ", "קמ", "סמ", "ממ", "ש", "דק", "שנ", "ד׳", "ש׳", "קמ""ש"]:
        text = re.sub(rf"(\d)\s*{unit}\b", rf"\1 {unit}", text)
    # English units to Hebrew abbreviations
    text = re.sub(r"\bkm\/h\b", "קמ""ש", text, flags=re.IGNORECASE)
    text = re.sub(r"\bkm\b", "ק""מ", text, flags=re.IGNORECASE)
    text = re.sub(r"\bkg\b", "ק""ג", text, flags=re.IGNORECASE)
    text = re.sub(r"\bcm\b", "ס""מ", text, flags=re.IGNORECASE)
    return text


def hebrew_typography(text: str, _: AudienceConfig) -> str:
    # Hebrew quotes: prefer double Guillemets or Hebrew style quotes
    # Replace straight quotes around words with Hebrew quotes

    def replace_quotes(match: re.Match[str]) -> str:
        inner = match.group(1)
        return f"\u05F4{inner}\u05F4"  # Gershayim U+05F4

    text = re.sub(r'"([^\n"]{1,80})"', replace_quotes, text)

    # Hebrew makaf (U+05BE) for hyphen between Hebrew letters
    def makaf_between_hebrew(match: re.Match[str]) -> str:
        left = match.group(1)
        right = match.group(2)
        return f"{left}\u05BE{right}"

    heb = r"[\u0590-\u05FF]"
    text = re.sub(fr"({heb})-({heb})", makaf_between_hebrew, text)
    # Normalize Hebrew punctuation spacing: no space before, single after
    for p in [".", ",", ";", ":", "!", "?", "\u05BE"]:
        text = text.replace(f" {p}", p)
        text = text.replace(f"{p}  ", f"{p} ")
    return text


def apply_domain_terms(text: str, cfg: AudienceConfig) -> str:
    # Replace English terms with Hebrew equivalents for the selected domain
    terms = DOMAIN_TO_TERMS.get(cfg.domain, {})
    protected = {t.lower() for t in getattr(cfg, "protected_terms", [])}
    for src_en, dst_he in terms.items():
        if cfg.keep_english_terms:
            continue
        if src_en.lower() in protected:
            continue
        # case-insensitive word boundary replacement
        pattern = re.compile(rf"\b{re.escape(src_en)}\b", re.IGNORECASE)
        text = pattern.sub(dst_he, text)
    return text


def normalize_dates_academy(text: str, _: AudienceConfig) -> str:
    months = {
        "january": "ינואר", "jan": "ינואר",
        "february": "פברואר", "feb": "פברואר",
        "march": "מרץ", "mar": "מרץ",
        "april": "אפריל", "apr": "אפריל",
        "may": "מאי",
        "june": "יוני", "jun": "יוני",
        "july": "יולי", "jul": "יולי",
        "august": "אוגוסט", "aug": "אוגוסט",
        "september": "ספטמבר", "sep": "ספטמבר", "sept": "ספטמבר",
        "october": "אוקטובר", "oct": "אוקטובר",
        "november": "נובמבר", "nov": "נובמבר",
        "december": "דצמבר", "dec": "דצמבר",
    }

    def month_to_he(m: str) -> str:
        return months.get(m.lower(), m)

    # US-style: MonthName dd, yyyy -> dd בחודש yyyy
    def repl_month_first(match: re.Match[str]) -> str:
        mon = month_to_he(match.group(1))
        day = int(match.group(2))
        year = match.group(3)
        return f"{day} ב{mon} {year}"

    # Day first: dd MonthName yyyy -> dd בחודש yyyy
    def repl_day_first(match: re.Match[str]) -> str:
        day = int(match.group(1))
        mon = month_to_he(match.group(2))
        year = match.group(3)
        return f"{day} ב{mon} {year}"

    # Apply replacements
    text = re.sub(r"\b([A-Za-z]{3,9})\s+(\d{1,2}),?\s+(\d{4})\b", repl_month_first, text)
    text = re.sub(r"\b(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})\b", repl_day_first, text)
    # ISO 2025-03-05 -> 5.3.2025
    text = re.sub(r"\b(\d{4})-(\d{2})-(\d{2})\b", lambda m: f"{int(m.group(3))}.{int(m.group(2))}.{m.group(1)}", text)
    return text


PIPELINE: List[Rule] = [
    Rule("trim_whitespace", trim_whitespace),
    Rule("normalize_punctuation", normalize_punctuation),
    Rule("hebrew_formality", hebrew_formality),
    Rule("apply_domain_terms", apply_domain_terms),
    Rule("normalize_dates_academy", normalize_dates_academy),
    Rule("normalize_dates_units", normalize_dates_units),
    Rule("spelling_normalization", spelling_normalization),
    Rule("remove_niqqud", remove_niqqud),
    Rule("hebrew_typography", hebrew_typography),
    Rule("enforce_rtl_marks", enforce_rtl_marks),
]


def apply_rules(text: str, cfg: AudienceConfig) -> tuple[str, list[str]]:
    applied: list[str] = []
    for rule in PIPELINE:
        new_text = rule.apply(text, cfg)
        if new_text != text:
            applied.append(rule.name)
            text = new_text
    return text, applied


