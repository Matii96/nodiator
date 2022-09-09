import 'reflect-metadata';
import { Subject } from 'rxjs';
import { ProvidersManagerFactory } from '../providers-manager/providers-manager.factory';
import { LoggerFactory } from '../logging/logger.factory';
import { LoggingBootstrapper } from '../logging/logging.bootstraper';
import { ExecutorsFactory } from '../executor/executors.factory';
import { IMessageProcessingState } from '../executor/interfaces/message-processing-state.interface';
import { MediatorOptions } from '../config/mediator.options';
import { IMediator } from './ports/mediator.port';
import { Mediator } from './mediator';

export class MediatorFactory {
  static create(options: MediatorOptions = {}): IMediator {
    const mediatorOptions: MediatorOptions = { config: () => ({}), ...options };
    const logger = new LoggerFactory(mediatorOptions).create();
    const providersManager = new ProvidersManagerFactory(logger).create();
    const subject = new Subject<IMessageProcessingState>();
    const executor = new ExecutorsFactory(mediatorOptions, providersManager, subject).create();
    const mediator = new Mediator(logger, subject, providersManager, executor);
    LoggingBootstrapper.bootstrap(logger, mediator, options);
    providersManager.register(...(mediatorOptions.providers || []));
    return mediator;
  }
}
