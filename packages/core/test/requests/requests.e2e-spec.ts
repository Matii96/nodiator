import { delay, lastValueFrom, of } from 'rxjs';
import {
  Mediator,
  MessageTimeoutException,
  MessageTypes,
  PlainObjectMessageException,
  RequestsProvidersSchema,
  MediatorFactory,
} from '../../lib';
import {
  TestGlobalRequestPipeline,
  TestLaggingRequestPipeline,
  TestRequest,
  TestRequestHandler,
  TestRequestPipeline,
} from './requests.mocks';

describe('@nodiator/core requests (e2e)', () => {
  const providers = [TestGlobalRequestPipeline, TestRequestPipeline, TestRequestHandler];
  let mediator: Mediator;

  beforeEach(() => {
    mediator = MediatorFactory.create({ providers });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('nodiator setup', () => {
    it('should retrieve requests providers schema', () => {
      const schema = mediator.providers.get<RequestsProvidersSchema>(MessageTypes.REQUEST);

      const specific = new Map();
      specific.set(TestRequest, { pipelines: [TestRequestPipeline], handler: TestRequestHandler });
      expect(schema).toEqual({ global: { pipelines: [TestGlobalRequestPipeline] }, specific });
    });
  });

  describe('requests handling', () => {
    const testRequest = new TestRequest('success');

    it('should return "success"', (done) => {
      mediator.request(testRequest).subscribe((response) => {
        expect(response).toBe(testRequest.property);
        done();
      });
    });

    it('should call all providers', (done) => {
      mediator.request(testRequest).subscribe(() => {
        providers.forEach((providerType) => expect(providerType.handle).toHaveBeenCalledTimes(1));
        done();
      });
    });

    it('should not start execution until subscribed', (done) => {
      mediator.request(testRequest);
      of(1)
        .pipe(delay(5))
        .subscribe(() => {
          providers.forEach((providerType) => expect(providerType.handle).not.toHaveBeenCalled());
          done();
        });
    });
  });

  describe('passing plain object', () => {
    it('should reject plain object request', () => {
      expect(() => mediator.request({ property: 'property' })).toThrow(PlainObjectMessageException);
    });
  });

  describe('timeouts handling', () => {
    const testRequest = new TestRequest('success');
    const providers = [TestGlobalRequestPipeline, TestRequestPipeline, TestLaggingRequestPipeline, TestRequestHandler];

    beforeEach(() => {
      mediator = MediatorFactory.create({ providers, dynamicOptions: () => ({ requests: { timeout: 1 } }) });
    });

    it('should throw timeout exception', async () => {
      const task = lastValueFrom(mediator.request(testRequest));
      expect(task).rejects.toThrow(MessageTimeoutException);
      try {
        await task;
      } catch {}

      expect(TestRequestHandler.handle).not.toHaveBeenCalled();
    });

    it('should call all providers excluding the handler', async () => {
      try {
        await lastValueFrom(mediator.request(testRequest));
      } catch {}
      expect(TestGlobalRequestPipeline.handle).toHaveBeenCalledTimes(1);
      expect(TestRequestPipeline.handle).toHaveBeenCalledTimes(1);
      expect(TestLaggingRequestPipeline.handle).toHaveBeenCalledTimes(1);
      expect(TestRequestHandler.handle).not.toHaveBeenCalled();
    });
  });
});
