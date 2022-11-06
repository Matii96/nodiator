import { ModuleMetadata, Type } from '@nestjs/common';
import { MediatorNestOptions, NamespaceOptions } from './shared.module.options';

export interface IMediatorOptionsFactory {
  createMediatorOptions(): MediatorNestOptions | Promise<MediatorNestOptions>;
}

export type ConfigurationFactory = (...providers: any[]) => MediatorNestOptions | Promise<MediatorNestOptions>;

export interface MediatorModuleAsyncConfiguration extends NamespaceOptions {
  inject?: any[];
  useFactory?: ConfigurationFactory;
  useClass?: Type<IMediatorOptionsFactory>;
  useExisting?: Type<IMediatorOptionsFactory>;
}

export interface MediatorModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  configurations: MediatorModuleAsyncConfiguration[];
}

export interface MediatorModuleSingleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'>,
    MediatorModuleAsyncConfiguration {}
