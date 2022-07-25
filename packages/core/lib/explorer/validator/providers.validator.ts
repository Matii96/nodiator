import { Type } from '../../utils/type.interface';
import { IMessageProvider } from '../../messages/interfaces/message-provider.interface';
import { IProvidersValidator } from './providers.validator.interface';

export class ProvidersValidator implements IProvidersValidator {
  validate(provider: Type<IMessageProvider>) {
    const providerBody = provider.toString();
    return true;
  }
}
