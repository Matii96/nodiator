import { ClassConstructor } from '../../utils/class-constructor.interface';
import { MessageTypes } from '../../messages';
import { MessageProvider } from '../../messages/interfaces/message-provider.interface';
import { MessageTypeProvidersSchema } from '../interfaces/message-type-providers-schema.interface';

export interface ProviderTypeAdapter<TProvidersSchema extends MessageTypeProvidersSchema> {
  readonly messageType: MessageTypes;
  readonly metadataKey: symbol;
  register(adaptedProviders: TProvidersSchema, provider: ClassConstructor<MessageProvider>, metadata: any): void;
}
