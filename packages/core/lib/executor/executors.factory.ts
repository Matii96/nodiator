import { Subject } from 'rxjs';
import { MessageTypes } from '../messages';
import { Message } from '../messages/interfaces/message.interface';
import { ProvidersManager } from '../providers-manager/providers-manager';
import { MediatorOptions } from '../options/mediator.options';
import { MessageExecutor } from './messages/shared/message-executor';
import { DefaultProvidersInstantiator } from './default-providers-instantiator/default.providers.instantiator';
import { MediatorRequestsExecutor } from './messages/requests/requests.executor.impl';
import { MediatorEventsExecutor } from './messages/events/events.executor.impl';
import { MediatorRequestsProvidersChainer } from './messages/requests/chainer/requests-providers.chainer.impl';
import { MessageProcessing } from './message-processing';
import { Executor } from './executor.port';
import { MediatorExecutor } from './executor.impl';

export class ExecutorsFactory {
  private readonly executors: Record<MessageTypes, MessageExecutor<Message, any>>;

  constructor(
    options: Pick<MediatorOptions, 'providersInstantiator' | 'dynamicOptions'>,
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
