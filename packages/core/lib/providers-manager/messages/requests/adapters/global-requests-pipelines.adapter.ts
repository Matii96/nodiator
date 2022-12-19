import { ClassConstructor } from '../../../../utils/class-constructor.interface';
import { Request, MessageTypes, IRequestPipeline } from '../../../../messages';
import { GLOBAL_REQUEST_PIPELINE_METADATA } from '../../../../messages/request/constants';
import { ProviderTypeAdapter } from '../../../ports/provider-type-adapter.port';
import { RequestsProvidersSchema } from '../interfaces/requests-providers-schema.interface';

export class GlobalRequestsPipelinesAdapter implements ProviderTypeAdapter<RequestsProvidersSchema> {
  readonly messageType = MessageTypes.REQUEST;
  readonly metadataKey = GLOBAL_REQUEST_PIPELINE_METADATA;

  register(adaptedProviders: RequestsProvidersSchema, provider: ClassConstructor<IRequestPipeline<Request, unknown>>) {
    adaptedProviders.global.pipelines.push(provider);
  }
}
