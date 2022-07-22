import { MessageTypes } from '../../messages/message-types.enum';
import { IMessage } from '../../messages/interfaces/message.interface';

export interface IMessageState {
  type: MessageTypes;
  message: IMessage;
}
