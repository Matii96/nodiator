import { Type } from '../utils/type.interface';
import { SCOPE_OPTIONS_METADATA } from '../messages/constants';
import { ScopeOptions } from '../messages/interfaces/scope.options';
import { IMessageProvider } from '../messages/interfaces/message-provider.interface';
import { IProvidersInstantiator } from './interfaces/providers-instantiator.interface';

export class DefaultProvidersInstantiator implements IProvidersInstantiator {
  private readonly registeredSingletons = new Map<Type<IMessageProvider>, IMessageProvider>();

  instantiate<TProvider extends IMessageProvider>(type: Type<TProvider>) {
    const scopeOptions: ScopeOptions = Reflect.getMetadata(SCOPE_OPTIONS_METADATA, type) || {};
    return (scopeOptions.scoped ? this.scoped(type) : this.singleton(type)) as TProvider;
  }

  private scoped<TProvider>(type: Type<TProvider>) {
    return new type();
  }

  private singleton<TProvider>(type: Type<TProvider>) {
    let instance = this.registeredSingletons.get(type);
    if (!instance) {
      instance = this.scoped(type);
      this.registeredSingletons.set(type, instance);
    }
    return instance;
  }
}
