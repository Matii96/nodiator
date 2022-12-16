import { Observable } from 'rxjs';
import { MessageProvider } from '../../interfaces/message-provider.interface';
import { Event } from './event.interface';

export interface IGlobalEventHandler extends MessageProvider {
  handle(event: Event): Promise<void> | Observable<void>;
}
