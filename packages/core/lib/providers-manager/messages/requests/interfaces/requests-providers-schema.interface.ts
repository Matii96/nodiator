import { ClassConstructor } from '../../../../utils/class-constructor.interface';
import { Request, IRequestHandler, IRequestPipeline } from '../../../../messages';
import { MessageTypeProvidersSchema } from '../../../interfaces/message-type-providers-schema.interface';

interface RequestsGlobalProvidersSchema {
  readonly pipelines: ClassConstructor<IRequestPipeline<Request, any>>[];
}

export interface RequestsSpecificProvidersSchema {
  readonly pipelines: ClassConstructor<IRequestPipeline<Request, any>>[];
  handler: ClassConstructor<IRequestHandler<Request, any>> | null;
}

export interface RequestsProvidersSchema extends MessageTypeProvidersSchema {
  readonly global: RequestsGlobalProvidersSchema;
  readonly specific: Map<ClassConstructor<Request>, RequestsSpecificProvidersSchema>;
}
