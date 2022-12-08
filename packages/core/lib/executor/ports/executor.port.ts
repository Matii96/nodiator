import { Observable } from 'rxjs';
import { MessageTypes } from '../../messages';
import { IMessage } from '../../messages/interfaces/message.interface';

export interface IExecutor {
  execute<TResult>(messageType: MessageTypes, message: IMessage): Observable<TResult>;
}
