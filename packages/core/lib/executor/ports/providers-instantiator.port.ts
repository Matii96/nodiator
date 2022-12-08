import { IMessageProvider } from '../../messages/interfaces/message-provider.interface';
import { ClassConstructor } from '../../utils/class-constructor.interface';

export type ProvidersInstantiator = <TProvider extends IMessageProvider>(
  type: ClassConstructor<TProvider>
) => TProvider | Promise<TProvider>;
