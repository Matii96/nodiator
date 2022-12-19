import { ClassConstructor } from '../../../../utils/class-constructor.interface';
import { Event, IEventHandler, MessageTypes } from '../../../../messages';
import { GLOBAL_EVENT_HANDLER_METADATA } from '../../../../messages/event/constants';
import { ProviderTypeAdapter } from '../../../ports/provider-type-adapter.port';
import { EventsProvidersSchema } from '../interfaces/events-providers-schema.interface';

export class GlobalEventsHandlersAdapter implements ProviderTypeAdapter<EventsProvidersSchema> {
  readonly messageType = MessageTypes.EVENT;
  readonly metadataKey = GLOBAL_EVENT_HANDLER_METADATA;

  register(adaptedProviders: EventsProvidersSchema, provider: ClassConstructor<IEventHandler<Event>>) {
    adaptedProviders.global.handlers.push(provider);
  }
}
