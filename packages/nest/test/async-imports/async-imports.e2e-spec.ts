import { Type } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Mediator } from '@nodiator/core';
import { getMediatorToken } from '../../lib';
import { ClassAppModule } from './mocks/class.app.module';
import { ExistingAppModule } from './mocks/existing.app.module';
import { FactoryAppModule } from './mocks/factory.app.module';

const initMediator = async (module: Type<any>) => {
  const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [module] }).compile();
  const app = await moduleFixture.createNestApplication().init();
  return app.get(getMediatorToken());
};

describe('@nodiator/nest async imports (e2e)', () => {
  let mediator: Mediator;

  describe('use factory', () => {
    beforeEach(async () => {
      mediator = await initMediator(FactoryAppModule);
    });

    it('should have providers defined', () => {
      expect(mediator.providers).toBeDefined();
    });
  });

  describe('use class', () => {
    beforeEach(async () => {
      mediator = await initMediator(ClassAppModule);
    });

    it('should have providers defined', () => {
      expect(mediator.providers).toBeDefined();
    });
  });

  describe('use existing', () => {
    beforeEach(async () => {
      mediator = await initMediator(ExistingAppModule);
    });

    it('should have providers defined', () => {
      expect(mediator.providers).toBeDefined();
    });
  });
});
