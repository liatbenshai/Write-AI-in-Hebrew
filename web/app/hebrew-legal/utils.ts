// Utilities for deterministic replacements and highlighting

export function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Build a whole-word regex supporting Unicode letters/digits boundaries
export function buildWholeWordRegex(phrase: string): RegExp {
  const pattern = escapeRegex(phrase);
  // Negative lookbehind/ahead for letters or digits to avoid partial word matches
  return new RegExp(`(?<![\\p{L}\\p{N}])(${pattern})(?![\\p{L}\\p{N}])`, 'iu');
}

export function buildMultiPhraseRegex(phrases: string[]): RegExp {
  // Sort by length desc to prefer longer matches first
  const alternation = phrases
    .slice()
    .sort((a, b) => b.length - a.length)
    .map(p => escapeRegex(p))
    .join('|');
  return new RegExp(`(?<![\\p{L}\\p{N}])(${alternation})(?![\\p{L}\\p{N}])`, 'iu');
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function highlightOccurrences(
  text: string,
  phrases: string[],
  highlightClass = 'bg-yellow-100'
): string {
  if (!text || phrases.length === 0) return escapeHtml(text);
  const regex = buildMultiPhraseRegex(phrases);
  // Replace while preserving original case of match
  const escaped = escapeHtml(text);
  // We cannot safely apply regex on escaped HTML (entity boundaries). Instead, apply on raw and map.
  // Simpler approach: apply on raw and then escape each chunk separately.
  const parts: Array<{ type: 'text' | 'mark'; value: string }> = [];
  let lastIndex = 0;
  const raw = text;
  raw.replace(regex, (match, _g1, offset) => {
    if (offset > lastIndex) {
      parts.push({ type: 'text', value: raw.slice(lastIndex, offset) });
    }
    parts.push({ type: 'mark', value: match });
    lastIndex = offset + match.length;
    return match;
  });
  if (lastIndex < raw.length) {
    parts.push({ type: 'text', value: raw.slice(lastIndex) });
  }
  return parts
    .map(p =>
      p.type === 'text'
        ? escapeHtml(p.value)
        : `<mark class="${highlightClass}">${escapeHtml(p.value)}</mark>`
    )
    .join('');
}


