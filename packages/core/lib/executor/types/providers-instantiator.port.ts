import { MessageProvider } from '../../messages/interfaces/message-provider.interface';
import { ClassConstructor } from '../../utils/class-constructor.interface';

export type ProvidersInstantiator = <TProvider extends MessageProvider>(
  type: ClassConstructor<TProvider>
) => TProvider | Promise<TProvider>;
