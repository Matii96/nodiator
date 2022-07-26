import { LoggerExtensionDynamicOptions } from './logger.extension.dynamic-options';
import { ExceptionsLoggingLevels } from '../exceptions-logger/exceptions.logger.options';
import { MediatorLogger } from '../mediator-logger/mediator-logger';

export interface LoggerExtensionOptions {
  /**
   * Custom logger implementation.
   */
  readonly logger?: MediatorLogger;

  /**
   * Definition of exceptions that should be logged with custom level.
   */
  readonly exceptionsLoggingLevels?: ExceptionsLoggingLevels;

  /**
   * Dynamic options configurator.
   */
  readonly dynamicOptions?: () => LoggerExtensionDynamicOptions;
}
