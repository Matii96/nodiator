import { Observable, Subject } from 'rxjs';
import { IMessage } from '../../messages/interfaces/message.interface';
import { IMessageProcessingState } from '../message-processing';

export interface IMessageExecutor<TMessage extends IMessage, TResult> {
  execute(messageProcessing: Subject<IMessageProcessingState>, message: TMessage): Observable<TResult>;
}
