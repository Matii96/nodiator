import { from, mergeMap, Observable, Subject } from 'rxjs';
import { IMessageProcessingState } from '../executor';
import { IExecutor } from '../executor/ports/executor.port';
import { IEvent, IRequest, MessageTypes } from '../messages';
import { IProvidersManager } from '../providers-manager/ports/providers-manager.port';
import { IMediatorLogger } from '../config/mediator.options';
import { IMediator } from './ports/mediator.port';

export class Mediator extends Observable<IMessageProcessingState> implements IMediator {
  constructor(
    private readonly _logger: IMediatorLogger,
    private readonly _subject: Subject<IMessageProcessingState>,
    private readonly _providersManager: IProvidersManager,
    private readonly _executor: IExecutor
  ) {
    super();
    this.source = this._subject;
    this._logger.info('Mediator initialized');
  }

  get providers() {
    return this._providersManager;
  }

  request<TResult>(request: IRequest) {
    return this._executor.execute<TResult>(request, MessageTypes.REQUEST);
  }

  publish(...events: IEvent[]) {
    return from(events).pipe(mergeMap((event) => this._executor.execute<IEvent>(event, MessageTypes.EVENT)));
  }
}
