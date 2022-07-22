import { IEvent } from './event.interface';

export interface IEventHandler<TEvent extends IEvent> {
  handle(event: TEvent): Promise<void>;
}
