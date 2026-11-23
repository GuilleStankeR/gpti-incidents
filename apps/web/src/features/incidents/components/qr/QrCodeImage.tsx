import type { ReactElement } from 'react';

import { toQrSvgPath } from '@/features/incidents/presentation/qr-matrix';
import type { QrMatrix } from '@/features/incidents/presentation/qr-matrix';

const QUIET_ZONE_MODULES = 4;
const QUIET_ZONE_SIDES = 2;

interface QrCodeImageProps {
  readonly matrix: QrMatrix;
  readonly label: string;
}

export function QrCodeImage({ matrix, label }: QrCodeImageProps): ReactElement {
  const viewBoxSize = matrix.length + QUIET_ZONE_MODULES * QUIET_ZONE_SIDES;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${String(viewBoxSize)} ${String(viewBoxSize)}`}
      role="img"
      aria-label={label}
      shapeRendering="crispEdges"
      className="aspect-square w-full bg-white text-slate-900"
    >
      <path d={toQrSvgPath(matrix, QUIET_ZONE_MODULES)} fill="currentColor" />
    </svg>
  );
}
