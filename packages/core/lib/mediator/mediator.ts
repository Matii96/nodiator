import { from, mergeMap, Subject } from 'rxjs';
import { IMessageProcessing } from '../executor';
import { IExecutor } from '../executor/ports/executor.port';
import { IEvent, IRequest, MessageTypes } from '../messages';
import { IProvidersManager } from '../providers-manager/ports/providers-manager.port';
import { IMediator } from './ports/mediator.port';

export class Mediator implements IMediator {
  constructor(
    private readonly _subject: Subject<IMessageProcessing>,
    private readonly _providersManager: IProvidersManager,
    private readonly _executor: IExecutor
  ) {}

  get providers() {
    return this._providersManager;
  }

  get bus() {
    return this._subject.asObservable();
  }

  request<TResult>(request: IRequest) {
    return this._executor.execute<TResult>(MessageTypes.REQUEST, request);
  }

  publish(...events: IEvent[]) {
    return from(events).pipe(mergeMap((event) => this._executor.execute<IEvent>(MessageTypes.EVENT, event)));
  }
}
