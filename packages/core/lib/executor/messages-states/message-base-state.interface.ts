import { MessageTypes } from '../../messages/message-types.enum';
import { IMessage } from '../../messages/interfaces/message.interface';

export interface IMessageBaseState {
  id: string;
  type: MessageTypes;
  data: IMessage;
}
