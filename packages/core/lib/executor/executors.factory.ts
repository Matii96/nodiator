import { Subject } from 'rxjs';
import { MessageTypes } from '../messages';
import { Message } from '../messages/interfaces/message.interface';
import { ProvidersManager } from '../providers-manager/ports/providers-manager.port';
import { MediatorOptions } from '../options/mediator.options';
import { MessageExecutor } from './ports/message-executor.port';
import { DefaultProvidersInstantiator } from './default-providers-instantiator/default.providers.instantiator';
import { MediatorRequestsExecutor } from './messages/requests/requests.executor';
import { MediatorEventsExecutor } from './messages/events/events.executor';
import { MediatorRequestsProvidersChainer } from './messages/requests/chainer/requests-providers.chainer';
import { MessageProcessing } from './message-processing';
import { Executor } from './ports/executor.port';
import { MediatorExecutor } from './executor';

export class ExecutorsFactory {
  private readonly executors: Record<MessageTypes, MessageExecutor<Message, any>>;

  constructor(
    options: MediatorOptions,
    providersManager: ProvidersManager,
    private readonly _bus: Subject<MessageProcessing>
  ) {
    const providersInstantiator = options.providersInstantiator || this.createDefaultProvidersInstantiator();
    this.executors = {
      [MessageTypes.REQUEST]: new MediatorRequestsExecutor(
        options,
        providersManager,
        providersInstantiator,
        new MediatorRequestsProvidersChainer()
      ),
      [MessageTypes.EVENT]: new MediatorEventsExecutor(options, providersManager, providersInstantiator),
    };
  }

  private createDefaultProvidersInstantiator() {
    const defaultProvidersInstantiator = new DefaultProvidersInstantiator();
    return defaultProvidersInstantiator.instantiate.bind(defaultProvidersInstantiator);
  }

  create(): Executor {
    return new MediatorExecutor(this.executors, this._bus);
  }
}
