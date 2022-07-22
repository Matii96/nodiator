import 'reflect-metadata';
import { Observable, Subject } from 'rxjs';
import { ExplorerFactory } from './explorer/explorer.factory';
import { IMessagesProviders } from './explorer/interfaces/explored-providers.interface';
import { Executor } from './executor/executor';
import { ExecutorsFactory } from './executor/executors.factory';
import { IMessageState } from './executor/interfaces/message-state.interface';
import { IEvent, IRequest, MessageTypes } from './messages';
import { MediatorOptions } from './mediator.options';

export class Mediator extends Observable<IMessageState> {
  private readonly _subject = new Subject<IMessageState>();
  private readonly _messagesProviders: IMessagesProviders;
  private readonly _executor: Executor;

  constructor(private readonly _options: MediatorOptions) {
    super();
    this.source = this._subject;
    this._messagesProviders = new ExplorerFactory().create().explore(_options.providers);
    this._executor = new ExecutorsFactory(_options, this._messagesProviders).create();
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
