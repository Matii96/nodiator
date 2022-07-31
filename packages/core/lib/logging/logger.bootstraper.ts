import { Observable } from 'rxjs';
import { Type } from '../utils/type.interface';
import { IMediatorLogger, MediatorLoggingLevels, MediatorOptions } from '../mediator.options';
import { IMessageProcessingState } from '../executor';
import { ILoggingBehaviour } from './ports/logging-behaviour.port';
import { DefaultMediatorLogger } from './loggers/default.mediator-logger';
import { BlankMediatorLogger } from './loggers/blank.mediator-logger';
import { LoggingLevelWrapper } from './loggers/logging-level.wrapper';
import { eventsLoggingBehaviours } from './messages/events';
import { requestsLoggingBehaviours } from './messages/requests';

export class LoggerBootstraper {
  private readonly _logsAdapter: Type<ILoggingBehaviour>[] = [...eventsLoggingBehaviours, ...requestsLoggingBehaviours];
  private readonly _logger: IMediatorLogger;

  constructor(options: MediatorOptions, source: Observable<IMessageProcessingState>) {
    if (typeof options.loggingLevel === 'undefined' || options.loggingLevel === MediatorLoggingLevels.NONE) {
      this._logger = new BlankMediatorLogger();
      return;
    }
    this._logger = new LoggingLevelWrapper(options.logger || new DefaultMediatorLogger(), options.loggingLevel);
    this._logsAdapter.forEach((adapterType) => new adapterType(this._logger, source));
  }

  get logger() {
    return this._logger;
  }
}
