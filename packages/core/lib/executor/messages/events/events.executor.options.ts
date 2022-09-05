import { MediatorConfig } from '../../../config/mediator.config';
import { IEvent, IEventHandler } from '../../../messages';

export interface HandleEventOptions {
  options: MediatorConfig;
  id: string;
  event: IEvent;
  handler: IEventHandler<IEvent>;
}
