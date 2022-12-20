import { ClassConstructor } from '../../../../utils/class-constructor.interface';
import { Request, MessageTypes, IRequestPipeline } from '../../../../messages';
import { REQUEST_PIPELINE_METADATA } from '../../../../messages/request/constants';
import { ProviderTypeAdapter } from '../../shared/provider-type-adapter.port';
import { RequestsProvidersSchema } from '../interfaces/requests-providers-schema.interface';

export class RequestsPipelinesAdapter implements ProviderTypeAdapter<RequestsProvidersSchema> {
  readonly messageType = MessageTypes.REQUEST;
  readonly metadataKey = REQUEST_PIPELINE_METADATA;

  register(
    adaptedProviders: RequestsProvidersSchema,
    provider: ClassConstructor<IRequestPipeline<Request, unknown>>,
    requestsTypes: Set<ClassConstructor<Request>>
  ) {
    for (const requestType of requestsTypes) {
      this.registerPipeline(adaptedProviders, provider, requestType);
    }
  }

  private registerPipeline(
    { specific }: Pick<RequestsProvidersSchema, 'specific'>,
    provider: ClassConstructor<IRequestPipeline<Request, unknown>>,
    requestType: ClassConstructor<Request>
  ) {
    if (!specific.has(requestType)) {
      specific.set(requestType, { pipelines: [], handler: null });
    }
    specific.get(requestType)!.pipelines.push(provider);
  }
}
