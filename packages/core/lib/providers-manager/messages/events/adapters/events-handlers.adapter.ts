import { ClassConstructor } from '../../../../utils/class-constructor.interface';
import { Event, IEventHandler, MessageTypes } from '../../../../messages';
import { EVENT_HANDLER_METADATA } from '../../../../messages/event/constants';
import { ProviderTypeAdapter } from '../../shared/provider-type-adapter.port';
import { EventsProvidersSchema } from '../interfaces/events-providers-schema.interface';

export class EventsHandlersAdapter implements ProviderTypeAdapter<EventsProvidersSchema> {
  readonly messageType = MessageTypes.EVENT;
  readonly metadataKey = EVENT_HANDLER_METADATA;

  register(
    adaptedProviders: EventsProvidersSchema,
    provider: ClassConstructor<IEventHandler<Event>>,
    eventTypes: Set<ClassConstructor<Event>>
  ) {
    for (const eventType of eventTypes) {
      this.registerHandler(adaptedProviders, provider, eventType);
    }
  }

  private registerHandler(
    { specific }: Pick<EventsProvidersSchema, 'specific'>,
    provider: ClassConstructor<IEventHandler<Event>>,
    eventType: ClassConstructor<Event>
  ) {
    if (!specific.has(eventType)) {
      specific.set(eventType, { handlers: [] });
    }
    specific.get(eventType)!.handlers.push(provider);
  }
}
