import { FactoryProvider } from '@nestjs/common';
import { NAMESPACE_MEDIATOR } from './injection/constants';
import { MissingAsyncConfigurationException } from './exceptions/missing-async-configuration.exception';
import { MediatorModule } from './mediator.module';
import { ModuleConfigurator } from './mediator.module.mocks';
import { getMediatorToken } from './injection//get-mediator-token.factory';

describe('MediatorModule', () => {
  const namespace = 'namespace';

  describe('root', () => {
    it('should configure root for default global namespace', () => {
      const module = MediatorModule.forRoot();
      expect(module.providers).toHaveLength(1);
      expect((module.providers[0] as FactoryProvider).provide).toBe(getMediatorToken());
    });

    it('should configure root for single custom namespace', () => {
      const module = MediatorModule.forRoot({ namespace });
      expect(module.providers).toHaveLength(1);
      expect((module.providers[0] as FactoryProvider).provide).toBe(getMediatorToken(namespace));
    });
  });

  describe('root async', () => {
    it('should configure root for default global namespace', async () => {
      const module = await MediatorModule.forRootAsync({ useClass: ModuleConfigurator });
      expect(module.providers).toHaveLength(2); // Mediator + ModuleConfigurator instance
      expect((module.providers[0] as FactoryProvider).provide).toBe(getMediatorToken());
    });

    it('should configure root for multiple custom namespaces', async () => {
      const module = await MediatorModule.forRootAsync({
        configurations: [
          { useFactory: () => ({ config: () => ({}) }) },
          { namespace, useFactory: () => ({ config: () => ({}) }) },
        ],
      });
      expect(module.providers).toHaveLength(2);
      expect((module.providers[0] as FactoryProvider).provide).toBe(getMediatorToken());
      expect((module.providers[1] as FactoryProvider).provide).toBe(getMediatorToken(namespace));
    });

    it('should fail configure root - no factory defined', () => {
      expect(MediatorModule.forRootAsync({})).rejects.toThrow(MissingAsyncConfigurationException);
    });
  });

  describe('feature', () => {
    it('should configure feature', () => {
      const module = MediatorModule.forFeature(class {}, { namespace });
      expect(module.providers).toHaveLength(1);
      expect((module.providers[0] as FactoryProvider).provide).toBe(NAMESPACE_MEDIATOR);
    });
  });
});
