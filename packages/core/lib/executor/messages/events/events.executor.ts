import { catchError, defer, from, last, map, mergeMap, of, retry, Subject, tap, throwError, timeout } from 'rxjs';
import { Event } from '../../../messages/event/interfaces/event.interface';
import { EventsProvidersSchema } from '../../../providers-manager/messages/events/interfaces/events-providers-schema.interface';
import { IEventHandler, MessageTypes } from '../../../messages';
import { ProvidersManager } from '../../../providers-manager/ports/providers-manager.port';
import { MediatorOptions } from '../../../options/mediator.options';
import { MessageTimeoutException } from '../../exceptions/message-timeout.exception';
import { ProvidersInstantiator } from '../../ports/providers-instantiator.port';
import { MessageProcessingState } from '../../message-processing';
import { ExecutorUtils } from '../../utils/executor-utils';
import { EventsExecutor } from './ports/events.executor.port';
import { HandleEventOptions } from './events.executor.options';
import {
  HandlingStartedEventProcessingState,
  HandlingErrorEventProcessingState,
  HandlingCompletedEventProcessingState,
} from './processing-states';

export class MediatorEventsExecutor implements EventsExecutor {
  constructor(
    private readonly _options: Pick<MediatorOptions, 'dynamicOptions'>,
    private readonly _providersManager: ProvidersManager,
    private readonly _providersInstantiator: ProvidersInstantiator
  ) {}

  execute(messageProcessing: Subject<MessageProcessingState>, event: Event) {
    const config = this._options.dynamicOptions ? this._options.dynamicOptions() : {};
    return from(this.getHandlers(event)).pipe(
      mergeMap((handler) =>
        ExecutorUtils.isPromise(handler)
          ? from(handler as Promise<IEventHandler<Event>>)
          : of(handler as IEventHandler<Event>)
      ),
      mergeMap((handler) => this.handleEvent({ config, messageProcessing, event, handler })),
      last(),
      map(() => event)
    );
  }

  private getHandlers(event: Event) {
    const providers = this._providersManager.get<EventsProvidersSchema>(MessageTypes.EVENT);
    const handlersTypes = [
      ...providers.global.handlers,
      ...(providers.specific.get(ExecutorUtils.getTypeOfMessage(event))?.handlers ?? []),
    ];
    return handlersTypes.map((handlerType) => this._providersInstantiator(handlerType));
  }

  private handleEvent(args: HandleEventOptions) {
    args.messageProcessing.next(new HandlingStartedEventProcessingState(args.handler));
    return defer(() => args.handler.handle(args.event)).pipe(
      args?.config?.events?.timeout
        ? timeout({
            each: args.config.events.timeout,
            with: () => throwError(() => new MessageTimeoutException(args.event)),
          })
        : tap(),
      catchError((error) => {
        args.messageProcessing.next(new HandlingErrorEventProcessingState(args.handler, error));
        return throwError(() => error);
      }),
      retry({
        count: args?.config?.events?.handlingRetriesAttempts ?? 0,
        delay: args?.config?.events?.handlingRetriesDelay ?? 0,
      }),
      tap(() => args.messageProcessing.next(new HandlingCompletedEventProcessingState(args.handler))),
      last()
    );
  }
}
