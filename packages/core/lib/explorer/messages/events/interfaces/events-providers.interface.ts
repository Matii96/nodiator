import { Type } from '../../../../utils/type.interface';
import { IEvent, IEventHandler } from '../../../../messages';

export interface IEventsSpecificProviders {
  handlers: Type<IEventHandler<IEvent>>[];
}

export interface IEventsProviders {
  global: IEventsSpecificProviders;
  specific: Map<Type<IEvent>, IEventsSpecificProviders>;
}
