import { Injectable } from '@nestjs/common';
import { MediatorModuleOptionsFactory } from './options';

@Injectable()
export class ModuleConfigurator implements MediatorModuleOptionsFactory {
  createMediatorStaticOptions() {
    return {};
  }

  createMediatorDynamicOptions() {
    return {};
  }
}
