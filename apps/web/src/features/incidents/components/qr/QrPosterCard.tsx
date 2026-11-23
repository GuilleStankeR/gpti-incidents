import type { ReactElement } from 'react';

import type { ReportQrCodeState } from '@/features/incidents/hooks/use-report-qr-code';
import { qrCodesCopy } from '@/features/incidents/qr-codes.copy';

import { QrCodeImage } from './QrCodeImage';

interface QrPosterCardProps {
  readonly qrCode: ReportQrCodeState;
}

export function QrPosterCard({ qrCode }: QrPosterCardProps): ReactElement {
  const { poster } = qrCodesCopy;

  return (
    <article className="flex flex-col items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 text-center shadow-xs sm:p-8 print:border-0 print:p-0 print:shadow-none">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-accent sm:text-3xl print:text-5xl">
          {poster.title}
        </h2>
        <p className="text-sm text-slate-600 print:text-2xl">{qrCode.condominiumName}</p>
      </div>
      <div className="w-full max-w-72 print:max-w-[13cm]">
        <QrCodeImage matrix={qrCode.matrix} label={qrCodesCopy.qrLabel(qrCode.locationLabel)} />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-xl font-semibold text-slate-900 print:text-4xl">
          {qrCode.locationLabel}
        </p>
        <p className="text-sm text-slate-600 print:text-2xl">{poster.instruction}</p>
      </div>
      <p className="max-w-full text-xs break-all text-slate-500 print:text-base">{qrCode.link}</p>
    </article>
  );
}
