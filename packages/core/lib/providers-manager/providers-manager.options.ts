import { Type } from '../utils/type.interface';
import { IMessageProvider } from '../messages';

export interface ProvidersManagerOptions {
  providers: Type<IMessageProvider>[];

  /**
   * Suppresses logging
   */
  silent?: boolean;
}
