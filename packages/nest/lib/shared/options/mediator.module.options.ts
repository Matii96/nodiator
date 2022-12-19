import { MediatorOptions } from '@nodiator/core';
import { MediatorModuleStaticOptions } from './mediator.module.static-options';

export interface MediatorModuleOptions extends MediatorModuleStaticOptions, Pick<MediatorOptions, 'dynamicOptions'> {}
