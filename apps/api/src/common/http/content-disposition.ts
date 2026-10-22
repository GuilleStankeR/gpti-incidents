const NON_PRINTABLE_ASCII = /[^ -~]/g;
const DOUBLE_QUOTE = /"/g;
const REPLACEMENT_CHARACTER = '_';

export type DispositionType = 'inline' | 'attachment';

export function buildContentDisposition(type: DispositionType, fileName: string): string {
  const asciiFileName = fileName
    .replaceAll(NON_PRINTABLE_ASCII, REPLACEMENT_CHARACTER)
    .replaceAll(DOUBLE_QUOTE, REPLACEMENT_CHARACTER);

  return `${type}; filename="${asciiFileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`;
}
