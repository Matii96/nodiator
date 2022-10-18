import { Injectable, Scope, Type } from '@nestjs/common';
import { ModuleRef, ModulesContainer } from '@nestjs/core';
import { IMediator, IMessageProvider, MediatorFactory, ScopeOptions, SCOPE_OPTIONS_METADATA } from '@nodiator/core';
import { NamespaceNotInitializedException } from '../exceptions/namespace-not-initialized.exception';
import { getMediatorToken } from '../injection/get-mediator-token.factory';
import { MediatorLogger } from '../logger/mediator.logger';
import { MediatorForFeatureOptions } from '../options/feature.module.options';
import { MediatorModuleOptions } from '../options/root.module.options';

@Injectable()
export class MediatorModuleConfigurator {
  constructor(private readonly _modulesContainer: ModulesContainer, private readonly _moduleRef: ModuleRef) {}

  configureRoot(options: MediatorModuleOptions) {
    const mediator = MediatorFactory.create({
      logger: new MediatorLogger(options.namespace),
      ...options,
      providersInstantiator: (providerType) => this._moduleRef.resolve(providerType, undefined, { strict: false }),
    });
    const registeredProviders = mediator.providers.register({
      providers: options.namespace ? [] : this.listProviders(),
      silent: true,
    });
    this.scopeProviders(registeredProviders);
    return mediator;
  }

  async configureFeature(module: Type<any>, options: MediatorForFeatureOptions) {
    // Let mediator namespaces to register asynchronous
    await new Promise((resolve) => setImmediate(resolve));

    let mediator: IMediator;
    try {
      mediator = this._moduleRef.get(getMediatorToken(options.namespace), { strict: false });
    } catch (err) {
      throw err.constructor.name === 'UnknownElementException'
        ? new NamespaceNotInitializedException(options.namespace)
        : err;
    }
    const registeredProviders = mediator.providers.register({
      providers: this.listProviders(module),
      silent: true,
    });
    this.scopeProviders(registeredProviders);
    return mediator;
  }

  private scopeProviders(providers: Type<IMessageProvider>[]) {
    for (const providerType of providers) {
      const scopeOptions: ScopeOptions = Reflect.getMetadata(SCOPE_OPTIONS_METADATA, providerType);
      Injectable({ scope: scopeOptions?.scoped ? Scope.REQUEST : Scope.DEFAULT })(providerType);
    }
  }

  private listProviders(module?: Type<any>) {
    return Array.from(this._modulesContainer.values())
      .filter(({ metatype }) => !module || metatype === module)
      .flatMap((module) => Array.from(module.providers.values()))
      .map(({ instance }) => instance?.constructor)
      .filter((instance) => instance) as Type<IMessageProvider>[];
  }
}
