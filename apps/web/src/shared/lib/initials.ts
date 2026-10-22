const MAX_INITIALS = 2;
const WORD_SEPARATOR = /\s+/;

export function getInitials(name: string): string {
  return name
    .trim()
    .split(WORD_SEPARATOR)
    .slice(0, MAX_INITIALS)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}
