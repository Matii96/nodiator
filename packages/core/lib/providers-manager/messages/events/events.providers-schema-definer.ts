import { MessageTypes } from '../../../messages';
import { MessageTypeProvidersSchemaDefiner } from '../shared/message-type-providers-schema-definer.port';
import { EventsProvidersSchema } from './interfaces/events-providers-schema.interface';

export class EventsProvidersSchemaDefiner implements MessageTypeProvidersSchemaDefiner {
  readonly messageType = MessageTypes.EVENT;

  define(): EventsProvidersSchema {
    return {
      global: { handlers: [] },
      specific: new Map(),
    };
  }
}
