import { ModuleMetadata } from '@nestjs/common';
import { MediatorOptions } from '@nodiator/core';

export interface MediatorModuleOptions extends Omit<MediatorOptions, 'providers' | 'providersInstantiator'> {}

export interface MediatorModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => Promise<MediatorModuleOptions>;
  inject?: any[];
}
