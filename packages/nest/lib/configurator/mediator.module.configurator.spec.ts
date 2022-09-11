import { Scope, ScopeOptions } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { SCOPE_OPTIONS_METADATA } from '@nestjs/common/constants';
import { getMediatorToken } from '../utils/get-mediator-token.util';
import { IRequestsProvidersSchema, MediatorFactory, MediatorLoggingLevels, MessageTypes } from '@nodiator/core';
import { MediatorModuleConfigurator } from './mediator.module.configurator';
import { TestRequest, TestRequestHandler } from '../mediator.module.mocks';
import { NamespaceNotInitializedException } from '../exceptions/namespace-not-initialized.exception';

describe('MediatorModuleConfigurator', () => {
  let configurator: MediatorModuleConfigurator;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [MediatorModuleConfigurator, TestRequestHandler],
    }).compile();

    configurator = module.get(MediatorModuleConfigurator);
  });

  describe('configure root', () => {
    it('should create mediator instance with nest providers', () => {
      const mediator = configurator.configureRoot({});
      const providers: IRequestsProvidersSchema = mediator.providers.get(MessageTypes.REQUEST);
      expect(providers.specific.get(TestRequest).handler).toBe(TestRequestHandler);
    });

    it('should adapt providers to nest DI', () => {
      configurator.configureRoot({});
      const scopeOptions: ScopeOptions = Reflect.getMetadata(SCOPE_OPTIONS_METADATA, TestRequestHandler);
      expect(scopeOptions.scope).toBe(Scope.REQUEST);
    });
  });

  describe('configure feature', () => {
    it('should get scoped mediator and register module providers', async () => {
      const namespace = 'A';
      const providers = new Map(Object.entries({ [TestRequestHandler.name]: { instance: new TestRequestHandler() } }));
      const modules = new Map(Object.entries({ 'module-id': { metatype: TestingModule, providers } }));
      const module = await Test.createTestingModule({
        providers: [
          MediatorModuleConfigurator,
          TestRequestHandler,
          { provide: ModulesContainer, useValue: modules },
          {
            provide: getMediatorToken(namespace),
            useValue: MediatorFactory.create({ config: () => ({ logs: { level: MediatorLoggingLevels.NONE } }) }),
          },
        ],
      }).compile();
      configurator = module.get(MediatorModuleConfigurator);

      const mediator = await configurator.configureFeature(TestingModule, { namespace });
      const mediatrorProviders: IRequestsProvidersSchema = mediator.providers.get(MessageTypes.REQUEST);
      expect(mediatrorProviders.specific.get(TestRequest).handler).toBe(TestRequestHandler);
    });

    it("should fail to get scoped mediator as it isn't initialized", () => {
      expect(configurator.configureFeature(TestingModule, { namespace: 'A' })).rejects.toThrow(
        NamespaceNotInitializedException
      );
    });
  });
});
