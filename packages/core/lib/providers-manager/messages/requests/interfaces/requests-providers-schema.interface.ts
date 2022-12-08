import { ClassConstructor } from '../../../../utils/class-constructor.interface';
import { IRequest, IRequestHandler, IRequestPipeline } from '../../../../messages';
import { IMessageTypeProvidersSchema } from '../../../interfaces/message-type-providers-schema.interface';

interface IRequestsGlobalProvidersSchema {
  pipelines: ClassConstructor<IRequestPipeline<IRequest, any>>[];
}

export interface IRequestsSpecificProvidersSchema {
  pipelines: ClassConstructor<IRequestPipeline<IRequest, any>>[];
  handler: ClassConstructor<IRequestHandler<IRequest, any>> | null;
}

export interface IRequestsProvidersSchema extends IMessageTypeProvidersSchema {
  global: IRequestsGlobalProvidersSchema;
  specific: Map<ClassConstructor<IRequest>, IRequestsSpecificProvidersSchema>;
}
