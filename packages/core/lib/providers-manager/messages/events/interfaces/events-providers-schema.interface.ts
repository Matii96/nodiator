import { Type } from '../../../../utils/type.interface';
import { IEvent, IEventHandler } from '../../../../messages';
import { IMessageTypeProvidersSchema } from '../../../interfaces/message-type-providers-schema.interface';

export interface IEventsSpecificProvidersSchema {
  handlers: Type<IEventHandler<IEvent>>[];
}

export interface IEventsProvidersSchema extends IMessageTypeProvidersSchema {
  global: IEventsSpecificProvidersSchema;
  specific: Map<Type<IEvent>, IEventsSpecificProvidersSchema>;
}
