import { MediatorLoggingLevels } from '../logging-level/logging-levels.enum';

export interface LoggerExtensionDynamicOptions {
  /**
   * Enables explicit logging.
   * @default MediatorLoggingLevels.INFO
   */
  readonly level?: MediatorLoggingLevels;
}
