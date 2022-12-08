import { ClassConstructor } from '../../utils/class-constructor.interface';
import { SCOPE_OPTIONS_METADATA } from '../../messages/constants';
import { ScopeOptions } from '../../messages/interfaces/scope.options';
import { IMessageProvider } from '../../messages/interfaces/message-provider.interface';

export class DefaultProvidersInstantiator {
  private readonly registeredSingletons = new Map<ClassConstructor<IMessageProvider>, IMessageProvider>();

  instantiate<TProvider extends IMessageProvider>(type: ClassConstructor<TProvider>) {
    const scopeOptions: ScopeOptions = Reflect.getMetadata(SCOPE_OPTIONS_METADATA, type) || {};
    return (scopeOptions.scoped ? this.scoped(type) : this.singleton(type)) as TProvider;
  }

  private scoped<TProvider extends IMessageProvider>(type: ClassConstructor<TProvider>) {
    return new type();
  }

  private singleton<TProvider extends IMessageProvider>(type: ClassConstructor<TProvider>) {
    let instance = this.registeredSingletons.get(type);
    if (!instance) {
      instance = this.scoped(type);
      this.registeredSingletons.set(type, instance);
    }
    return instance;
  }
}