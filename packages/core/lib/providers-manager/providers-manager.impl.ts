import { ClassConstructor } from '../utils/class-constructor.interface';
import { MessageTypes } from '../messages';
import { MessageProvider } from '../messages/interfaces/message-provider.interface';
import { ProviderTypeAdapter } from './messages/shared/provider-type-adapter.port';
import { MessagesProvidersSchema } from './interfaces/messages-providers-schema.interface';
import { ProvidersManager } from './providers-manager';
import { MessageTypeProvidersSchema } from './interfaces/message-type-providers-schema.interface';
import { MessageTypeProvidersSchemaDefiner } from './messages/shared/message-type-providers-schema-definer.port';

export class MediatorProvidersManager implements ProvidersManager {
  private readonly _providers = {} as MessagesProvidersSchema;
  private readonly _flattenedProviders = new Set<ClassConstructor<MessageProvider>>();

  constructor(
    schemaDefiners: MessageTypeProvidersSchemaDefiner[],
    private readonly _adapters: ProviderTypeAdapter<object>[]
  ) {
    for (const definer of schemaDefiners) {
      this._providers[definer.messageType] = definer.define();
    }
  }

  list() {
    return this._providers;
  }

  get<TProvidersSchema extends MessageTypeProvidersSchema>(messageType: MessageTypes) {
    return this._providers[messageType] as TProvidersSchema;
  }

  register(...providersOrOptions: ClassConstructor<MessageProvider>[]) {
    return providersOrOptions.filter((provider: ClassConstructor<MessageProvider>) => this.registerProvider(provider));
  }

  private registerProvider(provider: ClassConstructor<MessageProvider>) {
    if (this._flattenedProviders.has(provider)) {
      return false;
    }
    for (const adapter of this._adapters) {
      if (!this.adaptProvider(adapter, provider)) continue;
      return true;
    }
    return false;
  }

  private adaptProvider(adapter: ProviderTypeAdapter<object>, provider: ClassConstructor<MessageProvider>): boolean {
    const metadata = Reflect.getMetadata(adapter.metadataKey, provider);
    if (!metadata) return false;
    adapter.register(this._providers[adapter.messageType], provider, metadata);
    this._flattenedProviders.add(provider);
    return true;
  }
}
