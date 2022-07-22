import { Type } from '../../../utils/type.interface';
import { EVENT_HANDLER_METADATA, GLOBAL_EVENT_HANDLER_METADATA } from '../../../messages/constants';
import { IEvent } from '../../../messages/event/interfaces/event.interface';
import { MessageTypes } from '../../../messages/message-types.enum';
import { IMessageTypeExplorer } from '../../interfaces/message-type-explorer.interface';
import { IMessageTypeProvider } from '../../interfaces/message-type-provider.interface';
import { IEventsProviders, IEventsSpecificProviders } from './interfaces/events-providers.interface';

export class EventsExplorerService implements IMessageTypeExplorer {
  readonly type = MessageTypes.EVENT;
  readonly metadataKeys = [GLOBAL_EVENT_HANDLER_METADATA, EVENT_HANDLER_METADATA];

  explore(messageTypeProviders: Map<string, IMessageTypeProvider[]>): IEventsProviders {
    return {
      global: this.getGlobalProviders(messageTypeProviders),
      specific: this.getSpecificProviders(messageTypeProviders),
    };
  }

  private getGlobalProviders(messageTypeProviders: Map<string, IMessageTypeProvider[]>): IEventsSpecificProviders {
    return { handlers: messageTypeProviders.get(GLOBAL_EVENT_HANDLER_METADATA).map(({ provider }) => provider) };
  }

  private getSpecificProviders(messageTypeProviders: Map<string, IMessageTypeProvider[]>) {
    const providers = new Map<Type<IEvent>, IEventsSpecificProviders>();
    for (const handler of messageTypeProviders.get(EVENT_HANDLER_METADATA)) {
      this.processHandler(handler, providers);
    }
    return providers;
  }

  private processHandler(handler: IMessageTypeProvider, providers: Map<Type<IEvent>, IEventsSpecificProviders>) {
    const eventTypes: Set<Type<IEvent>> = handler.metadata;
    for (const eventType of eventTypes) {
      if (!providers.has(eventType)) {
        providers.set(eventType, { handlers: [] });
      }
      providers.get(eventType).handlers.push(handler.provider);
    }
  }
}
