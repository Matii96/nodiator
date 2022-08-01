import { ModuleMetadata, Type } from '@nestjs/common';
import { MediatorOptions } from '@nodiator/core';

export interface MediatorForFeatureOptions {
  /**
   * Allows to define multiple mediators identified by namespace. To inject scoped mediator use `@InjectMediator('namespace')`
   */
  namespace: string;
}

export interface MediatorModuleOptions extends Omit<MediatorOptions, 'providers' | 'providersInstantiator' | 'logger'> {
  /**
   * Allows to define multiple mediators identified by namespace. To inject scoped mediator use
   */
  namespace?: string;
}

export interface MediatorModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => Promise<MediatorModuleOptions[]>;
  inject?: any[];
}
