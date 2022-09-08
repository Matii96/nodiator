import { MediatorOptions, IMediatorLogger } from '../config/mediator.options';
import { DefaultMediatorLogger } from './loggers/default.mediator-logger';
import { LoggingLevelWrapper } from './loggers/logging-level.wrapper';

export class LoggerFactory {
  constructor(private readonly _options: MediatorOptions) {}

  create(): IMediatorLogger {
    return new LoggingLevelWrapper(this._options.logger || new DefaultMediatorLogger(), this._options.config);
  }
}
