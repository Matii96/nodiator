import { Observable } from 'rxjs';
import { MessageTypes } from '../../messages';
import { IMessage } from '../../messages/interfaces/message.interface';

export interface IExecutor {
  execute<TResult>(message: IMessage, messageType: MessageTypes): Observable<TResult>;
}
