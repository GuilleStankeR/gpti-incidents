import type { UploadLimits } from '@incidents/shared';

import { reportIncidentCopy } from '@/features/incidents/report-incident.copy';
import { formatDecimal } from '@/shared/lib/format';

const BYTES_PER_MEGABYTE = 1_048_576;

export interface PhotoSelectionResult {
  readonly accepted: readonly File[];
  readonly error: string | null;
}

export function formatMegabytes(bytes: number): string {
  return formatDecimal(bytes / BYTES_PER_MEGABYTE);
}

function rejectionReason(file: File, limits: UploadLimits): string | null {
  const acceptedTypes: readonly string[] = limits.acceptedMimeTypes;

  if (!acceptedTypes.includes(file.type)) {
    return reportIncidentCopy.photos.invalidType;
  }

  return file.size > limits.maxFileSizeBytes
    ? reportIncidentCopy.photos.tooLarge(formatMegabytes(limits.maxFileSizeBytes))
    : null;
}

export function selectPhotos(
  candidates: readonly File[],
  currentCount: number,
  limits: UploadLimits,
): PhotoSelectionResult {
  const reasons = candidates.map((file) => rejectionReason(file, limits));
  const valid = candidates.filter((_file, index) => reasons[index] === null);
  const availableSlots = Math.max(limits.maxFiles - currentCount, 0);
  const accepted = valid.slice(0, availableSlots);
  const firstReason = reasons.find((reason) => reason !== null) ?? null;
  const isOverLimit = valid.length > availableSlots;

  return {
    accepted,
    error: isOverLimit ? reportIncidentCopy.photos.tooMany(limits.maxFiles) : firstReason,
  };
}
