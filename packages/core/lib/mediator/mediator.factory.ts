import 'reflect-metadata';
import { Subject } from 'rxjs';
import { ProvidersManagerFactory } from '../providers-manager/providers-manager.factory';
import { MessageProcessing } from '../executor';
import { ExecutorsFactory } from '../executor/executors.factory';
import { MediatorExtensionsManager } from '../extensions/extensions-manager.impl';
import { MediatorOptions } from '../options/mediator.options';
import { Mediator } from './mediator';
import { MediatorImplementation } from './mediator.impl';

export class MediatorFactory {
  static create(options: MediatorOptions = {}): Mediator {
    const providersManager = new ProvidersManagerFactory().create();
    const extensionsManager = new MediatorExtensionsManager();
    const bus = new Subject<MessageProcessing>();
    const executor = new ExecutorsFactory(options, providersManager, bus).create();
    const mediator = new MediatorImplementation(bus, providersManager, extensionsManager, executor);
    providersManager.register(...(options.providers ?? []));
    return mediator;
  }
}
