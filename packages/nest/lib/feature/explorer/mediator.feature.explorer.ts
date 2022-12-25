import { MessageProvider } from '@nodiator/core';
import { Injectable, Type } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { Module } from '@nestjs/core/injector/module';

@Injectable()
export class MediatorFeatureExplorer {
  constructor(private readonly _modulesContainer: ModulesContainer) {}

  exploreProviders(moduleType: Type): Type<MessageProvider>[] {
    const module = Array.from(this._modulesContainer.values()).find(({ metatype }) => metatype === moduleType)!;
    const moduleProviders = Array.from(module.providers.values())
      .map(({ instance }) => instance?.constructor as Type<MessageProvider>)
      .filter((instance) => instance);

    const submodulesProviders = Array.from(module.imports).flatMap((module) => this.exploreSubmoduleProviders(module));
    return [...moduleProviders, ...submodulesProviders];
  }

  private exploreSubmoduleProviders(module: Module): Type<MessageProvider>[] {
    const modules = Array.from(this._modulesContainer.values());

    return Array.from(module.exports).flatMap((moduleExport) => {
      const isModule = typeof moduleExport === 'object' && Boolean(Reflect.getMetadata('exports', moduleExport));
      if (isModule) {
        const module = modules.find(({ metatype }) => metatype === moduleExport)!;
        return this.exploreSubmoduleProviders(module);
      }

      const provider = module.providers.get(moduleExport)?.instance?.constructor as Type<MessageProvider>;
      return provider ? [provider] : [];
    });
  }
}
