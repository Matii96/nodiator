import { Injectable, Type } from '@nestjs/common';
import { ModuleRef, ModulesContainer } from '@nestjs/core';
import { Mediator, IMessageProvider, MediatorOptions } from '@nodiator/core';
import { getMediatorToken } from './utils';
import { NamespaceNotInitializedException } from './exceptions/namespace-not-initialized.exception';
import { MediatorForFeatureOptions, MediatorModuleOptions } from './mediator.module.options';
import { MediatorLogger } from './mediator.logger';

@Injectable()
export class MediatorModuleConfigurator {
  constructor(private readonly modulesContainer: ModulesContainer, private readonly moduleRef: ModuleRef) {}

  configureRoot(options: MediatorModuleOptions): MediatorOptions {
    return {
      logger: new MediatorLogger(options.namespace),
      ...options,
      providers: options.namespace ? [] : this.listProviders(),
      providersInstantiator: (providerType) => this.moduleRef.resolve(providerType, undefined, { strict: false }),
    };
  }

  configureFeature(options: MediatorForFeatureOptions) {
    let mediator: Mediator;
    try {
      mediator = this.moduleRef.get(getMediatorToken(options.namespace), { strict: false });
    } catch (err) {
      throw err.constructor.name === 'UnknownElementException'
        ? new NamespaceNotInitializedException(options.namespace)
        : err;
    }
    mediator.providers.register(...this.listProviders(options.module));
  }

  private listProviders(module?: Type<any>) {
    return Array.from(this.modulesContainer.values())
      .filter(({ metatype }) => !module || metatype === module)
      .flatMap((module) => Array.from(module.providers.values()))
      .map(({ instance }) => instance?.constructor)
      .filter((instance) => instance) as Type<IMessageProvider>[];
  }
}
