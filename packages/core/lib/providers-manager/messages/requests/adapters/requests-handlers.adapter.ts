import { Type } from '../../../../utils/type.interface';
import { IEvent, IEventHandler, IRequest, MessageTypes } from '../../../../messages';
import { REQUEST_HANDLER_METADATA } from '../../../../messages/constants';
import { IProviderTypeAdapter } from '../../../ports/provider-type-adapter.port';
import { IRequestsProvidersSchema } from '../interfaces/requests-providers-schema.interface';
import { DuplicatedRequestHandlerException } from '../exceptions/duplicated-request-handler.exception';

export class RequestsHandlersAdapter implements IProviderTypeAdapter<IRequestsProvidersSchema> {
  readonly messageType = MessageTypes.REQUEST;
  readonly metadataKey = REQUEST_HANDLER_METADATA;

  register(
    adaptedProviders: IRequestsProvidersSchema,
    provider: Type<IEventHandler<IEvent>>,
    requestType: Type<IRequest>
  ) {
    if (adaptedProviders.specific.get(requestType)?.handler) {
      throw new DuplicatedRequestHandlerException(requestType);
    }
    if (!adaptedProviders.specific.has(requestType)) {
      adaptedProviders.specific.set(requestType, { pipelines: [], handler: null });
    }
    adaptedProviders.specific.get(requestType).handler = provider;
  }
}
