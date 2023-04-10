import { Observable } from 'rxjs';
import { MessageProvider } from '../../interfaces/message-provider.interface';
import { Event } from '../event';

export interface IEventHandler<TEvent extends Event> extends MessageProvider {
  handle(event: TEvent): Promise<any> | Observable<any>;
}
