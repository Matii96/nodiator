import { MessageTypes } from '../../messages/message-types.enum';
import { IMessageTypeProvidersSchema } from './message-type-providers-schema.interface';

export interface IMessagesProvidersSchema extends Record<MessageTypes, IMessageTypeProvidersSchema> {}
