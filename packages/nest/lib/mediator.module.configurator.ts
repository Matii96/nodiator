import { Injectable, Scope, Type } from '@nestjs/common';
import { ModuleRef, ModulesContainer } from '@nestjs/core';
import { Mediator, IMessageProvider, ScopeOptions, SCOPE_OPTIONS_METADATA } from '@nodiator/core';
import { NamespaceNotInitializedException } from './exceptions/namespace-not-initialized.exception';
import { MediatorForFeatureOptions, MediatorModuleOptions } from './mediator.module.options';
import { MediatorLogger } from './mediator.logger';
import { getMediatorToken } from './utils';

@Injectable()
export class MediatorModuleConfigurator {
  constructor(private readonly modulesContainer: ModulesContainer, private readonly moduleRef: ModuleRef) {}

  configureRoot(options: MediatorModuleOptions) {
    const mediator = new Mediator({
      logger: new MediatorLogger(options.namespace),
      ...options,
      providersInstantiator: (providerType) => this.moduleRef.resolve(providerType, undefined, { strict: false }),
    });
    const registeredProviders = mediator.providers.register(...(options.namespace ? [] : this.listProviders()));
    this.scopeProviders(registeredProviders);
    return mediator;
  }

  configureFeature(module: Type<any>, options: MediatorForFeatureOptions) {
    let mediator: Mediator;
    try {
      mediator = this.moduleRef.get(getMediatorToken(options.namespace), { strict: false });
    } catch (err) {
      throw err.constructor.name === 'UnknownElementException'
        ? new NamespaceNotInitializedException(options.namespace)
        : err;
    }
    const registeredProviders = mediator.providers.register(...this.listProviders(module));
    this.scopeProviders(registeredProviders);
    return mediator;
  }

  private scopeProviders(providers: Type<IMessageProvider>[]) {
    for (const providerType of providers) {
      const scopeOptions: ScopeOptions = Reflect.getMetadata(SCOPE_OPTIONS_METADATA, providerType);
      Injectable({ scope: scopeOptions?.scoped ? Scope.REQUEST : Scope.DEFAULT })(providerType);
    }
    return providers;
  }

  private listProviders(module?: Type<any>) {
    return Array.from(this.modulesContainer.values())
      .filter(({ metatype }) => !module || metatype === module)
      .flatMap((module) => Array.from(module.providers.values()))
      .map(({ instance }) => instance?.constructor)
      .filter((instance) => instance) as Type<IMessageProvider>[];
  }
}