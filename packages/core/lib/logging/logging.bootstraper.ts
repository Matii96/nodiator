import { Observable } from 'rxjs';
import { Type } from '../utils/type.interface';
import { IMediatorLogger } from '../mediator/mediator.options';
import { IMessageProcessingState } from '../executor';
import { ILoggingBehaviour } from './ports/logging-behaviour.port';
import { eventsLoggingBehaviours } from './messages/events';
import { requestsLoggingBehaviours } from './messages/requests';

export class LoggingBootstraper {
  private static readonly _logsAdapter: Type<ILoggingBehaviour>[] = [
    ...eventsLoggingBehaviours,
    ...requestsLoggingBehaviours,
  ];

  static bootstrap(logger: IMediatorLogger, source: Observable<IMessageProcessingState>) {
    this._logsAdapter.forEach((adapterType) => new adapterType(logger, source));
  }
}
