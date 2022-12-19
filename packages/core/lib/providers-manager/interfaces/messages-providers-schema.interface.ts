import { MessageTypes } from '../../messages/message-types.enum';
import { MessageTypeProvidersSchema } from './message-type-providers-schema.interface';

export type MessagesProvidersSchema = Record<MessageTypes, MessageTypeProvidersSchema>;
