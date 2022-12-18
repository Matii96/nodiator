import { ModuleMetadata, Type } from '@nestjs/common';
import { MediatorModuleOptionsFactory } from '../../shared/options/mediator.module.options-factory';
import { MediatorModuleOptionsFactoryFunction } from '../../shared/options/mediator.module.options-factory-function';

export interface MediatorModuleGlobalAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  readonly inject?: any[];
  useFactory?: MediatorModuleOptionsFactoryFunction;
  useClass?: Type<MediatorModuleOptionsFactory>;
  useExisting?: Type<MediatorModuleOptionsFactory>;
}
