import { ClassConstructor } from '../../../../utils/class-constructor.interface';
import { IEvent, IEventHandler, MessageTypes } from '../../../../messages';
import { EVENT_HANDLER_METADATA } from '../../../../messages/event/constants';
import { IProviderTypeAdapter } from '../../../ports/provider-type-adapter.port';
import {
  IEventsProvidersSchema,
  IEventsSpecificProvidersSchema,
} from '../interfaces/events-providers-schema.interface';

export class EventsHandlersAdapter implements IProviderTypeAdapter<IEventsProvidersSchema> {
  readonly messageType = MessageTypes.EVENT;
  readonly metadataKey = EVENT_HANDLER_METADATA;

  register(
    adaptedProviders: IEventsProvidersSchema,
    provider: ClassConstructor<IEventHandler<IEvent>>,
    eventTypes: Set<ClassConstructor<IEvent>>
  ) {
    for (const eventType of eventTypes) {
      this.registerHandler(adaptedProviders, provider, eventType);
    }
  }

  private registerHandler(
    { specific }: Pick<IEventsProvidersSchema, 'specific'>,
    provider: ClassConstructor<IEventHandler<IEvent>>,
    eventType: ClassConstructor<IEvent>
  ) {
    if (!specific.has(eventType)) {
      specific.set(eventType, { handlers: [] });
    }
    (specific.get(eventType) as IEventsSpecificProvidersSchema).handlers.push(provider);
  }
}
