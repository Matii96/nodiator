import { Observable, Subject } from 'rxjs';
import { Message } from '../../messages/interfaces/message.interface';
import { MessageProcessingState } from '../message-processing';

export interface MessageExecutor<TMessage extends Message, TResult> {
  execute(messageProcessing: Subject<MessageProcessingState>, message: TMessage): Observable<TResult>;
}
