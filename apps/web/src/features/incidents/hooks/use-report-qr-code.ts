import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { createQrMatrix } from '@/features/incidents/presentation/qr-matrix';
import type { QrMatrix } from '@/features/incidents/presentation/qr-matrix';
import { renderQrPoster } from '@/features/incidents/presentation/qr-poster';
import { buildReportLink } from '@/features/incidents/presentation/report-link';
import { qrCodesCopy } from '@/features/incidents/qr-codes.copy';
import { saveBlob } from '@/shared/lib/blob';
import { toSlug } from '@/shared/lib/slug';

const GENERAL_SLUG = 'general';

export interface ReportQrCodeState {
  readonly location: string;
  readonly locationLabel: string;
  readonly condominiumName: string;
  readonly link: string;
  readonly matrix: QrMatrix;
  readonly isDownloading: boolean;
  readonly hasDownloadFailed: boolean;
  readonly setLocation: (location: string) => void;
  readonly download: () => void;
  readonly print: () => void;
}

export function useReportQrCode(): ReportQrCodeState {
  const { session } = useAuth();
  const [location, setLocation] = useState('');
  const condominiumCode = session?.user.condominium.code ?? '';
  const condominiumName = session?.user.condominium.name ?? '';
  const link = buildReportLink(window.location.origin, condominiumCode, location);
  const matrix = useMemo(() => createQrMatrix(link), [link]);
  const locationLabel = location.length > 0 ? location : qrCodesCopy.poster.allLocations;
  const downloadMutation = useMutation({
    mutationFn: async () => {
      const poster = await renderQrPoster(matrix, {
        title: qrCodesCopy.poster.title,
        condominium: condominiumName,
        location: locationLabel,
        instruction: qrCodesCopy.poster.instruction,
        link,
      });
      const slug = toSlug(`${condominiumCode} ${location.length > 0 ? location : GENERAL_SLUG}`);
      saveBlob(poster, qrCodesCopy.fileName(slug));
    },
  });

  return {
    location,
    locationLabel,
    condominiumName,
    link,
    matrix,
    isDownloading: downloadMutation.isPending,
    hasDownloadFailed: downloadMutation.isError,
    setLocation,
    download: () => {
      downloadMutation.mutate();
    },
    print: () => {
      window.print();
    },
  };
}
