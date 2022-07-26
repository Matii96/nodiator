import { MessageTypes } from '../../../messages';
import { IMessageTypeProvidersSchemaDefiner } from '../../ports/message-type-providers-schema-definer.port';
import { IRequestsProvidersSchema } from './interfaces/requests-providers-schema.interface';

export class RequestsProvidersSchemaDefiner implements IMessageTypeProvidersSchemaDefiner {
  readonly messageType = MessageTypes.REQUEST;

  define(): IRequestsProvidersSchema {
    return {
      global: { pipelines: [] },
      specific: new Map(),
    };
  }
}
