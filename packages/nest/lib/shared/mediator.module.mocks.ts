import { Injectable } from '@nestjs/common';
import { MediatorModuleOptionsFactory } from './options';

@Injectable()
export class ModuleConfiguratorMock implements MediatorModuleOptionsFactory {
  createMediatorStaticOptions() {
    return {};
  }

  createMediatorDynamicOptions() {
    return {};
  }
}
