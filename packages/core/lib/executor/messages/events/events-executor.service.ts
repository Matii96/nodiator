import { catchError, defer, lastValueFrom, retry, Subject, tap, throwError, timeout, TimeoutError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { MediatorOptions } from '../../../mediator.options';
import { IEvent } from '../../../messages/event/interfaces/event.interface';
import { IEventsProvidersSchema } from '../../../providers-manager/messages/events/interfaces/events-providers-schema.interface';
import { ProvidersManager } from '../../../providers-manager/providers-manager';
import { IEventHandler, MessageTypes } from '../../../messages';
import { MessageTimeoutException } from '../../exceptions/message-timeout.exception';
import { ProvidersInstantiator } from '../../ports/providers-instantiator.port';
import { IMessageExecutor } from '../../ports/message-executor.port';
import { IMessageProcessingState } from '../../interfaces/message-processing-state.interface';
import { ExecutorUtils } from '../../executor-utils';

export class EventsExecutorService implements IMessageExecutor<IEvent, void> {
  constructor(
    private readonly subject: Subject<IMessageProcessingState>,
    private readonly mediatorOptions: MediatorOptions,
    private readonly providersManager: ProvidersManager,
    private readonly providersInstantiator: ProvidersInstantiator
  ) {}

  async execute(event: IEvent) {
    const id = uuidv4();
    const handlers = await this.getHandlers(event);
    await Promise.all(
      handlers.map((handler) => {
        this.subject.next({ id, type: MessageTypes.EVENT, data: event, provider: handler });
        return this.handleEvent(event, id, handler);
      })
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
    return lastValueFrom(
      defer(() => handler.handle(event)).pipe(
        this.mediatorOptions.eventsTimeout ? timeout(this.mediatorOptions.eventsTimeout) : tap(),
        catchError((err) => {
          const error = err instanceof TimeoutError ? new MessageTimeoutException(event) : err;
          this.subject.next({ id, type: MessageTypes.EVENT, data: event, provider: handler, error });
          return throwError(() => error);
        }),
        retry({
          count: this.mediatorOptions.eventsHandlingRetriesAttempts,
          delay: this.mediatorOptions.eventsHandlingRetriesDelay,
        })
      )
    );
  }
}
