import { Type } from '../utils/type.interface';
import { IMessageProvider } from '../messages/interfaces/message-provider.interface';
import { IMessageTypeExplorer } from './ports/message-type-explorer.port';
import { IMessageTypeProvider } from './interfaces/message-type-provider.interface';
import { IMessagesProviders } from './interfaces/explored-providers.interface';

export class Explorer {
  constructor(private readonly messagesExplorers: IMessageTypeExplorer[]) {}

  explore(providers: Set<Type<IMessageProvider>>) {
    const exploredProviders = {} as IMessagesProviders;
    for (const explorer of this.messagesExplorers) {
      exploredProviders[explorer.type] = this.exploreMessageType(providers, explorer);
    }
    return exploredProviders;
  }

  private exploreMessageType(providers: Set<Type<IMessageProvider>>, messagesTypeExplorer: IMessageTypeExplorer) {
    const messageTypeProviders = new Map<string, IMessageTypeProvider[]>();
    for (const metadataKey of messagesTypeExplorer.metadataKeys) {
      messageTypeProviders.set(metadataKey, this.filterProviders(providers, metadataKey));
    }
    return messagesTypeExplorer.explore(messageTypeProviders);
  }

  private filterProviders(providers: Set<Type<IMessageProvider>>, metadataKey: string) {
    return Array.from(providers)
      .map((provider) => this.extractMetadata(provider as Type<IMessageProvider>, metadataKey))
      .filter((provider) => provider);
  }

  private extractMetadata(provider: Type<IMessageProvider>, metadataKey: string): IMessageTypeProvider {
    if (!provider.constructor) return;
    const metadata = Reflect.getMetadata(metadataKey, provider);
    return metadata ? { provider, metadata } : undefined;
  }
}
