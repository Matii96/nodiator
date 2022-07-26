import { ClassConstructor } from '../utils/class-constructor.interface';
import { ProviderTypeAdapter } from './messages/shared/provider-type-adapter.port';
import { MediatorProvidersManager } from './providers-manager.impl';
import { GlobalEventsHandlersAdapter } from './messages/events/adapters/global-events-handlers.adapter';
import { EventsHandlersAdapter } from './messages/events/adapters/events-handlers.adapter';
import { EventsProvidersSchemaDefiner } from './messages/events/events.providers-schema-definer';
import { RequestsProvidersSchemaDefiner } from './messages/requests/requests.providers-schema-definer';
import { GlobalRequestsPipelinesAdapter } from './messages/requests/adapters/global-requests-pipelines.adapter';
import { RequestsPipelinesAdapter } from './messages/requests/adapters/requests-pipelines.adapter';
import { RequestsHandlersAdapter } from './messages/requests/adapters/requests-handlers.adapter';
import { MessageTypeProvidersSchemaDefiner } from './messages/shared/message-type-providers-schema-definer.port';

export class ProvidersManagerFactory {
  private readonly schemaDefinersTypes: ClassConstructor<MessageTypeProvidersSchemaDefiner>[] = [
    EventsProvidersSchemaDefiner,
    RequestsProvidersSchemaDefiner,
  ];
  private readonly adaptersTypes: ClassConstructor<ProviderTypeAdapter<object>>[] = [
    GlobalEventsHandlersAdapter,
    EventsHandlersAdapter,
    GlobalRequestsPipelinesAdapter,
    RequestsPipelinesAdapter,
    RequestsHandlersAdapter,
  ];

  create() {
    return new MediatorProvidersManager(
      this.schemaDefinersTypes.map((definer) => new definer()),
      this.adaptersTypes.map((adapter) => new adapter())
    );
  }
}
