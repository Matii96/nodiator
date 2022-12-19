import { FactoryProvider } from '@nestjs/common';
import { ModuleConfigurator } from '../shared/mediator.module.mocks';
import { MEDIATOR_MODULE_GLOBAL_OPTIONS } from './constants';
import { MediatorRootModule } from './mediator.root.module';

describe('MediatorRootModule', () => {
  describe('root sync', () => {
    it('should configure root options', () => {
      const module = MediatorRootModule.forRoot();
      expect(module.providers).toHaveLength(1);
      expect(
        module.providers!.map((provider: FactoryProvider) => provider.provide).includes(MEDIATOR_MODULE_GLOBAL_OPTIONS)
      ).toBe(true);
    });
  });

  describe('root async', () => {
    it('should configure root options', () => {
      const module = MediatorRootModule.forRootAsync({ useClass: ModuleConfigurator });
      expect(module.providers).toHaveLength(2); // Mediator + ModuleConfigurator instance
      expect(
        module.providers!.map((provider: FactoryProvider) => provider.provide).includes(MEDIATOR_MODULE_GLOBAL_OPTIONS)
      ).toBe(true);
    });

    it('should configure root using factory function', () => {
      const module = MediatorRootModule.forRootAsync({ useFactory: () => ({}) });
      expect(module.providers!.length).toBeGreaterThan(0);
    });
  });
});
