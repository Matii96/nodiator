import { Type } from '../../utils/type.interface';
import { MessageTypes } from '../../messages';
import { IMessageProvider } from '../../messages/interfaces/message-provider.interface';
import { IMessageTypeProvidersSchema } from '../interfaces/message-type-providers-schema.interface';

export interface IProviderTypeAdapter<TProvidersSchema extends IMessageTypeProvidersSchema> {
  messageType: MessageTypes;
  metadataKey: string;
  register(adaptedProviders: TProvidersSchema, provider: Type<IMessageProvider>, metadata: any): void;
}
