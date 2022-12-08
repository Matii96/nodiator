import { ClassConstructor } from '../../../../utils/class-constructor.interface';
import { IEvent, IEventHandler } from '../../../../messages';
import { IMessageTypeProvidersSchema } from '../../../interfaces/message-type-providers-schema.interface';

export interface IEventsSpecificProvidersSchema {
  handlers: ClassConstructor<IEventHandler<IEvent>>[];
}

export interface IEventsProvidersSchema extends IMessageTypeProvidersSchema {
  global: IEventsSpecificProvidersSchema;
  specific: Map<ClassConstructor<IEvent>, IEventsSpecificProvidersSchema>;
}
