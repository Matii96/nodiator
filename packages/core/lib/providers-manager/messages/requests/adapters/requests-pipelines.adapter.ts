import { Type } from '../../../../utils/type.interface';
import { IEvent, IEventHandler, IRequest, MessageTypes } from '../../../../messages';
import { REQUEST_PIPELINE_METADATA } from '../../../../messages/constants';
import { IProviderTypeAdapter } from '../../../ports/provider-type-adapter.port';
import { IRequestsProvidersSchema } from '../interfaces/requests-providers-schema.interface';

export class RequestsPipelinesAdapter implements IProviderTypeAdapter<IRequestsProvidersSchema> {
  readonly messageType = MessageTypes.REQUEST;
  readonly metadataKey = REQUEST_PIPELINE_METADATA;

  register(
    adaptedProviders: IRequestsProvidersSchema,
    provider: Type<IEventHandler<IEvent>>,
    requestsTypes: Set<Type<IRequest>>
  ) {
    for (const requestType of requestsTypes) {
      this.registerPipeline(adaptedProviders, provider, requestType);
    }
  }

  private registerPipeline(
    { specific }: Pick<IRequestsProvidersSchema, 'specific'>,
    provider: Type<IEventHandler<IEvent>>,
    requestType: Type<IRequest>
  ) {
    if (!specific.has(requestType)) {
      specific.set(requestType, { pipelines: [], handler: null });
    }
    specific.get(requestType).pipelines.push(provider);
  }
}
