import { from, mergeMap, Subject } from 'rxjs';
import { MessageProcessing } from '../executor';
import { Event, Request, MessageTypes } from '../messages';
import { Executor } from '../executor/executor.port';
import { ExtensionsManager } from '../extensions/extensions-manager';
import { ProvidersManager } from '../providers-manager/providers-manager';
import { GetResponseType } from '../messages/request/get-response-type';
import { MediatorExtension } from '../extensions';
import { Mediator } from './mediator';

export class MediatorImplementation implements Mediator {
  constructor(
    protected readonly _subject: Subject<MessageProcessing>,
    protected readonly _providersManager: ProvidersManager,
    protected readonly _extensionsManager: ExtensionsManager,
    protected readonly _executor: Executor
  ) {}

  get providers() {
    return this._providersManager;
  }

  get bus() {
    return this._subject.asObservable();
  }

  use(...extensions: MediatorExtension[]) {
    extensions.forEach((extension) => this._extensionsManager.load(extension, this));
    return this;
  }

  request<TRequest extends Request, TResponse = GetResponseType<TRequest>>(request: TRequest) {
    return this._executor.execute<TResponse>(MessageTypes.REQUEST, request);
  }

  publish(...events: Event[]) {
    return from(events).pipe(mergeMap((event) => this._executor.execute<Event>(MessageTypes.EVENT, event)));
  }
}
