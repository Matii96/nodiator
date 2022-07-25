import { Type } from '../utils/type.interface';
import { IMessageProvider } from '../messages/interfaces/message-provider.interface';
import { IProvidersValidator } from './interfaces/providers-validator.interface';

export class ProvidersValidatorService implements IProvidersValidator {
  validate(providers: Type<IMessageProvider>[]) {}
}
