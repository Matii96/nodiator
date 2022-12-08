export interface EventsOptions {
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
