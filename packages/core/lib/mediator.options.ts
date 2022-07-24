import { Type } from './utils/type.interface';
import { IMessageProvider } from './messages/interfaces/message-provider.interface';
import { ProvidersInstantiator } from './executor/interfaces/providers-instantiator.type';

export interface MediatorOptions {
  /**
   * Time in milliseconds after which request will be considered as failed.
   */
  requestsTimeout?: number;

  /**
   * Time in milliseconds after which event will be considered as failed.
   */

  eventsTimeout?: number;
  /**
   * Execution attempts count for each event handler.
   * @default [0]
   */

  eventsHandlingRetriesAttempts?: number;
  /**
   * Deplay between each attept of event handling.
   * @default [0]
   */
  eventsHandlingRetriesDelay?: number;

  /**
   * Collection of providers for the mediator.
   */
  providers: Type<IMessageProvider>[];

  /**
   * Custom factory for messages handlers.
   */
  providersInstantiator?: ProvidersInstantiator;
}
