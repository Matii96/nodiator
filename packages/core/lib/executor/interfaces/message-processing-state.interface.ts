import { MessageTypes } from '../../messages';
import { IMessageProvider } from '../../messages/interfaces/message-provider.interface';
import { IMessage } from '../../messages/interfaces/message.interface';

export interface IMessageProcessingState {
  id: string;
  messageType: MessageTypes;
  message: IMessage;
  provider?: IMessageProvider;
  error?: Error;
}
