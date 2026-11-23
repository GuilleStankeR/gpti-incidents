import qrcode from 'qrcode-generator';

const AUTOMATIC_TYPE_NUMBER = 0;
const ERROR_CORRECTION_LEVEL = 'Q';

export type QrMatrix = readonly (readonly boolean[])[];

export function createQrMatrix(text: string): QrMatrix {
  const qr = qrcode(AUTOMATIC_TYPE_NUMBER, ERROR_CORRECTION_LEVEL);
  qr.addData(text);
  qr.make();
  const size = qr.getModuleCount();

  return Array.from({ length: size }, (_row, rowIndex) =>
    Array.from({ length: size }, (_column, columnIndex) => qr.isDark(rowIndex, columnIndex)),
  );
}

export function toQrSvgPath(matrix: QrMatrix, offset: number): string {
  return matrix
    .flatMap((row, rowIndex) =>
      row.flatMap((isDark, columnIndex) =>
        isDark ? [`M${String(columnIndex + offset)} ${String(rowIndex + offset)}h1v1h-1z`] : [],
      ),
    )
    .join('');
}
