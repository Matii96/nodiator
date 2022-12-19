import { MediatorDynamicOptions } from '@nodiator/core';
import { MediatorModuleStaticOptions } from './mediator.module.static-options';

export interface MediatorModuleOptionsFactory {
  createMediatorStaticOptions(): MediatorModuleStaticOptions | Promise<MediatorModuleStaticOptions>;
  createMediatorDynamicOptions(): MediatorDynamicOptions;
}
