import { IMessageProvider } from '../../messages/interfaces/message-provider.interface';
import { Type } from '../../utils/type.interface';

export type ProvidersInstantiator = <TProvider extends IMessageProvider>(
  type: Type<TProvider>
) => TProvider | Promise<TProvider>;
