import { MediatorModuleOptions } from './mediator.module.options';

export type MediatorModuleOptionsFactoryFunction = (
  ...providers: any[]
) => MediatorModuleOptions | Promise<MediatorModuleOptions>;
