import { range, mergeMap } from 'rxjs';
import { Test, TestingModule } from '@nestjs/testing';
import { NoHandlerException } from '@nodiator/core';
import { AccessProvider } from '../mocks/access.provider';
import { AppModule } from './mocks/app.module';
import { TestRequest, TestRequestHandler } from '../mocks/messages.mocks';

describe('@nodiator/nest mediator (e2e)', () => {
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
    accessProvider.catsMediator.request<string>(request).subscribe((response) => {
      expect(response).toEqual(request.property);
      done();
    });
  });

  it('should throw NoHandlerException from namespaced mediator as the handler exists only in other namespace', () => {
    expect(() => accessProvider.dogsMediator.request<string>(request)).toThrow(NoHandlerException);
  });

  it('should create 4 separate TestRequestHandler instances', (done) => {
    range(1, 4)
      .pipe(mergeMap(() => accessProvider.globalMediator.request<string>(request)))
      .subscribe({
        complete() {
          expect(TestRequestHandler.instancesCounter).toBe(4);
          done();
        },
      });
  });
});
