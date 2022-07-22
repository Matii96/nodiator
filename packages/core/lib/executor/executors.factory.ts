import { MessageTypes } from '../messages';
import { IMessage } from '../messages/interfaces/message.interface';
import { IMessagesProviders } from '../explorer/interfaces/explored-providers.interface';
import { MediatorOptions } from '../mediator.options';
import { DefaultProvidersInstantiator } from './default-providers.instantiator';
import { IMessageExecutor } from './interfaces/message-executor.interface';
import { RequestsExecutorService } from './messages/requests/requests-executor.service';
import { EventsExecutorService } from './messages/events/events-executor.service';
import { Executor } from './executor';

export class ExecutorsFactory {
  private readonly executors: Record<MessageTypes, IMessageExecutor<IMessage, any>>;

  constructor(mediatorOptions: MediatorOptions, messagesProviders: IMessagesProviders) {
    const providersInstantiator = mediatorOptions.providersInstantiator || new DefaultProvidersInstantiator();
    this.executors = {
      [MessageTypes.REQUEST]: new RequestsExecutorService(mediatorOptions, messagesProviders, providersInstantiator),
      [MessageTypes.EVENT]: new EventsExecutorService(mediatorOptions, messagesProviders, providersInstantiator),
    };
  }

  create() {
    return new Executor(this.executors);
  }
}