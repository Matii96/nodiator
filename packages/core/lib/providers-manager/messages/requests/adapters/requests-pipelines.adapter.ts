import { ClassConstructor } from '../../../../utils/class-constructor.interface';
import { IRequest, IRequestPipeline, MessageTypes } from '../../../../messages';
import { REQUEST_PIPELINE_METADATA } from '../../../../messages/constants';
import { IProviderTypeAdapter } from '../../../ports/provider-type-adapter.port';
import {
  IRequestsProvidersSchema,
  IRequestsSpecificProvidersSchema,
} from '../interfaces/requests-providers-schema.interface';

export class RequestsPipelinesAdapter implements IProviderTypeAdapter<IRequestsProvidersSchema> {
  readonly messageType = MessageTypes.REQUEST;
  readonly metadataKey = REQUEST_PIPELINE_METADATA;

  register(
    adaptedProviders: IRequestsProvidersSchema,
    provider: ClassConstructor<IRequestPipeline<IRequest, unknown>>,
    requestsTypes: Set<ClassConstructor<IRequest>>
  ) {
    for (const requestType of requestsTypes) {
      this.registerPipeline(adaptedProviders, provider, requestType);
    }
  }

  private registerPipeline(
    { specific }: Pick<IRequestsProvidersSchema, 'specific'>,
    provider: ClassConstructor<IRequestPipeline<IRequest, unknown>>,
    requestType: ClassConstructor<IRequest>
  ) {
    if (!specific.has(requestType)) {
      specific.set(requestType, { pipelines: [], handler: null });
    }
    (specific.get(requestType) as IRequestsSpecificProvidersSchema).pipelines.push(provider);
  }
}
