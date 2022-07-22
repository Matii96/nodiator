import { Type } from '../../utils/type.interface';

export interface IProvidersInstantiator {
  instantiate<TProvider>(type: Type<TProvider>): TProvider | Promise<TProvider>;
}
