export const DESCRIPTION_MIN_LENGTH = 10;
export const DESCRIPTION_MAX_LENGTH = 2000;
export const NOTE_MIN_LENGTH = 10;
export const NOTE_MAX_LENGTH = 1000;
export const SEARCH_MAX_LENGTH = 100;
export const OCCURRED_AT_MAX_AGE_DAYS = 30;

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const DEFAULT_METRICS_PERIOD_DAYS = 90;

export const ACCEPTED_PHOTO_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export type PhotoMimeType = (typeof ACCEPTED_PHOTO_MIME_TYPES)[number];
