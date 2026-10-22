export const DURATION_PATTERN = /^(\d+)([smhd])$/;

const SECONDS_PER_UNIT: Readonly<Record<string, number>> = {
  s: 1,
  m: 60,
  h: 3600,
  d: 86_400,
};

export function parseDurationToSeconds(duration: string): number {
  const [, amount, unit] = DURATION_PATTERN.exec(duration) ?? [];
  const secondsPerUnit = unit === undefined ? undefined : SECONDS_PER_UNIT[unit];

  if (amount === undefined || secondsPerUnit === undefined) {
    throw new Error(`Invalid duration: ${duration}`);
  }

  return Number(amount) * secondsPerUnit;
}
