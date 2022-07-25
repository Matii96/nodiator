import { Type } from '../../utils/type.interface';
import { IMessageProvider } from '../../messages/interfaces/message-provider.interface';

export interface IMessageTypeProvider {
  metadata: any;
  provider: Type<IMessageProvider>;
}
