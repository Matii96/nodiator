import { Type } from '../utils/type.interface';
import { MessageTypes } from '../messages';
import { IMessageProvider } from '../messages/interfaces/message-provider.interface';
import { IMediatorLogger } from '../mediator/mediator.options';
import { IProviderTypeAdapter } from './ports/provider-type-adapter.port';
import { IMessageTypeProvidersSchemaDefiner } from './ports/message-type-providers-schema-definer.port';
import { IMessagesProvidersSchema } from './interfaces/messages-providers-schema.interface';
import { IMessageTypeProvidersSchema } from './interfaces/message-type-providers-schema.interface';
import { ProvidersManagerOptions } from './providers-manager.options';
import { IProvidersManager } from './ports/providers-manager.port';

export class ProvidersManager implements IProvidersManager {
  private readonly _providers = {} as IMessagesProvidersSchema;
  private readonly _flattenedProviders = new Set<Type<IMessageProvider>>();

  constructor(
    private readonly logger: IMediatorLogger,
    schemaDefiners: IMessageTypeProvidersSchemaDefiner[],
    private readonly _adapters: IProviderTypeAdapter<object>[]
  ) {
    for (const definer of schemaDefiners) {
      this._providers[definer.messageType] = definer.define();
    }
  }

  get(): IMessagesProvidersSchema;
  get<TProvidersSchema extends IMessageTypeProvidersSchema>(messageType: MessageTypes): TProvidersSchema;
  get(messageType?: MessageTypes) {
    return messageType === undefined ? this._providers : this._providers[messageType];
  }

  register(...providers: Type<IMessageProvider>[]): Type<IMessageProvider>[];
  register(args: ProvidersManagerOptions): Type<IMessageProvider>[];
  register(...providersOrOptions: (Type<IMessageProvider> | ProvidersManagerOptions)[]) {
    const optionsProviders = (<ProvidersManagerOptions>providersOrOptions[0])?.providers;
    if (optionsProviders) {
      return optionsProviders.filter((provider) =>
        this.registerProvider(provider, (<ProvidersManagerOptions>providersOrOptions[0]).silent)
      );
    }
    return providersOrOptions.filter((provider: Type<IMessageProvider>) => this.registerProvider(provider));
  }

  private registerProvider(provider: Type<IMessageProvider>, silent = false) {
    if (this._flattenedProviders.has(provider)) {
      if (!silent) this.logger.warn(`${provider.name} is already registered`);
      return false;
    }
    for (const adapter of this._adapters) {
      if (!this.adaptProvider(adapter, provider)) continue;
      if (!silent) this.logger.debug(`${provider.name} registered`);
      return true;
    }
    if (!silent) this.logger.warn(`${provider.name} is not a nodiator provider. Ignoring it`);
    return false;
  }

  private adaptProvider(adapter: IProviderTypeAdapter<object>, provider: Type<IMessageProvider>): boolean {
    const metadata = Reflect.getMetadata(adapter.metadataKey, provider);
    if (!metadata) return false;
    adapter.register(this._providers[adapter.messageType], provider, metadata);
    this._flattenedProviders.add(provider);
    return true;
  }
}
