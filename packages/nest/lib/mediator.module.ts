import { DynamicModule, Module, Type } from '@nestjs/common';
import { MediatorModuleOptions } from './shared/options/mediator.module.options';
import { MediatorModuleGlobalAsyncOptions } from './root/options/mediator.module.global-async-options';
import { MediatorModuleFeatureOptions } from './feature/options/mediator.module.feature-options';
import { MediatorModuleAsyncFeatureOptions } from './feature/options/mediator.module.feature-async-options';
import { MediatorFeatureModule } from './feature/mediator.feature.module';
import { MediatorRootModule } from './root/mediator.root.module';

@Module({})
export class MediatorModule {
  static forRoot(options: MediatorModuleOptions = {}): DynamicModule {
    return {
      module: MediatorModule,
      imports: [MediatorRootModule.forRoot(options)],
      exports: [MediatorRootModule],
    };
  }

  static forRootAsync(options: MediatorModuleGlobalAsyncOptions) {
    return {
      module: MediatorModule,
      imports: [MediatorRootModule.forRootAsync(options)],
      exports: [MediatorRootModule],
    };
  }

  static forFeature(module: Type, options: MediatorModuleFeatureOptions = {}): DynamicModule {
    return {
      module: MediatorModule,
      imports: [MediatorFeatureModule.forFeature(module, options)],
      exports: [MediatorFeatureModule],
    };
  }

  static forFeatureAsync(module: Type, options: MediatorModuleAsyncFeatureOptions): DynamicModule {
    return {
      module: MediatorModule,
      imports: [MediatorFeatureModule.forFeatureAsync(module, options)],
      exports: [MediatorFeatureModule],
    };
  }
}
