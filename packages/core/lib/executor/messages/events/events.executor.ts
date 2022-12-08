import { catchError, defer, from, last, map, mergeMap, of, retry, Subject, tap, throwError, timeout } from 'rxjs';
import { IEvent } from '../../../messages/event/interfaces/event.interface';
import { IEventsProvidersSchema } from '../../../providers-manager/messages/events/interfaces/events-providers-schema.interface';
import { IEventHandler, MessageTypes } from '../../../messages';
import { IProvidersManager } from '../../../providers-manager/ports/providers-manager.port';
import { MediatorOptions } from '../../../options/mediator.options';
import { MessageTimeoutException } from '../../exceptions/message-timeout.exception';
import { ProvidersInstantiator } from '../../ports/providers-instantiator.port';
import { IMessageProcessingState } from '../../message-processing';
import { ExecutorUtils } from '../../utils/executor-utils';
import { IEventsExecutor } from './ports/events.executor.port';
import { HandleEventOptions } from './events.executor.options';
import {
  HandlingStartedEventProcessingState,
  HandlingErrorEventProcessingState,
  HandlingCompletedEventProcessingState,
} from './processing-states';

export class EventsExecutor implements IEventsExecutor {
  constructor(
    private readonly _options: MediatorOptions,
    private readonly _providersManager: IProvidersManager,
    private readonly _providersInstantiator: ProvidersInstantiator
  ) {}

  execute(messageProcessing: Subject<IMessageProcessingState>, event: IEvent) {
    const config = this._options.dynamicOptions ? this._options.dynamicOptions() : {};
    return from(this.getHandlers(event)).pipe(
      mergeMap((handler) =>
        ExecutorUtils.isPromise(handler)
          ? from(handler as Promise<IEventHandler<IEvent>>)
          : of(handler as IEventHandler<IEvent>)
      ),
      mergeMap((handler) => this.handleEvent({ config, messageProcessing, event, handler })),
      last(),
      map(() => event)
    );
  }

  private getHandlers(event: IEvent) {
    const providers = this._providersManager.get<IEventsProvidersSchema>(MessageTypes.EVENT);
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
