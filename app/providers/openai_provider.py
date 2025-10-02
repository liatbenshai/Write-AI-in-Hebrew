from __future__ import annotations

import os
from typing import Optional

from .base import LLMProvider

try:
    from openai import OpenAI  # type: ignore
except Exception:  # pragma: no cover
    OpenAI = None  # type: ignore


class OpenAIProvider(LLMProvider):
    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None) -> None:
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        self.model = model or os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    def complete(self, system: str, user: str) -> Optional[str]:
        if OpenAI is None or not self.api_key:
            return None
        client = OpenAI(api_key=self.api_key)
        try:
            resp = client.chat.completions.create(
                model=self.model,
                messages=[{"role": "system", "content": system}, {"role": "user", "content": user}],
                temperature=0.2,
            )
            return resp.choices[0].message.content or None
        except Exception:
            return None


