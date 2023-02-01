import { Observable } from 'rxjs';
import { Event, Request } from '../messages';
import { MessageProcessing } from '../executor';
import { MediatorExtension } from '../extensions';
import { ProvidersManager } from '../providers-manager/providers-manager';
import { GetResponseType } from '../messages/request/get-response-type';

export interface Mediator {
  /**
   * Access to mediator's providers set.
   */
  readonly providers: ProvidersManager;

  /**
   * Sequence of messages execution emitter.
   */
  readonly bus: Observable<MessageProcessing>;

  /**
   * Registers mediator extensions.
   * @param {MediatorExtension[]} extensions
   * @returns {Mediator}
   */
  use(...extensions: MediatorExtension[]): Mediator;

  /**
   * Dispatches request instance and emits back a response to it. Handling is deferred until first subscription to the response stream.
   * @param {Request} request
   * @returns {Observable<TResult>} response stream.
   */
  request<TRequest extends Request, TResponse = GetResponseType<TRequest>>(request: TRequest): Observable<TResponse>;

  /**
   * Dispatches events instances to any number of their handlers.
   * @param {Event} events
   * @returns {Observable<void>} response stream. Ends with participating handlers finished processing events.
   */
  publish(...events: Event[]): Observable<Event>;
}
