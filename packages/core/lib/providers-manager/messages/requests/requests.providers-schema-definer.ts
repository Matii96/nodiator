import { MessageTypes } from '../../../messages';
import { MessageTypeProvidersSchemaDefiner } from '../shared/message-type-providers-schema-definer.port';
import { RequestsProvidersSchema } from './interfaces/requests-providers-schema.interface';

export class RequestsProvidersSchemaDefiner implements MessageTypeProvidersSchemaDefiner {
  readonly messageType = MessageTypes.REQUEST;

  define(): RequestsProvidersSchema {
    return {
      global: { pipelines: [] },
      specific: new Map(),
    };
  }
}
