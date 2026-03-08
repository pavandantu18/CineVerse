export const PLACEHOLDER_POSTER = '/placeholder-poster.svg';
export const PLACEHOLDER_PERSON = '/placeholder-person.svg';

// Safe text fallback: handles null, undefined, and empty strings
export const safeText = (value, fallback) =>
  value && value.trim() ? value.trim() : fallback;
