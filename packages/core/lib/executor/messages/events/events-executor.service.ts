import { catchError, defer, lastValueFrom, retry, tap, throwError, timeout, TimeoutError } from 'rxjs';
import { IMessagesProviders } from '../../../explorer/interfaces/explored-providers.interface';
import { IEventsProviders } from '../../../explorer/messages/events/interfaces/events-providers.interface';
import { MediatorOptions } from '../../../mediator.options';
import { IEvent } from '../../../messages/event/interfaces/event.interface';
import { IEventHandler, MessageTypes } from '../../../messages';
import { MessageTimeoutException } from '../../exceptions/message-timeout.exception';
import { IProvidersInstantiator } from '../../interfaces/providers-instantiator.interface';
import { IMessageExecutor } from '../../interfaces/message-executor.interface';
import { ExecutorUtils } from '../../executor-utils';

export class EventsExecutorService implements IMessageExecutor<IEvent, void> {
  constructor(
    private readonly mediatorOptions: MediatorOptions,
    private readonly messagesProviders: IMessagesProviders,
    private readonly providersInstantiator: IProvidersInstantiator
  ) {}

  async execute(event: IEvent) {
    const handlers = await this.getHandlers(event);
    await Promise.all(handlers.map((handler) => this.handleEvent(event, handler)));
  }

  private getHandlers(event: IEvent) {
    const providers = this.messagesProviders[MessageTypes.EVENT] as IEventsProviders;
    const handlersTypes = [
      ...providers.global.handlers,
      ...(providers.specific.get(ExecutorUtils.getTypeOfMessage(event))?.handlers || []),
    ];
    return Promise.all(handlersTypes.map((handlerType) => this.providersInstantiator.instantiate(handlerType)));
  }

  private handleEvent(event: IEvent, handler: IEventHandler<IEvent>) {
    return lastValueFrom(
      defer(() => handler.handle(event)).pipe(
        this.mediatorOptions.eventsTimeout ? timeout(this.mediatorOptions.eventsTimeout) : tap(),
        catchError((err) => throwError(() => (err instanceof TimeoutError ? new MessageTimeoutException(event) : err))),
        retry({
          count: this.mediatorOptions.eventsHandlingRetriesAttempts,
          delay: this.mediatorOptions.eventsHandlingRetriesDelay,
        })
      )
    );
  }
}
