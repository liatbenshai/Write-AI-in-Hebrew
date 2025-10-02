from typing import Literal, Optional
from pydantic import BaseModel, Field


AudienceTone = Literal[
    "formal",
    "semi_formal",
    "casual",
]

AudienceDomain = Literal[
    "education",
    "marketing",
    "government",
    "legal",
    "tech",
    "general",
]

SpellingMode = Literal[
    "off",          # no change
    "ktiv_male",    # כתיב מלא
    "ktiv_haser",   # כתיב חסר
]


class AudienceConfig(BaseModel):
    tone: AudienceTone = Field(default="semi_formal")
    domain: AudienceDomain = Field(default="general")
    reading_level: int = Field(default=5, ge=1, le=10)
    rtl: bool = Field(default=True)
    enforce_niqqud: bool = Field(default=False)
    keep_english_terms: bool = Field(default=True)
    prefer_hebrew_slang: bool = Field(default=False)
    protected_terms: list[str] = Field(default_factory=list, description="English terms to keep as-is (allowlist)")
    spelling_mode: SpellingMode = Field(default="off")


class AdaptRequest(BaseModel):
    text: str = Field(min_length=1)
    audience: Optional[AudienceConfig] = None
    use_llm: bool = False
    llm_provider: Optional[Literal["openai", "anthropic", "gemini"]] = None
    force_translate_to_hebrew: bool = True


class AdaptResponse(BaseModel):
    adapted_text: str
    used_llm: bool
    applied_rules: list[str]

