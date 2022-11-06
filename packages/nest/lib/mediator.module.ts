import { DynamicModule, Module, Type, Provider, FactoryProvider } from '@nestjs/common';
import { MissingAsyncConfigurationException } from './exceptions/missing-async-configuration.exception';
import { MediatorModuleConfigurator } from './configurator/mediator.module.configurator';
import { MediatorModuleOptionsValidator } from './options/module.options.validator';
import {
  ConfigurationFactory,
  IMediatorOptionsFactory,
  MediatorModuleAsyncConfiguration,
  MediatorModuleAsyncOptions,
  MediatorModuleSingleAsyncOptions,
} from './options/root-async.module.options';
import { MediatorForFeatureOptions } from './options/feature.module.options';
import { MediatorModuleOptions } from './options/root.module.options';
import { getMediatorToken } from './injection/get-mediator-token.factory';
import { NAMESPACE_MEDIATOR } from './injection/constants';

@Module({
  providers: [MediatorModuleConfigurator],
})
export class MediatorModule {
  static forRoot(...configurations: MediatorModuleOptions[]): DynamicModule {
    MediatorModuleOptionsValidator.validate(configurations);

    if (configurations.length === 0) {
      configurations = [{}];
    }

    const providers = configurations.map<FactoryProvider>((configuration) => ({
      provide: getMediatorToken(configuration.namespace),
      inject: [MediatorModuleConfigurator],
      useFactory: (optionsFactory: MediatorModuleConfigurator) => optionsFactory.configureRoot(configuration),
    }));
    return { global: true, module: MediatorModule, providers, exports: providers.map(({ provide }) => provide) };
  }

  static async forRootAsync(options: MediatorModuleAsyncOptions): Promise<DynamicModule>;
  static async forRootAsync(options: MediatorModuleSingleAsyncOptions): Promise<DynamicModule>;
  static async forRootAsync(options: MediatorModuleAsyncOptions | MediatorModuleSingleAsyncOptions) {
    const asyncConfigurations: MediatorModuleAsyncConfiguration[] = (options as MediatorModuleAsyncOptions)
      ?.configurations || [options as MediatorModuleSingleAsyncOptions];
    MediatorModuleOptionsValidator.validate(asyncConfigurations);

    const providers = asyncConfigurations.flatMap((configuration) => this.getRootAsyncProviders(configuration));
    return {
      global: true,
      module: MediatorModule,
      imports: options.imports || [],
      providers,
      exports: asyncConfigurations.map(({ namespace }) => getMediatorToken(namespace)),
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

  private static getRootAsyncProviders(configuration: MediatorModuleAsyncConfiguration): Provider[] {
    const provide = getMediatorToken(configuration.namespace);

    if (configuration.useFactory) {
      return [
        {
          provide,
          inject: [MediatorModuleConfigurator, ...(configuration.inject || [])],
          async useFactory(configurator: MediatorModuleConfigurator, ...providers: any[]) {
            const loadedOptions = await (configuration.useFactory as ConfigurationFactory)(...providers);
            return configurator.configureRoot({ namespace: configuration.namespace, ...loadedOptions });
          },
        },
      ];
    }

    if (configuration.useClass || configuration.useExisting) {
      const mediatorProvider: FactoryProvider = {
        provide,
        inject: [
          MediatorModuleConfigurator,
          configuration.useClass ?? configuration.useExisting,
          ...(configuration.inject || []),
        ],
        async useFactory(configurator: MediatorModuleConfigurator, optionsFactory: IMediatorOptionsFactory) {
          const loadedOptions = await optionsFactory.createMediatorOptions();
          return configurator.configureRoot({ namespace: configuration.namespace, ...loadedOptions });
        },
      };
      return configuration.useExisting
        ? [mediatorProvider]
        : [mediatorProvider, configuration.useClass as Type<IMediatorOptionsFactory>];
    }

    throw new MissingAsyncConfigurationException();
  }
}
