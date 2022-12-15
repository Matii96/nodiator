import { ClassConstructor } from '../../utils/class-constructor.interface';
import { MessageTypes } from '../../messages';
import { IMessageProvider } from '../../messages/interfaces/message-provider.interface';
import { IMessageTypeProvidersSchema } from '../interfaces/message-type-providers-schema.interface';

export interface IProviderTypeAdapter<TProvidersSchema extends IMessageTypeProvidersSchema> {
  readonly messageType: MessageTypes;
  readonly metadataKey: symbol;
  register(adaptedProviders: TProvidersSchema, provider: ClassConstructor<IMessageProvider>, metadata: any): void;
}
