import { Type } from '../../utils/type.interface';
import { IMessageProvider, MessageTypes } from '../../messages';
import { IMessagesProvidersSchema } from '../interfaces/messages-providers-schema.interface';
import { IMessageTypeProvidersSchema } from '../interfaces/message-type-providers-schema.interface';
import { ProvidersManagerOptions } from '../providers-manager.options';

export interface IProvidersManager {
  get(): IMessagesProvidersSchema;
  get<TProvidersSchema extends IMessageTypeProvidersSchema>(messageType: MessageTypes): TProvidersSchema;

  register(...providers: Type<IMessageProvider>[]): Type<IMessageProvider>[];
  register(args: ProvidersManagerOptions): Type<IMessageProvider>[];
}
