import { Observable } from 'rxjs';
import { Message, MessageTypes } from '../../messages';
import { MessageProcessingState } from './message-processing-state.interface';

export interface MessageProcessing {
  readonly id: string;
  readonly startedAt: Date;
  readonly messageType: MessageTypes;
  readonly message: Message;
  readonly process: Observable<MessageProcessingState>;
}
