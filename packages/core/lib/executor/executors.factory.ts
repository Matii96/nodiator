import { Subject } from 'rxjs';
import { MessageTypes } from '../messages';
import { IMessage } from '../messages/interfaces/message.interface';
import { IMessagesProviders } from '../explorer/interfaces/explored-providers.interface';
import { MediatorOptions } from '../mediator.options';
import { DefaultProvidersInstantiator } from './default-providers.instantiator';
import { IMessageExecutor } from './ports/message-executor.port';
import { RequestsExecutorService } from './messages/requests/requests-executor.service';
import { EventsExecutorService } from './messages/events/events-executor.service';
import { IMessageProcessingState } from './interfaces/message-processing-state.interface';
import { Executor } from './executor';
import { RequestsProvidersChainerService } from './messages/requests/requests-providers-chainer.service';

export class ExecutorsFactory {
  private readonly executors: Record<MessageTypes, IMessageExecutor<IMessage, any>>;

  constructor(
    mediatorOptions: MediatorOptions,
    messagesProviders: IMessagesProviders,
    subject: Subject<IMessageProcessingState>
  ) {
    const providersInstantiator = mediatorOptions.providersInstantiator || this.createDefaultProvidersInstantiator();
    this.executors = {
      [MessageTypes.REQUEST]: new RequestsExecutorService(
        subject,
        mediatorOptions,
        messagesProviders,
        providersInstantiator,
        new RequestsProvidersChainerService(subject)
      ),
      [MessageTypes.EVENT]: new EventsExecutorService(
        subject,
        mediatorOptions,
        messagesProviders,
        providersInstantiator
      ),
    };
  }

  private createDefaultProvidersInstantiator() {
    const defaultProvidersInstantiator = new DefaultProvidersInstantiator();
    return defaultProvidersInstantiator.instantiate.bind(defaultProvidersInstantiator);
  }

  create() {
    return new Executor(this.executors);
  }
}
