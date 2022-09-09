interface RequestsConfig {
  /**
   * Time in milliseconds after which request will be considered as failed.
   */
  timeout?: number;
}

interface EventsConfig {
  /**
   * Time in milliseconds after which event will be considered as failed.
   */
  timeout?: number;
  /**
   * Execution attempts count for each event handler.
   * @default 0
   */

  handlingRetriesAttempts?: number;
  /**
   * Deplay between each attept of event handling.
   * @default 0
   */
  handlingRetriesDelay?: number;
}

interface LoggingConfig {
  /**
   * Enables explicit logging
   * @default MediatorLoggingLevels.INFO
   */
  level?: MediatorLoggingLevels;
}

export enum MediatorLoggingLevels {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  NONE = 'none',
}

export interface MediatorConfig {
  requests?: RequestsConfig;
  events?: EventsConfig;
  logs?: LoggingConfig;
}
