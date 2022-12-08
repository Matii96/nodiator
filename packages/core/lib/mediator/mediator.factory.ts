import 'reflect-metadata';
import { Subject } from 'rxjs';
import { ProvidersManagerFactory } from '../providers-manager/providers-manager.factory';
import { IMessageProcessing } from '../executor';
import { ExecutorsFactory } from '../executor/executors.factory';
import { MediatorOptions } from '../options/mediator.options';
import { IMediator } from './ports/mediator.port';
import { Mediator } from './mediator';
import { ExtensionsManager } from '../extensions/extensions-manager';

export class MediatorFactory {
  static create(options: MediatorOptions = {}): IMediator {
    const providersManager = new ProvidersManagerFactory().create();
    const extensionsManager = new ExtensionsManager();
    const bus = new Subject<IMessageProcessing>();
    const executor = new ExecutorsFactory(options, providersManager, bus).create();
    const mediator = new Mediator(bus, providersManager, extensionsManager, executor);
    providersManager.register(...(options.providers ?? []));
    return mediator;
  }
}
