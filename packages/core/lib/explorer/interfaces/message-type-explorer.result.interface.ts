import { IMessageProvider } from '../../messages/interfaces/message-provider.interface';
import { Type } from '../../utils/type.interface';

export interface IMessageTypeExplorerResult<TProviders> {
  flattenedProviders: Type<IMessageProvider>[];
  providers: TProviders;
}
