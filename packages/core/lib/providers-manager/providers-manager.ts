import { ClassConstructor } from '../utils/class-constructor.interface';
import { MessageProvider, MessageTypes } from '../messages';
import { MessagesProvidersSchema } from './interfaces/messages-providers-schema.interface';
import { MessageTypeProvidersSchema } from './interfaces/message-type-providers-schema.interface';

export interface ProvidersManager {
  list(): MessagesProvidersSchema;
  get<TProvidersSchema extends MessageTypeProvidersSchema>(messageType: MessageTypes): TProvidersSchema;

  register(...providers: ClassConstructor<MessageProvider>[]): ClassConstructor<MessageProvider>[];
}
