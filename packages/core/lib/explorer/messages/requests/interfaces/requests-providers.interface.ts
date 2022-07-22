import { Type } from '../../../../utils/type.interface';
import { IRequest, IRequestHandler, IRequestPipeline } from '../../../../messages';

export interface IRequestsGlobalProviders {
  pipelines: Type<IRequestPipeline<IRequest, any>>[];
}

export interface IRequestsSpecificProviders {
  pipelines: Type<IRequestPipeline<IRequest, any>>[];
  handler: Type<IRequestHandler<IRequest, any>>;
}

export interface IRequestsProviders {
  global: IRequestsGlobalProviders;
  specific: Map<Type<IRequest>, IRequestsSpecificProviders>;
}
