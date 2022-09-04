import {
  catchError,
  defer,
  finalize,
  from,
  last,
  map,
  mergeMap,
  Observable,
  of,
  retry,
  Subject,
  tap,
  throwError,
  timeout,
} from 'rxjs';
import { MediatorOptions } from '../../../mediator/mediator.options';
import { IEvent } from '../../../messages/event/interfaces/event.interface';
import { IEventsProvidersSchema } from '../../../providers-manager/messages/events/interfaces/events-providers-schema.interface';
import { IEventHandler, MessageTypes } from '../../../messages';
import { IProvidersManager } from '../../../providers-manager/ports/providers-manager.port';
import { MessageTimeoutException } from '../../exceptions/message-timeout.exception';
import { ProvidersInstantiator } from '../../ports/providers-instantiator.port';
import { ExecutorUtils } from '../../executor-utils';
import { IEventProcessingState } from './interfaces/event-processing-state.interface';
import { IEventsExecutor } from './ports/events.executor.port';

export class EventsExecutor implements IEventsExecutor {
  constructor(
    private readonly subject: Subject<IEventProcessingState>,
    private readonly mediatorOptions: MediatorOptions,
    private readonly providersManager: IProvidersManager,
    private readonly providersInstantiator: ProvidersInstantiator
  ) {}

  execute(id: string, event: IEvent) {
    return from(this.getHandlers(event)).pipe(
      mergeMap((handler) =>
        ExecutorUtils.isPromise(handler)
          ? from(handler as Promise<IEventHandler<IEvent>>)
          : of(handler as IEventHandler<IEvent>)
      ),
      mergeMap((handler) => this.handleEvent(event, id, handler)),
      last(),
      map(() => event),
      finalize(() => this.subject.next({ id, messageType: MessageTypes.EVENT, message: event, processed: true }))
    );
  }

  private getHandlers(event: IEvent) {
    const providers = this.providersManager.get<IEventsProvidersSchema>(MessageTypes.EVENT);
    const handlersTypes = [
      ...providers.global.handlers,
      ...(providers.specific.get(ExecutorUtils.getTypeOfMessage(event))?.handlers || []),
    ];
    return handlersTypes.map((handlerType) => this.providersInstantiator(handlerType));
  }

  private handleEvent(event: IEvent, id: string, handler: IEventHandler<IEvent>) {
    this.subject.next({ id, messageType: MessageTypes.EVENT, message: event, provider: handler });
    return defer(() => handler.handle(event)).pipe(
      this.mediatorOptions.eventsTimeout
        ? timeout({
            each: this.mediatorOptions.eventsTimeout,
            with: () => throwError(() => new MessageTimeoutException(event)),
          })
        : tap(),
      catchError((error) => {
        this.subject.next({ id, messageType: MessageTypes.EVENT, message: event, provider: handler, error });
        return throwError(() => error);
      }),
      retry({
        count: this.mediatorOptions.eventsHandlingRetriesAttempts || 0,
        delay: this.mediatorOptions.eventsHandlingRetriesDelay || 0,
      }),
      tap(() =>
        this.subject.next({ id, messageType: MessageTypes.EVENT, message: event, provider: handler, handled: true })
      ),
      last()
    ) as Observable<void>;
  }
}
