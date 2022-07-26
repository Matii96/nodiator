import { MessageTypes } from '../../messages';
import { IMessageProvider } from '../../messages/interfaces/message-provider.interface';
import { IMessage } from '../../messages/interfaces/message.interface';

export interface IMessageProcessingState {
  id: string;
  type: MessageTypes;
  data: IMessage;
  provider?: IMessageProvider;
  result?: any;
}

export interface IMessageProcessingState {
  id: string;
  type: MessageTypes;
  data: IMessage;
  provider?: IMessageProvider;
  error?: Error;
}
