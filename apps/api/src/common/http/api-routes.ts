export const API_GLOBAL_PREFIX = 'api';

export function buildEvidenceFileUrl(evidenceId: string): string {
  return `/${API_GLOBAL_PREFIX}/evidence/${evidenceId}/file`;
}
