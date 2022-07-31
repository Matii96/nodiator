import { Subject } from 'rxjs';
import { MessageTypes } from '../messages';
import { IMessage } from '../messages/interfaces/message.interface';
import { MediatorOptions } from '../mediator.options';
import { ProvidersManager } from '../providers-manager/providers-manager';
import { DefaultProvidersInstantiator } from './default.providers.instantiator';
import { IMessageExecutor } from './ports/message-executor.port';
import { RequestsExecutorService } from './messages/requests/requests-executor.service';
import { EventsExecutorService } from './messages/events/events-executor.service';
import { IMessageProcessingState } from './interfaces/message-processing-state.interface';
import { RequestsProvidersChainerService } from './messages/requests/requests-providers-chainer.service';
import { Executor } from './executor';

export class ExecutorsFactory {
  private readonly executors: Record<MessageTypes, IMessageExecutor<IMessage, any>>;

  constructor(
    mediatorOptions: MediatorOptions,
    providersManager: ProvidersManager,
    subject: Subject<IMessageProcessingState>
  ) {
    const providersInstantiator = mediatorOptions.providersInstantiator || this.createDefaultProvidersInstantiator();
    this.executors = {
      [MessageTypes.REQUEST]: new RequestsExecutorService(
        subject,
        mediatorOptions,
        providersManager,
        providersInstantiator,
        new RequestsProvidersChainerService(subject)
      ),
      [MessageTypes.EVENT]: new EventsExecutorService(
        subject,
        mediatorOptions,
        providersManager,
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
