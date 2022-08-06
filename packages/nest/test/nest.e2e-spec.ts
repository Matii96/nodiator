import { Test, TestingModule } from '@nestjs/testing';
import { NoHandlerException } from '@nodiator/core';
import { AccessProvider } from './mocks/access.provider';
import { AppModule } from './mocks/app.module';
import { TestRequest, TestRequestHandler } from './mocks/messages.mocks';

describe('@nodiator/nest (e2e)', () => {
  let request: TestRequest;
  let accessProvider: AccessProvider;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    const app = await moduleFixture.createNestApplication().init();

    TestRequestHandler.instancesCounter = 0;
    accessProvider = app.get(AccessProvider);
    request = new TestRequest('success');
  });

  it('should respond with "success" from global mediator', async () => {
    expect(await accessProvider.globalMediator.request<string>(request)).toEqual(request.property);
  });

  it('should respond with "success" from namespaced mediator', async () => {
    expect(await accessProvider.namespace1Mediator.request<string>(request)).toEqual(request.property);
  });

  it('should throw NoHandlerException from namespaced mediator as the handler exists only in other namespace', () => {
    expect(accessProvider.namespace2Mediator.request<string>(request)).rejects.toThrow(NoHandlerException);
  });

  it('should create 4 separate TestRequestHandler instances', async () => {
    for (let i = 0; i < 4; i++) {
      await accessProvider.globalMediator.request<string>(request);
    }
    expect(TestRequestHandler.instancesCounter).toBe(4);
  });
});
