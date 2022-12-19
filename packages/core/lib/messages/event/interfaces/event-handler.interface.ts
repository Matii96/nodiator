import { Observable } from 'rxjs';
import { MessageProvider } from '../../interfaces/message-provider.interface';
import { Event } from './event.interface';

export interface IEventHandler<TEvent extends Event> extends MessageProvider {
  handle(event: TEvent): Promise<void> | Observable<void>;
}
