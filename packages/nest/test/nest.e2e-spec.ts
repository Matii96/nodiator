import { Test, TestingModule } from '@nestjs/testing';
import { lastValueFrom } from 'rxjs';
import { AccessProvider } from './mocks/access.provider';
import { AppModuleMock } from './mocks/app.module.mock';
import { GetParrotNameRequest } from './mocks/birds/parrots/get-cat-name-request/get-parrot-name.request';
import { GetCatNameRequest } from './mocks/cats/get-cat-name-request/get-cat-name.request';
import { GetDogNameRequest } from './mocks/dogs/get-dog-name-request/get-dog-name.request';

describe('@nodiator/nest (e2e)', () => {
  let accessProvider: AccessProvider;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModuleMock] }).compile();
    const app = await moduleFixture.createNestApplication().init();
    accessProvider = app.get(AccessProvider);
  });

  describe('basic setup', () => {
    it("should respond with cat's name", async () => {
      const name = 'Jerry';
      expect(await lastValueFrom(accessProvider.catsMediator.request(new GetCatNameRequest(name)))).toEqual(name);
    });
  });

  describe('advanced setup', () => {
    it("should respond with dog's name", async () => {
      const name = 'Lucky';
      expect(await lastValueFrom(accessProvider.dogsMediator.request(new GetDogNameRequest(name)))).toEqual(name);
    });
  });

  describe('nested setup', () => {
    it("should respond with parrot's name", async () => {
      const name = 'Polly';
      expect(await lastValueFrom(accessProvider.birdsMediator.request(new GetParrotNameRequest(name)))).toEqual(name);
    });
  });
});
