import { Subject } from 'rxjs';
import { MessageTypes } from '../messages';
import { IMessage } from '../messages/interfaces/message.interface';
import { MediatorOptions } from '../mediator/mediator.options';
import { DefaultProvidersInstantiator } from './default.providers.instantiator';
import { IMessageExecutor } from './ports/message-executor.port';
import { RequestsExecutor } from './messages/requests/requests.executor';
import { EventsExecutor } from './messages/events/events.executor';
import { IMessageProcessingState } from './interfaces/message-processing-state.interface';
import { RequestsProvidersChainerService } from './messages/requests/requests-providers-chainer.service';
import { IProvidersManager } from '../providers-manager/ports/providers-manager.port';
import { Executor } from './executor';

export class ExecutorsFactory {
  private readonly executors: Record<MessageTypes, IMessageExecutor<IMessage, any>>;

  constructor(
    mediatorOptions: MediatorOptions,
    providersManager: IProvidersManager,
    subject: Subject<IMessageProcessingState>
  ) {
    const providersInstantiator = mediatorOptions.providersInstantiator || this.createDefaultProvidersInstantiator();
    this.executors = {
      [MessageTypes.REQUEST]: new RequestsExecutor(
        subject,
        mediatorOptions,
        providersManager,
        providersInstantiator,
        new RequestsProvidersChainerService(subject)
      ),
      [MessageTypes.EVENT]: new EventsExecutor(subject, mediatorOptions, providersManager, providersInstantiator),
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
