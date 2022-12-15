import { ClassConstructor } from '../../../../utils/class-constructor.interface';
import { IRequest, IRequestHandler, MessageTypes } from '../../../../messages';
import { REQUEST_HANDLER_METADATA } from '../../../../messages/request/constants';
import { IProviderTypeAdapter } from '../../../ports/provider-type-adapter.port';
import {
  IRequestsProvidersSchema,
  IRequestsSpecificProvidersSchema,
} from '../interfaces/requests-providers-schema.interface';
import { DuplicatedRequestHandlerException } from '../exceptions/duplicated-request-handler.exception';

export class RequestsHandlersAdapter implements IProviderTypeAdapter<IRequestsProvidersSchema> {
  readonly messageType = MessageTypes.REQUEST;
  readonly metadataKey = REQUEST_HANDLER_METADATA;

  register(
    adaptedProviders: IRequestsProvidersSchema,
    provider: ClassConstructor<IRequestHandler<IRequest, unknown>>,
    requestType: ClassConstructor<IRequest>
  ) {
    if (adaptedProviders.specific.get(requestType)?.handler) {
      throw new DuplicatedRequestHandlerException(requestType);
    }
    if (!adaptedProviders.specific.has(requestType)) {
      adaptedProviders.specific.set(requestType, { pipelines: [], handler: provider });
    }
    (adaptedProviders.specific.get(requestType) as IRequestsSpecificProvidersSchema).handler = provider;
  }
}
