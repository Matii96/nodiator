import { ClassConstructor } from '../utils/class-constructor.interface';
import { MessageTypes } from '../messages';
import { IMessageProvider } from '../messages/interfaces/message-provider.interface';
import { IProviderTypeAdapter } from './ports/provider-type-adapter.port';
import { IMessageTypeProvidersSchemaDefiner } from './ports/message-type-providers-schema-definer.port';
import { IMessagesProvidersSchema } from './interfaces/messages-providers-schema.interface';
import { IProvidersManager } from './ports/providers-manager.port';
import { IMessageTypeProvidersSchema } from './interfaces/message-type-providers-schema.interface';

export class ProvidersManager implements IProvidersManager {
  private readonly _providers = {} as IMessagesProvidersSchema;
  private readonly _flattenedProviders = new Set<ClassConstructor<IMessageProvider>>();

  constructor(
    schemaDefiners: IMessageTypeProvidersSchemaDefiner[],
    private readonly _adapters: IProviderTypeAdapter<object>[]
  ) {
    for (const definer of schemaDefiners) {
      this._providers[definer.messageType] = definer.define();
    }
  }

  list() {
    return this._providers;
  }

  get<TProvidersSchema extends IMessageTypeProvidersSchema>(messageType: MessageTypes) {
    return this._providers[messageType] as TProvidersSchema;
  }

  register(...providersOrOptions: ClassConstructor<IMessageProvider>[]) {
    return providersOrOptions.filter((provider: ClassConstructor<IMessageProvider>) => this.registerProvider(provider));
  }

  private registerProvider(provider: ClassConstructor<IMessageProvider>) {
    if (this._flattenedProviders.has(provider)) {
      return false;
    }
    for (const adapter of this._adapters) {
      if (!this.adaptProvider(adapter, provider)) continue;
      return true;
    }
    return false;
  }

  private adaptProvider(adapter: IProviderTypeAdapter<object>, provider: ClassConstructor<IMessageProvider>): boolean {
    const metadata = Reflect.getMetadata(adapter.metadataKey, provider);
    if (!metadata) return false;
    adapter.register(this._providers[adapter.messageType], provider, metadata);
    this._flattenedProviders.add(provider);
    return true;
  }
}
