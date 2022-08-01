import { DynamicModule, Inject, Module, OnModuleInit } from '@nestjs/common';
import { Mediator } from '@nodiator/core';
import { getMediatorToken } from './utils/get-mediator-token.util';
import { MediatorModuleConfigurator } from './mediator.module.configurator';
import { MediatorModuleOptionsValidator } from './mediator.module.options.validator';
import {
  MediatorForFeatureOptions,
  MediatorModuleAsyncOptions,
  MediatorModuleOptions,
} from './mediator.module.options';
import { FEATURE_MODULE_OPTIONS } from './constants';

@Module({
  providers: [MediatorModuleConfigurator],
})
export class MediatorModule implements OnModuleInit {
  constructor(
    @Inject(FEATURE_MODULE_OPTIONS) private readonly featureOptions: MediatorForFeatureOptions,
    private readonly moduleConfigurator: MediatorModuleConfigurator
  ) {}

  static forRoot(...configurations: MediatorModuleOptions[]): DynamicModule {
    configurations = configurations.length > 0 ? configurations : [{}];
    MediatorModuleOptionsValidator.validate(configurations);
    return {
      global: true,
      module: MediatorModule,
      providers: [
        { provide: FEATURE_MODULE_OPTIONS, useValue: null },
        ...configurations.map((configuration) => ({
          provide: getMediatorToken(configuration.namespace),
          inject: [MediatorModuleConfigurator],
          useFactory: (optionsFactory: MediatorModuleConfigurator) =>
            new Mediator(optionsFactory.configureRoot(configuration)),
        })),
      ],
      exports: configurations.map(({ namespace }) => getMediatorToken(namespace)),
    };
  }

  static forFeature(options: MediatorForFeatureOptions): DynamicModule {
    return {
      module: MediatorModule,
      providers: [{ provide: FEATURE_MODULE_OPTIONS, useValue: options }],
    };
  }

  // static forRootAsync(options: MediatorModuleAsyncOptions): DynamicModule {
  //   return {
  //     global: true,
  //     module: MediatorModule,
  //     imports: options.imports,
  //     providers: [
  //       {
  //         provide: MEDIATOR_MODULE_OPTIONS,
  //         inject: options.inject || [],
  //         useFactory: async (...args: any[]) => this.fillDefaultValues(await options.useFactory(...args)),
  //       },
  //     ]
  //   };
  // }

  onModuleInit() {
    if (this.featureOptions) {
      this.moduleConfigurator.configureFeature(this.featureOptions);
    }
  }
}
