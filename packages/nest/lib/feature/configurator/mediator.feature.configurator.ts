import { Injectable, Scope, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Mediator, MediatorFactory, MessageProvider, ScopeOptions, SCOPE_OPTIONS_METADATA } from '@nodiator/core';
import { overrideObject } from '../../utils/override-object';
import { MediatorModuleOptions } from '../../shared/options/mediator.module.options';
import { MEDIATOR_MODULE_GLOBAL_OPTIONS } from '../../root/constants';
import { InternalNestMediatorLogger } from '../../mediator.logger';
import { MEDIATOR_MODULE_FEATURE_INSTANCE, MEDIATOR_MODULE_FEATURE_OPTIONS } from '../constants';
import { MediatorFeatureExplorer } from '../explorer/mediator.feature.explorer';
import { MediatorModuleInitOptions } from '../options';

@Injectable()
export class MediatorFeatureConfigurator {
  constructor(
    private readonly _moduleRef: ModuleRef,
    private readonly _logger: InternalNestMediatorLogger,
    private readonly _featureExplorer: MediatorFeatureExplorer
  ) {}

  configureFeature(module: Type, namespace: MediatorModuleInitOptions['namespace']) {
    const mediator = MediatorFactory.create({
      dynamicOptions: () => this.getDynamicOptions(),
      providersInstantiator: (providerType) => this._moduleRef.resolve(providerType, undefined, { strict: false }),
    });

    const registeredProviders = mediator.providers.register(...this._featureExplorer.exploreProviders(module));
    this.scopeProviders(registeredProviders);

    this.logInitializationInfo(module, namespace);
    return mediator;
  }

  initExtensions() {
    const mediator = this._moduleRef.get<Mediator>(MEDIATOR_MODULE_FEATURE_INSTANCE);
    const globalExtensions =
      this._moduleRef.get<MediatorModuleOptions>(MEDIATOR_MODULE_GLOBAL_OPTIONS, { strict: false }).extensions ?? [];
    const featureExtensions =
      this._moduleRef.get<MediatorModuleOptions>(MEDIATOR_MODULE_FEATURE_OPTIONS).extensions ?? [];
    mediator.use(...globalExtensions, ...featureExtensions);
  }

  private getDynamicOptions() {
    const globalDynamicOptions = this._moduleRef.get<MediatorModuleOptions>(MEDIATOR_MODULE_GLOBAL_OPTIONS, {
      strict: false,
    }).dynamicOptions;
    const featureDynamicOptions = this._moduleRef.get<MediatorModuleOptions>(
      MEDIATOR_MODULE_FEATURE_OPTIONS
    ).dynamicOptions;

    return overrideObject(
      globalDynamicOptions ? globalDynamicOptions() : {},
      featureDynamicOptions ? featureDynamicOptions() : {}
    );
  }

  private scopeProviders(providers: Type<MessageProvider>[]) {
    for (const providerType of providers) {
      const scopeOptions: ScopeOptions = Reflect.getMetadata(SCOPE_OPTIONS_METADATA, providerType);
      Injectable({ scope: scopeOptions?.scoped ? Scope.REQUEST : Scope.DEFAULT })(providerType);
    }
  }

  private logInitializationInfo(module: Type, namespace: MediatorModuleInitOptions['namespace']) {
    let log = `${module.name} mediator initialized`;
    if (namespace) {
      log += ` with namespace ${String(namespace)}`;
    }
    this._logger.log(log);
  }
}
