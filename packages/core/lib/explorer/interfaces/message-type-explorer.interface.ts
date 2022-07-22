import { MessageTypes } from '../../messages/message-types.enum';
import { IMessageTypeProvider } from './message-type-provider.interface';

export interface IMessageTypeExplorer {
  type: MessageTypes;
  metadataKeys: string[];
  explore(messageTypeProviders: Map<string, IMessageTypeProvider[]>): object;
}
