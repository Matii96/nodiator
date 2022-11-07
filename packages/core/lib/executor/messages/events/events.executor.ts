import {
  catchError,
  defer,
  finalize,
  from,
  last,
  map,
  mergeMap,
  of,
  retry,
  Subject,
  tap,
  throwError,
  timeout,
} from 'rxjs';
import { IEvent } from '../../../messages/event/interfaces/event.interface';
import { IEventsProvidersSchema } from '../../../providers-manager/messages/events/interfaces/events-providers-schema.interface';
import { IEventHandler, MessageTypes } from '../../../messages';
import { IProvidersManager } from '../../../providers-manager/ports/providers-manager.port';
import { MediatorOptions } from '../../../config/mediator.options';
import { MessageTimeoutException } from '../../exceptions/message-timeout.exception';
import { ProvidersInstantiator } from '../../ports/providers-instantiator.port';
import { ExecutorUtils } from '../../utils/executor-utils';
import { IEventProcessingState } from './interfaces/event-processing-state.interface';
import { IEventsExecutor } from './ports/events.executor.port';
import { HandleEventOptions } from './events.executor.options';

export class EventsExecutor implements IEventsExecutor {
  constructor(
    private readonly _subject: Subject<IEventProcessingState>,
    private readonly _options: MediatorOptions,
    private readonly _providersManager: IProvidersManager,
    private readonly _providersInstantiator: ProvidersInstantiator
  ) {}

  execute(id: string, event: IEvent) {
    const config = this._options.config ? this._options.config() : {};
    return from(this.getHandlers(event)).pipe(
      mergeMap((handler) =>
        ExecutorUtils.isPromise(handler)
          ? from(handler as Promise<IEventHandler<IEvent>>)
          : of(handler as IEventHandler<IEvent>)
      ),
      mergeMap((handler) => this.handleEvent({ config, id, event, handler })),
      last(),
      map(() => event),
      finalize(() => this._subject.next({ id, messageType: MessageTypes.EVENT, message: event, processed: true }))
    );
  }

  private getHandlers(event: IEvent) {
    const providers = this._providersManager.get<IEventsProvidersSchema>(MessageTypes.EVENT);
    const handlersTypes = [
      ...providers.global.handlers,
      ...(providers.specific.get(ExecutorUtils.getTypeOfMessage(event))?.handlers || []),
    ];
    return handlersTypes.map((handlerType) => this._providersInstantiator(handlerType));
  }

  private handleEvent(args: HandleEventOptions) {
    this._subject.next({ id: args.id, messageType: MessageTypes.EVENT, message: args.event, provider: args.handler });
    return defer(() => args.handler.handle(args.event)).pipe(
      args?.config?.events?.timeout
        ? timeout({
            each: args.config.events.timeout,
            with: () => throwError(() => new MessageTimeoutException(args.event)),
          })
        : tap(),
      catchError((error) => {
        this._subject.next({
          id: args.id,
          messageType: MessageTypes.EVENT,
          message: args.event,
          provider: args.handler,
          error,
        });
        return throwError(() => error);
      }),
      retry({
        count: args?.config?.events?.handlingRetriesAttempts || 0,
        delay: args?.config?.events?.handlingRetriesDelay || 0,
      }),
      tap(() =>
        this._subject.next({
          id: args.id,
          messageType: MessageTypes.EVENT,
          message: args.event,
          provider: args.handler,
          handled: true,
        })
      ),
      last()
    );
  }
}
