from __future__ import annotations

import os
from typing import Optional

from .base import LLMProvider

try:
    import anthropic  # type: ignore
except Exception:  # pragma: no cover
    anthropic = None  # type: ignore


class AnthropicProvider(LLMProvider):
    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None) -> None:
        self.api_key = api_key or os.getenv("ANTHROPIC_API_KEY")
        self.model = model or os.getenv("ANTHROPIC_MODEL", "claude-3-haiku-20240307")

    def complete(self, system: str, user: str) -> Optional[str]:
        if anthropic is None or not self.api_key:
            return None
        client = anthropic.Anthropic(api_key=self.api_key)
        try:
            msg = client.messages.create(
                model=self.model,
                max_tokens=2048,
                system=system,
                messages=[{"role": "user", "content": user}],
                temperature=0.2,
            )
            # anthropic returns content as list of blocks
            parts = getattr(msg, "content", [])
            if parts and hasattr(parts[0], "text"):
                return parts[0].text
            # fallback
            return None
        except Exception:
            return None


