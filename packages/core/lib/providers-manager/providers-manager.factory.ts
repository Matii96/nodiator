import { Type } from '../utils/type.interface';
import { IMediatorLogger } from '../mediator/mediator.options';
import { IMessageTypeProvidersSchemaDefiner } from './ports/message-type-providers-schema-definer.port';
import { IProviderTypeAdapter } from './ports/provider-type-adapter.port';
import { ProvidersManager } from './providers-manager';
import { GlobalEventsHandlersAdapter } from './messages/events/adapters/global-events-handlers.adapter';
import { EventsHandlersAdapter } from './messages/events/adapters/events-handlers.adapter';
import { EventsProvidersSchemaDefiner } from './messages/events/events.providers-schema-definer';
import { RequestsProvidersSchemaDefiner } from './messages/requests/requests.providers-schema-definer';
import { GlobalRequestsPipelinesAdapter } from './messages/requests/adapters/global-requests-pipelines.adapter';
import { RequestsPipelinesAdapter } from './messages/requests/adapters/requests-pipelines.adapter';
import { RequestsHandlersAdapter } from './messages/requests/adapters/requests-handlers.adapter';

export class ProvidersManagerFactory {
  private readonly schemaDefinersTypes: Type<IMessageTypeProvidersSchemaDefiner>[] = [
    EventsProvidersSchemaDefiner,
    RequestsProvidersSchemaDefiner,
  ];
  private readonly adaptersTypes: Type<IProviderTypeAdapter<object>>[] = [
    GlobalEventsHandlersAdapter,
    EventsHandlersAdapter,
    GlobalRequestsPipelinesAdapter,
    RequestsPipelinesAdapter,
    RequestsHandlersAdapter,
  ];

  constructor(private readonly logger: IMediatorLogger) {}

  create() {
    return new ProvidersManager(
      this.logger,
      this.schemaDefinersTypes.map((definer) => new definer()),
      this.adaptersTypes.map((adapter) => new adapter())
    );
  }
}
