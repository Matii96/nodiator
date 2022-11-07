import { Subject } from 'rxjs';
import { MessageTypes } from '../messages';
import { IMessage } from '../messages/interfaces/message.interface';
import { IProvidersManager } from '../providers-manager/ports/providers-manager.port';
import { MediatorOptions } from '../config/mediator.options';
import { IMessageExecutor } from './ports/message-executor.port';
import { DefaultProvidersInstantiator } from './default-providers-instantiator/default.providers.instantiator';
import { RequestsExecutor } from './messages/requests/requests.executor';
import { EventsExecutor } from './messages/events/events.executor';
import { IMessageProcessingState } from './interfaces/message-processing-state.interface';
import { RequestsProvidersChainer } from './messages/requests/requests-providers.chainer';
import { IExecutor } from './ports/executor.port';
import { Executor } from './executor';

export class ExecutorsFactory {
  private readonly executors: Record<MessageTypes, IMessageExecutor<IMessage, any>>;

  constructor(
    options: MediatorOptions,
    providersManager: IProvidersManager,
    subject: Subject<IMessageProcessingState>
  ) {
    const providersInstantiator = options.providersInstantiator || this.createDefaultProvidersInstantiator();
    this.executors = {
      [MessageTypes.REQUEST]: new RequestsExecutor(
        subject,
        options,
        providersManager,
        providersInstantiator,
        new RequestsProvidersChainer(subject)
      ),
      [MessageTypes.EVENT]: new EventsExecutor(subject, options, providersManager, providersInstantiator),
    };
  }

  private createDefaultProvidersInstantiator() {
    const defaultProvidersInstantiator = new DefaultProvidersInstantiator();
    return defaultProvidersInstantiator.instantiate.bind(defaultProvidersInstantiator);
  }

  create(): IExecutor {
    return new Executor(this.executors);
  }
}
