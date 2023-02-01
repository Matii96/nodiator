export const MediatorLoggingLevels = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  NONE: 'none',
} as const;

export type MediatorLoggingLevels = (typeof MediatorLoggingLevels)[keyof typeof MediatorLoggingLevels];
