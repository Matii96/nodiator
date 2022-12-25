import { FactoryProvider, Logger, OnModuleInit } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { InternalNestMediatorLogger } from '../mediator.logger';
import { ModuleConfiguratorMock, StaticModuleConfiguratorMock } from '../shared/mediator.module.mocks';
import { MediatorFeatureConfigurator } from './configurator/mediator.feature.configurator';
import { MediatorFeatureConfiguratorMock } from './configurator/mediator.feature.configurator.mock';
import { MediatorFeatureModule } from './mediator.feature.module';
import { InjectionMetadata } from './injection-metadata';
import {
  MEDIATOR_MODULE_FEATURE_INJECTION_METADATA,
  MEDIATOR_MODULE_FEATURE_INSTANCE,
  MEDIATOR_MODULE_FEATURE_OPTIONS,
} from './constants';

describe('MediatorFeatureModule', () => {
  describe('feature sync', () => {
    it('should configure feature options', () => {
      const module = MediatorFeatureModule.forFeature(class {}, {});
      expect(
        module.providers!.map((provider: FactoryProvider) => provider.provide).includes(MEDIATOR_MODULE_FEATURE_OPTIONS)
      ).toBe(true);
    });

    it('should configure feature mediator instance', () => {
      const module = MediatorFeatureModule.forFeature(class {}, {});
      expect(
        module
          .providers!.map((provider: FactoryProvider) => provider.provide)
          .includes(MEDIATOR_MODULE_FEATURE_INSTANCE)
      ).toBe(true);
    });
  });

  describe('feature async', () => {
    it('should configure feature static options', () => {
      const module = MediatorFeatureModule.forFeatureAsync(class {}, { useClass: StaticModuleConfiguratorMock });
      expect(
        module.providers!.map((provider: FactoryProvider) => provider.provide).includes(MEDIATOR_MODULE_FEATURE_OPTIONS)
      ).toBe(true);
    });

    it('should configure all feature options', () => {
      const module = MediatorFeatureModule.forFeatureAsync(class {}, { useClass: ModuleConfiguratorMock });
      expect(
        module.providers!.map((provider: FactoryProvider) => provider.provide).includes(MEDIATOR_MODULE_FEATURE_OPTIONS)
      ).toBe(true);
    });

    it('should configure feature mediator instance', () => {
      const module = MediatorFeatureModule.forFeatureAsync(class {}, { useClass: ModuleConfiguratorMock });
      expect(
        module
          .providers!.map((provider: FactoryProvider) => provider.provide)
          .includes(MEDIATOR_MODULE_FEATURE_INSTANCE)
      ).toBe(true);
    });

    it('should configure feature using factory function', () => {
      const module = MediatorFeatureModule.forFeatureAsync(class {}, { useFactory: () => ({}) });
      expect(module.providers!.length).toBeGreaterThan(0);
    });
  });

  describe('initialization', () => {
    let logger: Logger;
    let feature: OnModuleInit;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          MediatorFeatureModule,
          { provide: InternalNestMediatorLogger, useValue: { log: jest.fn() } },
          { provide: MediatorFeatureConfigurator, useClass: MediatorFeatureConfiguratorMock },
          {
            provide: MEDIATOR_MODULE_FEATURE_INJECTION_METADATA,
            useValue: { module: class {}, namespace: 'custom-namespace' } as InjectionMetadata,
          },
        ],
      }).compile();

      logger = module.get(InternalNestMediatorLogger);
      feature = module.get(MediatorFeatureModule);
    });

    it('should log initialization info', () => {
      feature.onModuleInit();
      expect(logger.log).toHaveBeenCalledTimes(1);
    });
  });
});
