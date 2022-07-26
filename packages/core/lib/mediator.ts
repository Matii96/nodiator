import 'reflect-metadata';
import { Observable, Subject } from 'rxjs';
import { ExplorerFactory } from './explorer/explorer.factory';
import { IMessagesProviders } from './explorer/interfaces/explored-providers.interface';
import { Executor } from './executor/executor';
import { ExecutorsFactory } from './executor/executors.factory';
import { IMessageProcessingState } from './executor/interfaces/message-processing-state.interface';
import { IEvent, IRequest, MessageTypes } from './messages';
import { MediatorOptions } from './mediator.options';

export class Mediator extends Observable<IMessageProcessingState> {
  private readonly _subject = new Subject<IMessageProcessingState>();
  private readonly _options: MediatorOptions;
  private readonly _messagesProviders: IMessagesProviders;
  private readonly _executor: Executor;

  constructor(options: MediatorOptions) {
    super();
    this.source = this._subject;
    this._options = this.fillOptionsDefaultValues(options);
    this._messagesProviders = new ExplorerFactory().create().explore(new Set(this._options.providers));
    this._executor = new ExecutorsFactory(this._options, this._messagesProviders, this._subject).create();
  }

  private fillOptionsDefaultValues(options: MediatorOptions): MediatorOptions {
    return { providers: [], eventsHandlingRetriesAttempts: 0, eventsHandlingRetriesDelay: 0, ...options };
  }

  get messagesProviders() {
    return this._messagesProviders;
  }

  get options() {
    return this._options;
  }

  async request<TResult>(request: IRequest) {
    return this._executor.execute<TResult>(request, MessageTypes.REQUEST);
  }

  async publish(...events: IEvent[]) {
    await Promise.all(events.map((event) => this._executor.execute(event, MessageTypes.EVENT)));
  }
}
