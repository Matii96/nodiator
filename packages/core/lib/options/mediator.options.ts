import { ProvidersInstantiator } from '../executor/types/providers-instantiator.port';
import { MessageProvider } from '../messages';
import { ClassConstructor } from '../utils/class-constructor.interface';
import { MediatorDynamicConfigurator } from './mediator.dynamic-configurator';

export interface MediatorOptions {
  /**
   * Array of providers - handlers, pipelines etc.
   */
  providers?: ClassConstructor<MessageProvider>[];

  /**
   * Custom factory for messages handlers.
   */
  providersInstantiator?: ProvidersInstantiator;

  /**
   * Dynamic options configurator.
   */
  dynamicOptions?: MediatorDynamicConfigurator;
}
