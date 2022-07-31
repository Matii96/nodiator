import {
  catchError,
  defer,
  firstValueFrom,
  lastValueFrom,
  retry,
  Subject,
  tap,
  throwError,
  timeout,
  TimeoutError,
} from 'rxjs';
import { MediatorOptions } from '../../../mediator.options';
import { IEvent } from '../../../messages/event/interfaces/event.interface';
import { IEventsProvidersSchema } from '../../../providers-manager/messages/events/interfaces/events-providers-schema.interface';
import { ProvidersManager } from '../../../providers-manager/providers-manager';
import { IEventHandler, MessageTypes } from '../../../messages';
import { MessageTimeoutException } from '../../exceptions/message-timeout.exception';
import { ProvidersInstantiator } from '../../ports/providers-instantiator.port';
import { IMessageExecutor } from '../../ports/message-executor.port';
import { ExecutorUtils } from '../../executor-utils';
import { IEventProcessingState } from './interfaces/event-processing-state.interface';

export class EventsExecutorService implements IMessageExecutor<IEvent, void> {
  constructor(
    private readonly subject: Subject<IEventProcessingState>,
    private readonly mediatorOptions: MediatorOptions,
    private readonly providersManager: ProvidersManager,
    private readonly providersInstantiator: ProvidersInstantiator
  ) {}

  async execute(id: string, event: IEvent) {
    const handlers = await this.getHandlers(event);
    await firstValueFrom(
      defer(() => Promise.all(handlers.map((handler) => this.handleEvent(event, id, handler)))).pipe(
        catchError((error) => {
          this.subject.next({ id, messageType: MessageTypes.EVENT, message: event, error, processed: true });
          return throwError(() => error);
        }),
        tap(() => this.subject.next({ id, messageType: MessageTypes.EVENT, message: event, processed: true }))
      )
    );
  }

  private getHandlers(event: IEvent) {
    const providers = this.providersManager.get<IEventsProvidersSchema>(MessageTypes.EVENT);
    const handlersTypes = [
      ...providers.global.handlers,
      ...(providers.specific.get(ExecutorUtils.getTypeOfMessage(event))?.handlers || []),
    ];
    return Promise.all(handlersTypes.map((handlerType) => this.providersInstantiator(handlerType)));
  }

  private handleEvent(event: IEvent, id: string, handler: IEventHandler<IEvent>) {
    this.subject.next({ id, messageType: MessageTypes.EVENT, message: event, provider: handler });
    return lastValueFrom(
      defer(() => handler.handle(event)).pipe(
        this.mediatorOptions.eventsTimeout ? timeout(this.mediatorOptions.eventsTimeout) : tap(),
        catchError((err) => {
          const error = err instanceof TimeoutError ? new MessageTimeoutException(event) : err;
          this.subject.next({ id, messageType: MessageTypes.EVENT, message: event, provider: handler, error });
          return throwError(() => error);
        }),
        retry({
          count: this.mediatorOptions.eventsHandlingRetriesAttempts || 0,
          delay: this.mediatorOptions.eventsHandlingRetriesDelay || 0,
        }),
        tap(() =>
          this.subject.next({ id, messageType: MessageTypes.EVENT, message: event, provider: handler, handled: true })
        )
      )
    );
  }
}
