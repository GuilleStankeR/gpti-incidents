export const StorageDriver = {
  LOCAL: 'local',
  DATABASE: 'database',
} as const;

export type StorageDriver = (typeof StorageDriver)[keyof typeof StorageDriver];
