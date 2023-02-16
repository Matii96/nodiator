import { Injectable, Type } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Module } from '@nestjs/core/injector/module';
import { MessageProvider } from '@nodiator/core';

@Injectable()
export class MediatorFeatureExplorer {
  constructor(private readonly _modulesContainer: ModulesContainer) {}

  exploreProviders(moduleType: Type): Type<MessageProvider>[] {
    const module = Array.from(this._modulesContainer.values()).find(({ metatype }) => metatype === moduleType)!;
    const moduleProviders = Array.from(module.providers.values())
      .map((wrapper) => this.getInstanceProvider(wrapper))
      .filter((provider) => provider);

    const submodulesProviders = Array.from(module.imports).flatMap((module) => this.exploreSubmoduleProviders(module));
    return [...submodulesProviders, ...moduleProviders];
  }

  private exploreSubmoduleProviders(module: Module): Type<MessageProvider>[] {
    const modules = Array.from(this._modulesContainer.values());

    return Array.from(module.exports).flatMap((moduleExport) => {
      const isModule = typeof moduleExport === 'object' && Boolean(Reflect.getMetadata('exports', moduleExport));
      if (isModule) {
        const module = modules.find(({ metatype }) => metatype === moduleExport)!;
        return this.exploreSubmoduleProviders(module);
      }

      const moduleProvider = module.providers.get(moduleExport);
      const provider = moduleProvider && this.getInstanceProvider(moduleProvider);
      return provider ? [provider] : [];
    });
  }

  private getInstanceProvider(wrapper: InstanceWrapper): Type<MessageProvider> {
    return typeof wrapper.token === 'function' ? wrapper.token : wrapper?.instance?.constructor;
  }
}
