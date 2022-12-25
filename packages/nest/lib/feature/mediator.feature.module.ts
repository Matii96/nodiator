import { DynamicModule, Provider, FactoryProvider, Type, Module, OnModuleInit, Inject } from '@nestjs/common';
import { Mediator } from '@nodiator/core';
import { getMediatorToken } from '../injection';
import { InternalNestMediatorLogger } from '../mediator.logger';
import { MediatorModuleOptions } from '../shared/options/mediator.module.options';
import { MediatorModuleOptionsFactory } from '../shared/options/mediator.module.options-factory';
import { MediatorModuleAsyncFeatureOptions } from './options/mediator.module.feature-async-options';
import { MediatorFeatureConfigurator } from './configurator/mediator.feature.configurator';
import { MediatorFeatureExplorer } from './explorer/mediator.feature.explorer';
import { MediatorModuleFeatureOptions } from './options/mediator.module.feature-options';
import { InjectionMetadata } from './injection-metadata';
import {
  MEDIATOR_MODULE_FEATURE_INJECTION_METADATA,
  MEDIATOR_MODULE_FEATURE_OPTIONS,
  MEDIATOR_MODULE_FEATURE_INSTANCE,
} from './constants';

@Module({
  providers: [InternalNestMediatorLogger, MediatorFeatureConfigurator, MediatorFeatureExplorer],
})
export class MediatorFeatureModule implements OnModuleInit {
  constructor(
    private readonly _logger: InternalNestMediatorLogger,
    private readonly _moduleConfigurator: MediatorFeatureConfigurator,
    @Inject(MEDIATOR_MODULE_FEATURE_INJECTION_METADATA) private readonly _injectionMetadata: InjectionMetadata
  ) {}

  static forFeature(module: Type, options: MediatorModuleFeatureOptions): DynamicModule {
    const mediatorToken = getMediatorToken(options.namespace ?? module);
    return {
      module: MediatorFeatureModule,
      providers: [
        {
          provide: MEDIATOR_MODULE_FEATURE_INJECTION_METADATA,
          useValue: { module, namespace: options.namespace } satisfies InjectionMetadata,
        },
        {
          provide: MEDIATOR_MODULE_FEATURE_OPTIONS,
          useValue: {
            extensions: options.extensions,
            dynamicOptions: options.dynamicOptions,
          } satisfies MediatorModuleOptions,
        },
        {
          provide: mediatorToken,
          inject: [MediatorFeatureConfigurator],
          useFactory: (moduleConfigurator: MediatorFeatureConfigurator) => moduleConfigurator.configureFeature(module),
        },
        {
          provide: MEDIATOR_MODULE_FEATURE_INSTANCE,
          inject: [mediatorToken],
          useFactory: (mediator: Mediator) => mediator,
        },
      ],
      exports: [MEDIATOR_MODULE_FEATURE_INSTANCE, mediatorToken],
    };
  }

  static forFeatureAsync(module: Type, options: MediatorModuleAsyncFeatureOptions): DynamicModule {
    return {
      module: MediatorFeatureModule,
      imports: options.imports ?? [],
      providers: this.getFeatureAsyncProvider(module, options),
      exports: [MEDIATOR_MODULE_FEATURE_INSTANCE, getMediatorToken(options.namespace ?? module)],
    };
  }

  private static getFeatureAsyncProvider(module: Type, options: MediatorModuleAsyncFeatureOptions): Provider[] {
    const mediatorToken = getMediatorToken(options.namespace ?? module);
    const providers: Provider[] = [
      {
        provide: MEDIATOR_MODULE_FEATURE_INJECTION_METADATA,
        useValue: { module, namespace: options.namespace } satisfies InjectionMetadata,
      },
      {
        provide: mediatorToken,
        inject: [MediatorFeatureConfigurator, ...(options.inject ?? [])],
        useFactory: (moduleConfigurator: MediatorFeatureConfigurator) => moduleConfigurator.configureFeature(module),
      },
      {
        provide: MEDIATOR_MODULE_FEATURE_INSTANCE,
        inject: [mediatorToken],
        useFactory: (mediator: Mediator) => mediator,
      },
    ];

    if (options.useClass || options.useExisting) {
      const mediatorProvider: FactoryProvider = {
        provide: MEDIATOR_MODULE_FEATURE_OPTIONS,
        inject: [options.useClass ?? options.useExisting, ...(options.inject ?? [])],
        useFactory: async (optionsFactory: MediatorModuleOptionsFactory): Promise<MediatorModuleOptions> => ({
          ...(optionsFactory.createMediatorStaticOptions ? await optionsFactory.createMediatorStaticOptions() : {}),
          dynamicOptions: optionsFactory.createMediatorDynamicOptions?.bind(optionsFactory),
        }),
      };
      return [...(options.useClass ? [mediatorProvider, options.useClass] : [mediatorProvider]), ...providers];
    }

    return [
      {
        provide: MEDIATOR_MODULE_FEATURE_OPTIONS,
        inject: options.inject ?? [],
        useFactory: (...providers: any[]) => options.useFactory!(...providers),
      },
      ...providers,
    ];
  }

  onModuleInit() {
    this._moduleConfigurator.initExtensions();
    this.logInitializationInfo();
  }

  private logInitializationInfo() {
    const { module, namespace } = this._injectionMetadata;
    let log = `${module.name} mediator initialized`;
    if (namespace) {
      log += ` with namespace ${String(namespace)}`;
    }
    this._logger.log(log);
  }
}
