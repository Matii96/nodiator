import { Type } from '../utils/type.interface';
import { IMessageProvider } from '../messages/interfaces/message-provider.interface';
import { IMessageTypeExplorer } from './interfaces/message-type-explorer.interface';
import { IMessageTypeProvider } from './interfaces/message-type-provider.interface';
import { IMessagesProviders } from './interfaces/explored-providers.interface';
import { IProvidersValidator } from './validator/providers.validator.interface';

export class Explorer {
  constructor(
    private readonly messagesExplorers: IMessageTypeExplorer[],
    private readonly providersValidator: IProvidersValidator
  ) {}

  explore(providers: Type<IMessageProvider>[]) {
    const exploredProviders = {} as IMessagesProviders;
    for (const explorer of this.messagesExplorers) {
      const explored = this.exploreMessageType(providers, explorer);
      exploredProviders[explorer.type] = explored.providers;
    }
    return exploredProviders;
  }

  private exploreMessageType(providers: Type<IMessageProvider>[], messagesTypeExplorer: IMessageTypeExplorer) {
    const messageTypeProviders = new Map<string, IMessageTypeProvider[]>();
    for (const metadataKey of messagesTypeExplorer.metadataKeys) {
      messageTypeProviders.set(metadataKey, this.validateProviders(this.filterProviders(providers, metadataKey)));
    }
    return messagesTypeExplorer.explore(messageTypeProviders);
  }

  private validateProviders(providers: IMessageTypeProvider[]) {
    return providers.filter((providerData) => this.providersValidator.validate(providerData.provider));
  }

  private filterProviders(providers: Type<IMessageProvider>[], metadataKey: string) {
    return providers
      .map((provider) => this.extractMetadata(provider as Type<IMessageProvider>, metadataKey))
      .filter((provider) => provider);
  }

  private extractMetadata(provider: Type<IMessageProvider>, metadataKey: string): IMessageTypeProvider {
    if (!provider.constructor) return;
    const metadata = Reflect.getMetadata(metadataKey, provider);
    return metadata ? { provider, metadata } : undefined;
  }
}
