import { ProvidersInstantiator } from '../executor/ports/providers-instantiator.port';
import { IMessageProvider } from '../messages';
import { Type } from '../utils/type.interface';
import { MediatorLoggingLevels } from './mediator.config';
import { MediatorConfigurator } from './mediator.configurator';

export interface MediatorOptions {
  /**
   * Array of providers - handlers, pipelines etc.
   */
  providers?: Type<IMessageProvider>[];

  /**
   * Custom factory for messages handlers.
   */
  providersInstantiator?: ProvidersInstantiator;

  /**
   * Custom logger implementation.
   */
  logger?: IMediatorLogger;

  /**
   * Definition of exceptions that should be logged with custom level.
   */
  exceptionsLoggingLevels?: Partial<Record<MediatorLoggingLevels, Type<Error>[]>>;

  /**
   * Dynamic options configurator.
   */
  config?: MediatorConfigurator;
}

export interface IMediatorLogger {
  debug(msg: string): void;
  info(msg: string): void;
  warn(msg: string): void;
  error(msg: string): void;
}
