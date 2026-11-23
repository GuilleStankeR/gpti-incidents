import type { CategoryCode } from '../category-code.js';
import {
  CATEGORY_KEYWORDS,
  CLASSIFIABLE_CATEGORY_CODES,
  LOCATION_HINTS,
} from './category-keywords.catalog.js';
import type { ClassifiableCategoryCode } from './category-keywords.types.js';
import { extractWords, normalizeText } from './text-normalization.js';
import type { TextWord } from './text-normalization.js';

const STRONG_TERM_WEIGHT = 3;
const MODERATE_TERM_WEIGHT = 1;
const MIN_SUGGESTION_SCORE = 2;
const HIGH_CONFIDENCE_MIN_SCORE = 4;
const HIGH_CONFIDENCE_MIN_MARGIN = 3;
const TERM_NOT_FOUND = -1;

export const SuggestionConfidence = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
} as const;

export type SuggestionConfidence = (typeof SuggestionConfidence)[keyof typeof SuggestionConfidence];

export interface CategorySuggestionInput {
  readonly description: string;
  readonly location?: string;
}

export interface CategorySuggestion {
  readonly categoryCode: CategoryCode;
  readonly confidence: SuggestionConfidence;
  readonly matchedTerms: readonly string[];
}

interface KeywordTerm {
  readonly words: readonly string[];
  readonly weight: number;
}

interface CompiledCategory {
  readonly categoryCode: ClassifiableCategoryCode;
  readonly terms: readonly KeywordTerm[];
}

interface TermMatch {
  readonly start: number;
  readonly label: string;
  readonly weight: number;
}

interface CategoryScore {
  readonly categoryCode: ClassifiableCategoryCode;
  readonly score: number;
  readonly matchedTerms: readonly string[];
}

function compileTerms(terms: readonly string[], weight: number): KeywordTerm[] {
  return terms.map((term) => ({ words: normalizeText(term).split(' '), weight }));
}

function compareTermPriority(first: KeywordTerm, second: KeywordTerm): number {
  const lengthDifference = second.words.length - first.words.length;
  return lengthDifference === 0 ? second.weight - first.weight : lengthDifference;
}

const COMPILED_CATEGORIES: readonly CompiledCategory[] = CLASSIFIABLE_CATEGORY_CODES.map(
  (categoryCode) => ({
    categoryCode,
    terms: [
      ...compileTerms(CATEGORY_KEYWORDS[categoryCode].strong, STRONG_TERM_WEIGHT),
      ...compileTerms(CATEGORY_KEYWORDS[categoryCode].moderate, MODERATE_TERM_WEIGHT),
    ].toSorted(compareTermPriority),
  }),
);

function matchesAt(words: readonly TextWord[], term: KeywordTerm, start: number): boolean {
  return term.words.every(
    (termWord, offset) => words[start + offset]?.normalized.startsWith(termWord) === true,
  );
}

function isFree(consumed: ReadonlySet<number>, start: number, length: number): boolean {
  return Array.from({ length }, (_value, offset) => start + offset).every(
    (position) => !consumed.has(position),
  );
}

function findTermStart(
  words: readonly TextWord[],
  term: KeywordTerm,
  consumed: ReadonlySet<number>,
): number {
  for (let start = 0; start + term.words.length <= words.length; start += 1) {
    if (matchesAt(words, term, start) && isFree(consumed, start, term.words.length)) {
      return start;
    }
  }

  return TERM_NOT_FOUND;
}

function findTermMatches(words: readonly TextWord[], terms: readonly KeywordTerm[]): TermMatch[] {
  const consumed = new Set<number>();
  const matches: TermMatch[] = [];

  for (const term of terms) {
    const start = findTermStart(words, term, consumed);

    if (start !== TERM_NOT_FOUND) {
      const matchedWords = words.slice(start, start + term.words.length);
      for (let offset = 0; offset < matchedWords.length; offset += 1) {
        consumed.add(start + offset);
      }
      matches.push({
        start,
        label: matchedWords.map((word) => word.original).join(' '),
        weight: term.weight,
      });
    }
  }

  return matches.toSorted((first, second) => first.start - second.start);
}

function locationWeight(category: CompiledCategory, location: string | undefined): number {
  const hint = location === undefined ? undefined : LOCATION_HINTS[location];
  return hint?.categoryCode === category.categoryCode ? hint.weight : 0;
}

function scoreCategory(
  category: CompiledCategory,
  words: readonly TextWord[],
  location: string | undefined,
): CategoryScore {
  const matches = findTermMatches(words, category.terms);
  const termsScore = matches.reduce((total, match) => total + match.weight, 0);

  return {
    categoryCode: category.categoryCode,
    score: termsScore + locationWeight(category, location),
    matchedTerms: matches.map((match) => match.label),
  };
}

function resolveConfidence(score: number, margin: number): SuggestionConfidence {
  const isHigh = score >= HIGH_CONFIDENCE_MIN_SCORE && margin >= HIGH_CONFIDENCE_MIN_MARGIN;
  return isHigh ? SuggestionConfidence.HIGH : SuggestionConfidence.MEDIUM;
}

export function suggestCategory({
  description,
  location,
}: CategorySuggestionInput): CategorySuggestion | null {
  const words = extractWords(description);
  const [best, runnerUp] = COMPILED_CATEGORIES.map((category) =>
    scoreCategory(category, words, location),
  )
    .filter((categoryScore) => categoryScore.matchedTerms.length > 0)
    .toSorted((first, second) => second.score - first.score);

  if (best === undefined || best.score < MIN_SUGGESTION_SCORE || best.score === runnerUp?.score) {
    return null;
  }

  return {
    categoryCode: best.categoryCode,
    confidence: resolveConfidence(best.score, best.score - (runnerUp?.score ?? 0)),
    matchedTerms: best.matchedTerms,
  };
}
