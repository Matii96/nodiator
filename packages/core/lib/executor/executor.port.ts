import { Observable } from 'rxjs';
import { MessageTypes } from '../messages';
import { Message } from '../messages/interfaces/message.interface';

export interface Executor {
  execute<TResult>(messageType: MessageTypes, message: Message): Observable<TResult>;
}
