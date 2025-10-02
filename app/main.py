import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .schemas import AdaptRequest, AdaptResponse, AudienceConfig
from .presets import PRESETS
from .rules import apply_rules
from .llm_adapter import refine_with_llm, LLMConfig
from langdetect import detect


app = FastAPI(title="Hebrew Adaptation API", version="0.1.0")

# Basic CORS (adjust origins in env/config later if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def healthcheck() -> dict:
    return {"status": "ok"}

@app.post("/adapt", response_model=AdaptResponse)
def adapt(req: AdaptRequest) -> AdaptResponse:
    cfg = req.audience or AudienceConfig()
    # Allow passing preset by domain string like "marketing_lp" via domain field
    if cfg.domain in PRESETS:
        cfg = PRESETS[cfg.domain]

    base_text, applied = apply_rules(req.text, cfg)

    used_llm = False
    if req.use_llm:
        provider = req.llm_provider or "openai"
        system = "את/ה עורך/ת טקסט לעברית תקנית מותאמת קהל יעד. שמרי על משמעות מדויקת."
        # Auto language detect and translate to Hebrew if requested
        try:
            src_lang = detect(base_text)
        except Exception:
            src_lang = "he"
        user_prompt = (
            "המר/י את הטקסט לעברית תקנית והיטבי אותו לפי הקונפיגורציה.\n"
            f"קהל יעד: tone={cfg.tone}, domain={cfg.domain}, level={cfg.reading_level}.\n"
            "כללים: בלי הסברים, טקסט בלבד. שמרי על RTL.\n\n"
            + base_text
        )
        if req.force_translate_to_hebrew and src_lang != "he":
            user_prompt = "תרגום מדויק לעברית + התאמה סגנונית: \n\n" + user_prompt

        improved = refine_with_llm(system=system, user=user_prompt, cfg=LLMConfig(provider=provider))
        if improved:
            base_text = improved
            used_llm = True

    return AdaptResponse(adapted_text=base_text, used_llm=used_llm, applied_rules=applied)


