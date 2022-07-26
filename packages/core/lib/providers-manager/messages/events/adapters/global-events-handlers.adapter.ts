import { Type } from '../../../../utils/type.interface';
import { IEvent, IEventHandler, MessageTypes } from '../../../../messages';
import { GLOBAL_EVENT_HANDLER_METADATA } from '../../../../messages/constants';
import { IProviderTypeAdapter } from '../../../ports/provider-type-adapter.port';
import { IEventsProvidersSchema } from '../interfaces/events-providers-schema.interface';

export class GlobalEventsHandlersAdapter implements IProviderTypeAdapter<IEventsProvidersSchema> {
  readonly messageType = MessageTypes.EVENT;
  readonly metadataKey = GLOBAL_EVENT_HANDLER_METADATA;

  register(adaptedProviders: IEventsProvidersSchema, provider: Type<IEventHandler<IEvent>>) {
    adaptedProviders.global.handlers.push(provider);
  }
}
