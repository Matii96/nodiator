import { ProvidersInstantiator } from '../executor/ports/providers-instantiator.port';
import { IMessageProvider } from '../messages';
import { ClassConstructor } from '../utils/class-constructor.interface';
import { MediatorDynamicConfigurator } from './mediator.dynamic-configurator';

export interface MediatorOptions {
  /**
   * Array of providers - handlers, pipelines etc.
   */
  providers?: ClassConstructor<IMessageProvider>[];

  /**
   * Custom factory for messages handlers.
   */
  providersInstantiator?: ProvidersInstantiator;

  /**
   * Dynamic options configurator.
   */
  dynamicOptions?: MediatorDynamicConfigurator;
}

export interface IMediatorLogger {
  debug(msg: string): void;
  info(msg: string): void;
  warn(msg: string): void;
  error(msg: string): void;
}
