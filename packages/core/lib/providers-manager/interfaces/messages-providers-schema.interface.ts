import { MessageTypes } from '../../messages/message-types.enum';
import { IMessageTypeProvidersSchema } from './message-type-providers-schema.interface';

export type IMessagesProvidersSchema = Record<MessageTypes, IMessageTypeProvidersSchema>;
