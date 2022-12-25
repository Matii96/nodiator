import { Injectable } from '@nestjs/common';
import { MediatorModuleOptionsFactory } from './options';

@Injectable()
export class StaticModuleConfiguratorMock implements MediatorModuleOptionsFactory {
  createMediatorStaticOptions() {
    return {};
  }
}

@Injectable()
export class ModuleConfiguratorMock extends StaticModuleConfiguratorMock implements MediatorModuleOptionsFactory {
  createMediatorDynamicOptions() {
    return {};
  }
}
