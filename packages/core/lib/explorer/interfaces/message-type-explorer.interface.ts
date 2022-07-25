import { MessageTypes } from '../../messages/message-types.enum';
import { IMessageTypeExplorerResult } from './message-type-explorer.result.interface';
import { IMessageTypeProvider } from './message-type-provider.interface';

export interface IMessageTypeExplorer<TProviders = any> {
  type: MessageTypes;
  metadataKeys: string[];
  explore(messageTypeProviders: Map<string, IMessageTypeProvider[]>): IMessageTypeExplorerResult<TProviders>;
}
