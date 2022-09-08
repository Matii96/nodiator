import { MediatorOptions } from '@nodiator/core';

export interface NamespaceOptions {
  /**
   * Allows to define multiple mediators identified by namespace. To inject scoped mediator use `@InjectMediator('namespace')`.
   */
  namespace?: string;
}

export interface MediatorNestOptions extends Omit<MediatorOptions, 'providers' | 'providersInstantiator' | 'logger'> {}
