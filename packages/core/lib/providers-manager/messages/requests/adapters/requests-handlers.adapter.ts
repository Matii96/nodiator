import { ClassConstructor } from '../../../../utils/class-constructor.interface';
import { Request, MessageTypes, IRequestHandler } from '../../../../messages';
import { REQUEST_HANDLER_METADATA } from '../../../../messages/request/constants';
import { ProviderTypeAdapter } from '../../shared/provider-type-adapter.port';
import { RequestsProvidersSchema } from '../interfaces/requests-providers-schema.interface';
import { DuplicatedRequestHandlerException } from '../exceptions/duplicated-request-handler.exception';

export class RequestsHandlersAdapter implements ProviderTypeAdapter<RequestsProvidersSchema> {
  readonly messageType = MessageTypes.REQUEST;
  readonly metadataKey = REQUEST_HANDLER_METADATA;

  register(
    adaptedProviders: RequestsProvidersSchema,
    provider: ClassConstructor<IRequestHandler<Request, unknown>>,
    requestType: ClassConstructor<Request>
  ) {
    if (adaptedProviders.specific.get(requestType)?.handler) {
      throw new DuplicatedRequestHandlerException(requestType);
    }
    if (!adaptedProviders.specific.has(requestType)) {
      adaptedProviders.specific.set(requestType, { pipelines: [], handler: provider });
    }
    adaptedProviders.specific.get(requestType)!.handler = provider;
  }
}
