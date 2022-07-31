import 'reflect-metadata';
import { Observable, Subject } from 'rxjs';
import { IEvent, IRequest, MessageTypes } from './messages';
import { ProvidersManager } from './providers-manager/providers-manager';
import { ProvidersManagerFactory } from './providers-manager/providers-manager.factory';
import { Executor } from './executor/executor';
import { ExecutorsFactory } from './executor/executors.factory';
import { IMessageProcessingState } from './executor/interfaces/message-processing-state.interface';
import { LoggerBootstraper } from './logging/logger.bootstraper';
import { IMediatorLogger, MediatorOptions } from './mediator.options';

export class Mediator extends Observable<IMessageProcessingState> {
  private readonly _subject = new Subject<IMessageProcessingState>();
  private readonly _options: MediatorOptions;
  private readonly _providersManager: ProvidersManager;
  private readonly _executor: Executor;
  private readonly _logger: IMediatorLogger;

  constructor(options: MediatorOptions = {}) {
    super();
    this.source = this._subject;
    this._options = options;
    this._logger = new LoggerBootstraper(this._options, this).logger;
    this._providersManager = new ProvidersManagerFactory(this._logger).create();
    this._providersManager.register(...(this._options.providers || []));
    this._executor = new ExecutorsFactory(this._options, this._providersManager, this._subject).create();
    this._logger.info(`Mediator initialized with ${this._options.providers?.length || 'no'} providers`);
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
