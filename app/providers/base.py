from __future__ import annotations

from typing import Optional, Protocol


class LLMProvider(Protocol):
    def complete(self, system: str, user: str) -> Optional[str]:
        ...


