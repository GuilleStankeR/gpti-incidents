export const SlaStatus = {
  ON_TRACK: 'ON_TRACK',
  AT_RISK: 'AT_RISK',
  OVERDUE: 'OVERDUE',
} as const;

export type SlaStatus = (typeof SlaStatus)[keyof typeof SlaStatus];
