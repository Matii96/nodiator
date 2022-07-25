import 'reflect-metadata';
import { Observable, Subject } from 'rxjs';
import { ExplorerFactory } from './explorer/explorer.factory';
import { IMessagesProviders } from './explorer/interfaces/explored-providers.interface';
import { Executor } from './executor/executor';
import { ExecutorsFactory } from './executor/executors.factory';
import { MessageProcessingState } from './executor/messages-states/message-processing-state.type';
import { IEvent, IRequest, MessageTypes } from './messages';
import { MediatorOptions } from './mediator.options';

export class Mediator extends Observable<MessageProcessingState> {
  private readonly _subject = new Subject<MessageProcessingState>();
  private readonly _options: MediatorOptions;
  private readonly _messagesProviders: IMessagesProviders;
  private readonly _executor: Executor;

  constructor(options: MediatorOptions) {
    super();
    this.source = this._subject;
    this._options = this.fillOptionsDefaultValues(options);
    this._messagesProviders = new ExplorerFactory().create().explore(this._options.providers);
    this._executor = new ExecutorsFactory(this._options, this._messagesProviders, this._subject).create();
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

  private fillOptionsDefaultValues(options: MediatorOptions): MediatorOptions {
    return { eventsHandlingRetriesAttempts: 0, eventsHandlingRetriesDelay: 0, ...options };
  }
}
