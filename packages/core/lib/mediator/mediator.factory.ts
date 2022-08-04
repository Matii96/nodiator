import 'reflect-metadata';
import { Subject } from 'rxjs';
import { ProvidersManagerFactory } from '../providers-manager/providers-manager.factory';
import { LoggerFactory } from '../logging/logger.factory';
import { LoggingBootstraper } from '../logging/logging.bootstraper';
import { ExecutorsFactory } from '../executor/executors.factory';
import { IMessageProcessingState } from '../executor';
import { MediatorOptions } from './mediator.options';
import { IMediator } from './ports/mediator.port';
import { Mediator } from './mediator';

export class MediatorFactory {
  static create(options: MediatorOptions = {}): IMediator {
    const logger = new LoggerFactory(options).create();
    const providersManager = new ProvidersManagerFactory(logger).create();
    const subject = new Subject<IMessageProcessingState>();
    const executor = new ExecutorsFactory(options, providersManager, subject).create();
    const mediator = new Mediator(options, logger, subject, providersManager, executor);
    LoggingBootstraper.bootstrap(logger, mediator);
    return mediator;
  }
}
