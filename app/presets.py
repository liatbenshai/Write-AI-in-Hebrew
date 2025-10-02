from .schemas import AudienceConfig


PRESETS: dict[str, AudienceConfig] = {
    "school_kids": AudienceConfig(tone="casual", domain="education", reading_level=3),
    "high_school": AudienceConfig(tone="semi_formal", domain="education", reading_level=5),
    "academia": AudienceConfig(tone="formal", domain="education", reading_level=8),
    "gov_notice": AudienceConfig(tone="formal", domain="government", reading_level=7, keep_english_terms=False),
    "marketing_lp": AudienceConfig(tone="casual", domain="marketing", reading_level=4),
    "legal_doc": AudienceConfig(tone="formal", domain="legal", reading_level=9, keep_english_terms=False),
}


