import { DynamicModule, Module, Type } from '@nestjs/common';
import { getMediatorToken } from './utils/get-mediator-token.util';
import { MediatorModuleConfigurator } from './mediator.module.configurator';
import { MediatorModuleOptionsValidator } from './mediator.module.options.validator';
import { MediatorForFeatureOptions, MediatorModuleOptions } from './mediator.module.options';
import { NAMESPACE_MEDIATOR } from './constants';

@Module({
  providers: [MediatorModuleConfigurator],
})
export class MediatorModule {
  static forRoot(...configurations: MediatorModuleOptions[]): DynamicModule {
    MediatorModuleOptionsValidator.validate(configurations);

    // If no global mediator defined then create one with default configuration
    if (!configurations.some(({ namespace }) => !namespace)) {
      configurations = [...configurations, {}];
    }

    return {
      global: true,
      module: MediatorModule,
      providers: configurations.map((configuration) => ({
        provide: getMediatorToken(configuration.namespace),
        inject: [MediatorModuleConfigurator],
        useFactory: (optionsFactory: MediatorModuleConfigurator) => optionsFactory.configureRoot(configuration),
      })),
      exports: configurations.map(({ namespace }) => getMediatorToken(namespace)),
    };
  }

  static forFeature(module: Type<any>, options: MediatorForFeatureOptions): DynamicModule {
    return {
      module: MediatorModule,
      providers: [
        {
          provide: NAMESPACE_MEDIATOR,
          inject: [MediatorModuleConfigurator],
          useFactory: (moduleConfigurator: MediatorModuleConfigurator) =>
            moduleConfigurator.configureFeature(module, options),
        },
      ],
    };
  }
}
