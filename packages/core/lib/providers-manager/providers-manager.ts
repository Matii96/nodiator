import { Type } from '../utils/type.interface';
import { MessageTypes } from '../messages';
import { IMessageProvider } from '../messages/interfaces/message-provider.interface';
import { IProviderTypeAdapter } from './ports/provider-type-adapter.port';
import { IMessageTypeProvidersSchemaDefiner } from './ports/message-type-providers-schema-definer.port';
import { IMessagesProvidersSchema } from './interfaces/messages-providers-schema.interface';

export class ProvidersManager {
  private readonly _providers = {} as IMessagesProvidersSchema;

  constructor(
    schemaDefiners: IMessageTypeProvidersSchemaDefiner[],
    private readonly _adapters: IProviderTypeAdapter<object>[]
  ) {
    for (const definer of schemaDefiners) {
      this._providers[definer.messageType] = definer.define();
    }
  }

  get(): IMessagesProvidersSchema;
  get<TProvidersSchema>(messageType: MessageTypes): TProvidersSchema;
  get(messageType?: MessageTypes) {
    return messageType === undefined ? this._providers : this._providers[messageType];
  }

  register(...providers: Type<IMessageProvider>[]) {
    for (const provider of providers) {
      this.registerProvider(provider);
    }
  }

  private registerProvider(provider: Type<IMessageProvider>) {
    for (const adapter of Object.values(this._adapters)) {
      const metadata = Reflect.getMetadata(adapter.metadataKey, provider);
      if (metadata) {
        adapter.register(this._providers[adapter.messageType], provider, metadata);
        return;
      }
    }

    // TODO: warning
  }
}
