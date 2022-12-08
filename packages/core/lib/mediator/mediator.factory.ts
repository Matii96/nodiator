import 'reflect-metadata';
import { Subject } from 'rxjs';
import { ProvidersManagerFactory } from '../providers-manager/providers-manager.factory';
import { IMessageProcessing } from '../executor';
import { ExecutorsFactory } from '../executor/executors.factory';
import { MediatorOptions } from '../options/mediator.options';
import { IMediator } from './ports/mediator.port';
import { Mediator } from './mediator';

export class MediatorFactory {
  static create(options: MediatorOptions = {}): IMediator {
    const providersManager = new ProvidersManagerFactory().create();
    const bus = new Subject<IMessageProcessing>();
    const executor = new ExecutorsFactory(options, providersManager, bus).create();
    const mediator = new Mediator(bus, providersManager, executor);
    providersManager.register(...(options.providers ?? []));
    return mediator;
  }
}
