import { Type } from '../../../../utils/type.interface';
import { IEvent, IEventHandler, MessageTypes } from '../../../../messages';
import { GLOBAL_REQUEST_PIPELINE_METADATA } from '../../../../messages/constants';
import { IProviderTypeAdapter } from '../../../ports/provider-type-adapter.port';
import { IRequestsProvidersSchema } from '../interfaces/requests-providers-schema.interface';

export class GlobalRequestsPipelinesAdapter implements IProviderTypeAdapter<IRequestsProvidersSchema> {
  readonly messageType = MessageTypes.REQUEST;
  readonly metadataKey = GLOBAL_REQUEST_PIPELINE_METADATA;

  register(adaptedProviders: IRequestsProvidersSchema, provider: Type<IEventHandler<IEvent>>) {
    adaptedProviders.global.pipelines.push(provider);
  }
}