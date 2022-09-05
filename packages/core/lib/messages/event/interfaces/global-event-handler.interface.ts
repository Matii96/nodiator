import { Observable } from 'rxjs';
import { IMessageProvider } from '../../interfaces/message-provider.interface';
import { IEvent } from './event.interface';

export interface IGlobalEventHandler extends IMessageProvider {
  handle(event: IEvent): Promise<void> | Observable<void>;
}
