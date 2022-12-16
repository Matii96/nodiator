import { ClassConstructor } from '../../../../utils/class-constructor.interface';
import { Event, IEventHandler } from '../../../../messages';
import { MessageTypeProvidersSchema } from '../../../interfaces/message-type-providers-schema.interface';

export interface EventsSpecificProvidersSchema {
  readonly handlers: ClassConstructor<IEventHandler<Event>>[];
}

export interface EventsProvidersSchema extends MessageTypeProvidersSchema {
  readonly global: EventsSpecificProvidersSchema;
  readonly specific: Map<ClassConstructor<Event>, EventsSpecificProvidersSchema>;
}
