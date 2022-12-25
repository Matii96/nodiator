import { Type } from '@nestjs/common';
import { MediatorModuleInitOptions } from './options';

export interface InjectionMetadata {
  module: Type;
  namespace: MediatorModuleInitOptions['namespace'];
}
