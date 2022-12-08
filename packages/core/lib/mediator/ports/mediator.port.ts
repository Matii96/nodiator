import { Observable } from 'rxjs';
import { IEvent, IRequest } from '../../messages';
import { IMessageProcessing } from '../../executor';
import { IMediatorExtension } from '../../extensions';
import { IProvidersManager } from '../../providers-manager/ports/providers-manager.port';

export interface IMediator {
  /**
   * Access to mediator's providers set.
   */
  readonly providers: IProvidersManager;

  /**
   * Sequence of messages execution emitter.
   */
  readonly bus: Observable<IMessageProcessing>;

  /**
   * Registers mediator extensions.
   * @param {IMediatorExtension[]} extensions
   * @returns {IMediator}
   */
  use(...extensions: IMediatorExtension[]): IMediator;

  /**
   * Dispatches request instance and emits back a response to it. Handling is deferred until first subscription to the response stream.
   * @param {IRequest} request
   * @returns {Observable<TResult>} response stream.
   */
  request<TResult>(request: IRequest): Observable<TResult>;

  /**
   * Dispatches events instances to any number of their handlers.
   * @param {IEvent} events
   * @returns {Observable<void>} response stream. Ends with participating handlers finished processing events.
   */
  publish(...events: IEvent[]): Observable<IEvent>;
}
