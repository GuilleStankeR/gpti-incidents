const DIACRITIC_PATTERN = /\p{Diacritic}/gu;
const WORD_PATTERN = /[\p{L}\p{N}]+/gu;

export interface TextWord {
  readonly original: string;
  readonly normalized: string;
}

export function normalizeText(text: string): string {
  return text.normalize('NFD').replaceAll(DIACRITIC_PATTERN, '').toLowerCase();
}

export function extractWords(text: string): readonly TextWord[] {
  return Array.from(text.matchAll(WORD_PATTERN), ([word]) => ({
    original: word.toLowerCase(),
    normalized: normalizeText(word),
  }));
}
