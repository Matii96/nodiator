import { lastValueFrom } from 'rxjs';
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
    request = new TestRequest('success');
    accessProvider = app.get(AccessProvider);
  });

  it('should respond with "success" from global mediator', (done) => {
    accessProvider.globalMediator.request<string>(request).subscribe((response) => {
      expect(response).toEqual(request.property);
      done();
    });
  });

  it('should respond with "success" from namespaced mediator', (done) => {
    accessProvider.namespace1Mediator.request<string>(request).subscribe((response) => {
      expect(response).toEqual(request.property);
      done();
    });
  });

  it('should throw NoHandlerException from namespaced mediator as the handler exists only in other namespace', () => {
    expect(() => accessProvider.namespace2Mediator.request<string>(request)).toThrow(NoHandlerException);
  });

  it('should create 4 separate TestRequestHandler instances', async () => {
    for (let i = 0; i < 4; i++) {
      await lastValueFrom(accessProvider.globalMediator.request<string>(request));
    }
    expect(TestRequestHandler.instancesCounter).toBe(4);
  });
});
