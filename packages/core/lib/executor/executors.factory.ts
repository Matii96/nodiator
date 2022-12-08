import { Subject } from 'rxjs';
import { MessageTypes } from '../messages';
import { IMessage } from '../messages/interfaces/message.interface';
import { IProvidersManager } from '../providers-manager/ports/providers-manager.port';
import { MediatorOptions } from '../options/mediator.options';
import { IMessageExecutor } from './ports/message-executor.port';
import { DefaultProvidersInstantiator } from './default-providers-instantiator/default.providers.instantiator';
import { RequestsExecutor } from './messages/requests/requests.executor';
import { EventsExecutor } from './messages/events/events.executor';
import { RequestsProvidersChainer } from './messages/requests/chainer/requests-providers.chainer';
import { IMessageProcessing } from './message-processing';
import { IExecutor } from './ports/executor.port';
import { Executor } from './executor';

export class ExecutorsFactory {
  private readonly executors: Record<MessageTypes, IMessageExecutor<IMessage, any>>;

  constructor(
    options: MediatorOptions,
    providersManager: IProvidersManager,
    private readonly _bus: Subject<IMessageProcessing>
  ) {
    const providersInstantiator = options.providersInstantiator || this.createDefaultProvidersInstantiator();
    this.executors = {
      [MessageTypes.REQUEST]: new RequestsExecutor(
        options,
        providersManager,
        providersInstantiator,
        new RequestsProvidersChainer()
      ),
      [MessageTypes.EVENT]: new EventsExecutor(options, providersManager, providersInstantiator),
    };
  }

  private createDefaultProvidersInstantiator() {
    const defaultProvidersInstantiator = new DefaultProvidersInstantiator();
    return defaultProvidersInstantiator.instantiate.bind(defaultProvidersInstantiator);
  }

  create(): IExecutor {
    return new Executor(this.executors, this._bus);
  }
}
