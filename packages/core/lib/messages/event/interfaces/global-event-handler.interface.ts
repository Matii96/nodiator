import { IEvent } from './event.interface';

export interface IGlobalEventHandler {
  handle(event: IEvent): Promise<void>;
}
