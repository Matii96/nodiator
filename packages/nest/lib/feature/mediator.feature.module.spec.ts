import { FactoryProvider } from '@nestjs/common';
import { ModuleConfigurator } from '../shared/mediator.module.mocks';
import { MEDIATOR_MODULE_FEATURE_INSTANCE, MEDIATOR_MODULE_FEATURE_OPTIONS } from './constants';
import { MediatorFeatureModule } from './mediator.feature.module';

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
    it('should configure feature options', () => {
      const module = MediatorFeatureModule.forFeatureAsync(class {}, { useClass: ModuleConfigurator });
      expect(
        module.providers!.map((provider: FactoryProvider) => provider.provide).includes(MEDIATOR_MODULE_FEATURE_OPTIONS)
      ).toBe(true);
    });

    it('should configure feature mediator instance', () => {
      const module = MediatorFeatureModule.forFeatureAsync(class {}, { useClass: ModuleConfigurator });
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
});
