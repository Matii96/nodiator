import { Type } from '../../../utils/type.interface';
import {
  MESSAGE_METADATA,
  GLOBAL_REQUEST_PIPELINE_METADATA,
  REQUEST_HANDLER_METADATA,
  REQUEST_PIPELINE_METADATA,
} from '../../../messages/constants';
import { IRequest, IRequestPipeline } from '../../../messages';
import { IMessageTypeExplorer } from '../../interfaces/message-type-explorer.interface';
import { IMessageTypeProvider } from '../../interfaces/message-type-provider.interface';
import { MessageTypes } from '../../../messages/message-types.enum';
import { IMessageMetadata } from '../../../messages/interfaces/message-metadata.interface';
import {
  IRequestsGlobalProviders,
  IRequestsProviders,
  IRequestsSpecificProviders,
} from './interfaces/requests-providers.interface';
import { DuplicatedRequestHandlerException } from './exceptions/duplicated-request-handler.exception';
import { NoHandlerException } from './exceptions/no-handler.exception';

export class RequestsExplorerService implements IMessageTypeExplorer {
  readonly type = MessageTypes.REQUEST;
  readonly metadataKeys = [GLOBAL_REQUEST_PIPELINE_METADATA, REQUEST_PIPELINE_METADATA, REQUEST_HANDLER_METADATA];

  explore(messageTypeProviders: Map<string, IMessageTypeProvider[]>): IRequestsProviders {
    return {
      global: this.getGlobalProviders(messageTypeProviders),
      specific: this.getSpecificProviders(messageTypeProviders),
    };
  }

  private getGlobalProviders(messageTypeProviders: Map<string, IMessageTypeProvider[]>): IRequestsGlobalProviders {
    return {
      pipelines: messageTypeProviders
        .get(GLOBAL_REQUEST_PIPELINE_METADATA)
        .map<Type<IRequestPipeline<IRequest, object>>>(({ provider }) => provider),
    };
  }

  private getSpecificProviders(messageTypeProviders: Map<string, IMessageTypeProvider[]>) {
    const providers = new Map<Type<IRequest>, IRequestsSpecificProviders>();
    for (const handler of messageTypeProviders.get(REQUEST_HANDLER_METADATA)) {
      this.processHandler(handler, providers);
    }
    for (const pipeline of messageTypeProviders.get(REQUEST_PIPELINE_METADATA)) {
      this.processPipeline(pipeline, providers);
    }
    return providers;
  }

  private processHandler(handler: IMessageTypeProvider, providers: Map<Type<IRequest>, IRequestsSpecificProviders>) {
    const requestType: Type<IRequest> = handler.metadata;
    if (providers.has(requestType)) {
      throw new DuplicatedRequestHandlerException(requestType);
    }
    providers.set(requestType, { pipelines: [], handler: handler.provider });
  }

  private processPipeline(pipeline: IMessageTypeProvider, providers: Map<Type<IRequest>, IRequestsSpecificProviders>) {
    const requestTypes: Set<Type<IRequest>> = pipeline.metadata;
    for (const requestType of requestTypes) {
      const requestTypeMetadata: IMessageMetadata = Reflect.getMetadata(MESSAGE_METADATA, requestType);
      if (!(requestTypeMetadata && providers.has(requestType))) {
        throw new NoHandlerException(requestType);
      }

      providers.get(requestType).pipelines.push(pipeline.provider);
    }
  }
}
