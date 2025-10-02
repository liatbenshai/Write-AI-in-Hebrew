from __future__ import annotations

import os
from typing import Optional

from .base import LLMProvider

try:
    import google.generativeai as genai  # type: ignore
except Exception:  # pragma: no cover
    genai = None  # type: ignore


class GeminiProvider(LLMProvider):
    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None) -> None:
        self.api_key = api_key or os.getenv("GOOGLE_API_KEY")
        self.model = model or os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
        if genai is not None and self.api_key:
            genai.configure(api_key=self.api_key)

    def complete(self, system: str, user: str) -> Optional[str]:
        if genai is None or not self.api_key:
            return None
        try:
            model = genai.GenerativeModel(self.model)
            prompt = f"[SYSTEM]\n{system}\n[USER]\n{user}"
            resp = model.generate_content(prompt)
            return getattr(resp, "text", None)
        except Exception:
            return None


