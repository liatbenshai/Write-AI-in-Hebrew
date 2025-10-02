from typing import Literal, Optional

from pydantic import BaseModel

from .providers.openai_provider import OpenAIProvider
from .providers.anthropic_provider import AnthropicProvider
from .providers.gemini_provider import GeminiProvider


ProviderName = Literal["openai", "anthropic", "gemini"]


class LLMConfig(BaseModel):
    provider: ProviderName = "openai"
    model: Optional[str] = None


def refine_with_llm(system: str, user: str, cfg: LLMConfig) -> Optional[str]:
    provider = cfg.provider
    if provider == "openai":
        client = OpenAIProvider(model=cfg.model)
    elif provider == "anthropic":
        client = AnthropicProvider(model=cfg.model)
    else:
        client = GeminiProvider(model=cfg.model)
    return client.complete(system=system, user=user)


