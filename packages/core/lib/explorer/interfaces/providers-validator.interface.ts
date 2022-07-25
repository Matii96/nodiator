import { Type } from '../../utils/type.interface';
import { IMessageProvider } from '../../messages/interfaces/message-provider.interface';

export interface IProvidersValidator {
  validate(providers: Type<IMessageProvider>[]): void;
}
