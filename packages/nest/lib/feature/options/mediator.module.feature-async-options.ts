import { MediatorModuleGlobalAsyncOptions } from '../../root/options/mediator.module.global-async-options';
import { MediatorModuleInitOptions } from './mediator.module.init-options';

export interface MediatorModuleAsyncFeatureOptions
  extends MediatorModuleInitOptions,
    MediatorModuleGlobalAsyncOptions {}
