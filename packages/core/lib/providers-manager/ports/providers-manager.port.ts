import { ClassConstructor } from '../../utils/class-constructor.interface';
import { IMessageProvider, MessageTypes } from '../../messages';
import { IMessagesProvidersSchema } from '../interfaces/messages-providers-schema.interface';
import { IMessageTypeProvidersSchema } from '../interfaces/message-type-providers-schema.interface';

export interface IProvidersManager {
  list(): IMessagesProvidersSchema;
  get<TProvidersSchema extends IMessageTypeProvidersSchema>(messageType: MessageTypes): TProvidersSchema;

  register(...providers: ClassConstructor<IMessageProvider>[]): ClassConstructor<IMessageProvider>[];
}
