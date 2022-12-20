import { MessageTypes } from '../../../messages';
import { MessageTypeProvidersSchema } from '../../interfaces/message-type-providers-schema.interface';

export interface MessageTypeProvidersSchemaDefiner {
  readonly messageType: MessageTypes;
  define(): MessageTypeProvidersSchema;
}
