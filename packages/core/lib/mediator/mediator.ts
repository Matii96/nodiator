import { from, mergeMap, Subject } from 'rxjs';
import { IMessageProcessing } from '../executor';
import { IEvent, IRequest, MessageTypes } from '../messages';
import { IExecutor } from '../executor/ports/executor.port';
import { IExtensionsManager } from '../extensions/ports/extensions-manager.port';
import { IProvidersManager } from '../providers-manager/ports/providers-manager.port';
import { IMediatorExtension } from '../extensions';
import { IMediator } from './ports/mediator.port';

export class Mediator implements IMediator {
  constructor(
    protected readonly _subject: Subject<IMessageProcessing>,
    protected readonly _providersManager: IProvidersManager,
    protected readonly _extensionsManager: IExtensionsManager,
    protected readonly _executor: IExecutor
  ) {}

  get providers() {
    return this._providersManager;
  }

  get bus() {
    return this._subject.asObservable();
  }

  use(...extensions: IMediatorExtension[]) {
    extensions.forEach((extension) => this._extensionsManager.load(extension, this));
    return this;
  }

  request<TResult>(request: IRequest) {
    return this._executor.execute<TResult>(MessageTypes.REQUEST, request);
  }

  publish(...events: IEvent[]) {
    return from(events).pipe(mergeMap((event) => this._executor.execute<IEvent>(MessageTypes.EVENT, event)));
  }
}
