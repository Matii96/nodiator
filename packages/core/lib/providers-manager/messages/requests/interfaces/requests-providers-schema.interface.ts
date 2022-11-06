import { Type } from '../../../../utils/type.interface';
import { IRequest, IRequestHandler, IRequestPipeline } from '../../../../messages';
import { IMessageTypeProvidersSchema } from '../../../interfaces/message-type-providers-schema.interface';

interface IRequestsGlobalProvidersSchema {
  pipelines: Type<IRequestPipeline<IRequest, any>>[];
}

export interface IRequestsSpecificProvidersSchema {
  pipelines: Type<IRequestPipeline<IRequest, any>>[];
  handler: Type<IRequestHandler<IRequest, any>> | null;
}

export interface IRequestsProvidersSchema extends IMessageTypeProvidersSchema {
  global: IRequestsGlobalProvidersSchema;
  specific: Map<Type<IRequest>, IRequestsSpecificProvidersSchema>;
}
