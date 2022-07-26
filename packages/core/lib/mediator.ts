import 'reflect-metadata';
import { Observable, Subject } from 'rxjs';
import { IEvent, IRequest, MessageTypes } from './messages';
import { ProvidersManager } from './providers-manager/providers-manager';
import { ProvidersManagerFactory } from './providers-manager/providers-manager.factory';
import { Executor } from './executor/executor';
import { ExecutorsFactory } from './executor/executors.factory';
import { IMessageProcessingState } from './executor/interfaces/message-processing-state.interface';
import { MediatorOptions } from './mediator.options';

export class Mediator extends Observable<IMessageProcessingState> {
  private readonly _subject = new Subject<IMessageProcessingState>();
  private readonly _options: MediatorOptions;
  private readonly _providersManager: ProvidersManager;
  private readonly _executor: Executor;

  constructor(options: MediatorOptions = {}) {
    super();
    this.source = this._subject;
    this._options = this.fillOptionsDefaultValues(options);

    this._providersManager = new ProvidersManagerFactory().create();
    this._providersManager.register(...this._options.providers);

    this._executor = new ExecutorsFactory(this._options, this._providersManager, this._subject).create();
  }

  private fillOptionsDefaultValues(options: MediatorOptions): MediatorOptions {
    return { providers: [], eventsHandlingRetriesAttempts: 0, eventsHandlingRetriesDelay: 0, ...options };
  }

  get options() {
    return this._options;
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
