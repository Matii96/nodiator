import { MessageTypes } from '../../messages/message-types.enum';

export interface IMessagesProviders extends Record<MessageTypes, object> {}
