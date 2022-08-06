import { Observable, Subject } from 'rxjs';
import { IMessageProcessingState } from '../executor';
import { IExecutor } from '../executor/ports/executor.port';
import { IEvent, IRequest, MessageTypes } from '../messages';
import { IProvidersManager } from '../providers-manager/ports/providers-manager.port';
import { IMediatorLogger, MediatorOptions } from './mediator.options';
import { IMediator } from './ports/mediator.port';

export class Mediator extends Observable<IMessageProcessingState> implements IMediator {
  constructor(
    private readonly _options: MediatorOptions,
    private readonly _logger: IMediatorLogger,
    private readonly _subject: Subject<IMessageProcessingState>,
    private readonly _providersManager: IProvidersManager,
    private readonly _executor: IExecutor
  ) {
    super();
    this.source = this._subject;
    this._providersManager.register(...(this._options.providers || []));

    const providersCountString =
      this._options.providers?.length > 0 ? ` with ${this._options.providers.length} providers` : '';
    this._logger.info(`Mediator initialized${providersCountString}`);
  }

  get providers() {
    return this._providersManager;
  }

  async request<TResult>(request: IRequest) {
    return this._executor.execute<TResult>(request, MessageTypes.REQUEST);
  }

  async publish(...events: IEvent[]) {
    await Promise.all(events.map((event) => this._executor.execute(event, MessageTypes.EVENT)));
  }
}
