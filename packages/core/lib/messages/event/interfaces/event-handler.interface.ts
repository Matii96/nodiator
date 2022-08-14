import { IMessageProvider } from '../../interfaces/message-provider.interface';
import { IEvent } from './event.interface';

export interface IEventHandler<TEvent extends IEvent> extends IMessageProvider {
  handle(event: TEvent): Promise<void>;
}
