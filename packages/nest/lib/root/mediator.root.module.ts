import { DynamicModule, Provider, FactoryProvider, Module, Global } from '@nestjs/common';
import { MediatorModuleOptions } from '../shared/options/mediator.module.options';
import { MediatorModuleOptionsFactory } from '../shared/options/mediator.module.options-factory';
import { MediatorModuleGlobalAsyncOptions } from './options/mediator.module.global-async-options';
import { MEDIATOR_MODULE_GLOBAL_OPTIONS } from './constants';

@Global()
@Module({})
export class MediatorRootModule {
  static forRoot(options: MediatorModuleOptions = {}): DynamicModule {
    return {
      module: MediatorRootModule,
      providers: [{ provide: MEDIATOR_MODULE_GLOBAL_OPTIONS, useValue: options }],
      exports: [MEDIATOR_MODULE_GLOBAL_OPTIONS],
    };
  }

  static forRootAsync(options: MediatorModuleGlobalAsyncOptions): DynamicModule {
    return {
      module: MediatorRootModule,
      imports: options.imports ?? [],
      providers: this.getAsyncGlobalOptionsProvider(options),
      exports: [MEDIATOR_MODULE_GLOBAL_OPTIONS],
    };
  }

  private static getAsyncGlobalOptionsProvider(options: MediatorModuleGlobalAsyncOptions): Provider[] {
    if (options.useClass || options.useExisting) {
      const globalOptionsProvider: FactoryProvider = {
        provide: MEDIATOR_MODULE_GLOBAL_OPTIONS,
        inject: [options.useClass ?? options.useExisting, ...(options.inject ?? [])],
        useFactory: async (optionsFactory: MediatorModuleOptionsFactory): Promise<MediatorModuleOptions> => ({
          ...(await optionsFactory.createMediatorStaticOptions()),
          dynamicOptions: optionsFactory.createMediatorDynamicOptions?.bind(optionsFactory),
        }),
      };
      return options.useClass ? [globalOptionsProvider, options.useClass] : [globalOptionsProvider];
    }

    return [
      {
        provide: MEDIATOR_MODULE_GLOBAL_OPTIONS,
        inject: options.inject ?? [],
        useFactory: (...providers: any[]) => options.useFactory!(...providers),
      },
    ];
  }
}
