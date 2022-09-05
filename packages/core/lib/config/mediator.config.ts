export interface MediatorConfig {
  /**
   * Time in milliseconds after which request will be considered as failed.
   */
  requestsTimeout?: number;

  /**
   * Time in milliseconds after which event will be considered as failed.
   */

  eventsTimeout?: number;
  /**
   * Execution attempts count for each event handler.
   * @default 0
   */

  eventsHandlingRetriesAttempts?: number;
  /**
   * Deplay between each attept of event handling.
   * @default 0
   */
  eventsHandlingRetriesDelay?: number;

  /**
   * Enables explicit logging
   * @default 'none'
   */
  loggingLevel?: MediatorLoggingLevels;
}

export enum MediatorLoggingLevels {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  NONE = 'none',
}
