import { MessageTypes } from '../../../messages';
import { IMessageTypeProvidersSchemaDefiner } from '../../ports/message-type-providers-schema-definer.port';
import { IEventsProvidersSchema } from './interfaces/events-providers-schema.interface';

export class EventsProvidersSchemaDefiner implements IMessageTypeProvidersSchemaDefiner {
  readonly messageType = MessageTypes.EVENT;

  define(): IEventsProvidersSchema {
    return {
      global: { handlers: [] },
      specific: new Map(),
    };
  }
}
