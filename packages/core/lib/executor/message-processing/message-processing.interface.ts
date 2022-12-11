import { Observable } from 'rxjs';
import { IMessage, MessageTypes } from '../../messages';
import { IMessageProcessingState } from './message-processing-state.interface';

export interface IMessageProcessing {
  readonly id: string;
  readonly startedAt: Date;
  readonly messageType: MessageTypes;
  readonly message: IMessage;
  readonly process: Observable<IMessageProcessingState>;
}
