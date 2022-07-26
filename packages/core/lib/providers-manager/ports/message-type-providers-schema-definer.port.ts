import { MessageTypes } from '../../messages';
import { IMessageTypeProvidersSchema } from '../interfaces/message-type-providers-schema.interface';

export interface IMessageTypeProvidersSchemaDefiner {
  messageType: MessageTypes;
  define(): IMessageTypeProvidersSchema;
}
