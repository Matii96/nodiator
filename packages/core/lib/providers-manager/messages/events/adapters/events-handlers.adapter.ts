import { Type } from '../../../../utils/type.interface';
import { IEvent, IEventHandler, MessageTypes } from '../../../../messages';
import { EVENT_HANDLER_METADATA } from '../../../../messages/constants';
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
    provider: Type<IEventHandler<IEvent>>,
    eventTypes: Set<Type<IEvent>>
  ) {
    for (const eventType of eventTypes) {
      this.registerHandler(adaptedProviders, provider, eventType);
    }
  }

  private registerHandler(
    { specific }: Pick<IEventsProvidersSchema, 'specific'>,
    provider: Type<IEventHandler<IEvent>>,
    eventType: Type<IEvent>
  ) {
    if (!specific.has(eventType)) {
      specific.set(eventType, { handlers: [] });
    }
    (specific.get(eventType) as IEventsSpecificProvidersSchema).handlers.push(provider);
  }
}
