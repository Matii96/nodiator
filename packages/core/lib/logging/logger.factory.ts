import { IMediatorLogger } from '../mediator/mediator.options';
import { LoggerFactoryOptions } from './logger.factory.options';
import { BlankMediatorLogger } from './loggers/blank.mediator-logger';
import { DefaultMediatorLogger } from './loggers/default.mediator-logger';
import { LoggingLevelWrapper } from './loggers/logging-level.wrapper';

export class LoggerFactory {
  constructor(private readonly options: LoggerFactoryOptions) {}

  create(): IMediatorLogger {
    return this.options.loggingLevel && this.options.loggingLevel !== 'NONE'
      ? new LoggingLevelWrapper(this.options.logger || new DefaultMediatorLogger(), this.options.loggingLevel)
      : new BlankMediatorLogger();
  }
}
