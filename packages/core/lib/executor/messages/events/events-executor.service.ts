import { catchError, defer, lastValueFrom, retry, Subject, tap, throwError, timeout, TimeoutError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { IMessagesProviders } from '../../../explorer/interfaces/explored-providers.interface';
import { IEventsProviders } from '../../../explorer/messages/events/interfaces/events-providers.interface';
import { MediatorOptions } from '../../../mediator.options';
import { IEvent } from '../../../messages/event/interfaces/event.interface';
import { IEventHandler, MessageTypes } from '../../../messages';
import { MessageTimeoutException } from '../../exceptions/message-timeout.exception';
import { ProvidersInstantiator } from '../../interfaces/providers-instantiator.type';
import { IMessageExecutor } from '../../interfaces/message-executor.interface';
import { MessageProcessingState } from '../../messages-states/message-processing-state.type';
import { ExecutorUtils } from '../../executor-utils';

export class EventsExecutorService implements IMessageExecutor<IEvent, void> {
  constructor(
    private readonly subject: Subject<MessageProcessingState>,
    private readonly mediatorOptions: MediatorOptions,
    private readonly messagesProviders: IMessagesProviders,
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
    const providers = this.messagesProviders[MessageTypes.EVENT] as IEventsProviders;
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
          this.subject.next({ id, type: MessageTypes.EVENT, data: event, error });
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
