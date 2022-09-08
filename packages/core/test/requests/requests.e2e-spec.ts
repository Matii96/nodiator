import { delay, lastValueFrom, of } from 'rxjs';
import {
  IMediator,
  IMessageProcessingState,
  MessageTimeoutException,
  MessageTypes,
  PlainObjectMessageException,
  IRequestsProvidersSchema,
  MediatorFactory,
} from '../../lib';
import { IMediatorLogger, MediatorLoggingLevels } from '../../lib/config';
import { MediatorLoggerMock } from '../../lib/logging/logging.mocks';
import {
  TestGlobalRequestPipeline,
  TestLaggingRequestPipeline,
  TestRequest,
  TestRequestHandler,
  TestRequestPipeline,
} from './requests.mocks';
import { handlingSteps, timeoutSteps } from './requests.mocks.results';

describe('@nodiator/core requests (e2e)', () => {
  const providers = [TestGlobalRequestPipeline, TestRequestPipeline, TestRequestHandler];
  let logger: IMediatorLogger;
  let mediator: IMediator;
  let requestStates: IMessageProcessingState[];

  beforeEach(() => {
    logger = new MediatorLoggerMock();
    mediator = MediatorFactory.create({
      providers,
      logger,
      config: () => ({ logs: { level: MediatorLoggingLevels.DEBUG } }),
    });
    requestStates = [];
    mediator.subscribe((state) => requestStates.push(state));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('nodiator setup', () => {
    it('should retrieve requests providers schema', () => {
      const schema = mediator.providers.get<IRequestsProvidersSchema>(MessageTypes.REQUEST);

      const specific = new Map();
      specific.set(TestRequest, { pipelines: [TestRequestPipeline], handler: TestRequestHandler });
      expect(schema).toEqual({ global: { pipelines: [TestGlobalRequestPipeline] }, specific });
    });
  });

  describe('requests handling', () => {
    const testRequest = new TestRequest('success');

    it('should return "success"', (done) => {
      mediator.request<string>(testRequest).subscribe((response) => {
        expect(response).toBe(testRequest.property);
        done();
      });
    });

    it('should call all providers', (done) => {
      mediator.request<string>(testRequest).subscribe(() => {
        providers.forEach((providerType) => expect(providerType.handle).toHaveBeenCalledTimes(1));
        done();
      });
    });

    it('should not start execution until subscribed', (done) => {
      mediator.request<string>(testRequest);
      of(1)
        .pipe(delay(5))
        .subscribe(() => {
          providers.forEach((providerType) => expect(providerType.handle).not.toHaveBeenCalled());
          done();
        });
    });

    it('should emit request handling steps', async () => {
      await lastValueFrom(mediator.request<string>(testRequest));
      expect(requestStates).toEqual(handlingSteps(requestStates[0].id, testRequest));
    });

    it('should log request handling steps', async () => {
      await lastValueFrom(mediator.request<string>(testRequest));
      await new Promise<void>((resolve) => setImmediate(resolve));
      expect(logger.debug).toHaveBeenCalledTimes(10);
      expect(logger.info).toHaveBeenCalledTimes(2);
      expect(logger.warn).toHaveBeenCalledTimes(0);
      expect(logger.error).toHaveBeenCalledTimes(0);
    });
  });

  describe('passing plain object', () => {
    it('should reject plain object request', () => {
      expect(() => mediator.request<string>({ property: 'property' })).toThrow(PlainObjectMessageException);
    });

    it('should not have emitted any request state', async () => {
      try {
        await lastValueFrom(mediator.request<string>({ property: 'property' }));
      } catch {}
      expect(requestStates).toHaveLength(0);
    });
  });

  describe('timeouts handling', () => {
    const testRequest = new TestRequest('success');
    const providers = [TestGlobalRequestPipeline, TestRequestPipeline, TestLaggingRequestPipeline, TestRequestHandler];

    beforeEach(() => {
      mediator = MediatorFactory.create({
        providers,
        logger,
        config: () => ({ requests: { timeout: 1 }, logs: { level: MediatorLoggingLevels.INFO } }),
      });
    });

    it('should throw timeout exception', async () => {
      const task = lastValueFrom(mediator.request<string>(testRequest));
      expect(task).rejects.toThrow(MessageTimeoutException);
      try {
        await task;
      } catch {}

      expect(TestRequestHandler.handle).not.toHaveBeenCalled();
    });

    it('should emit request handling steps', async () => {
      mediator.subscribe((state) => requestStates.push(state));
      try {
        await lastValueFrom(mediator.request<string>(testRequest));
      } catch {}
      expect(requestStates).toEqual(timeoutSteps(requestStates[0]?.id, testRequest));
    });

    it('should call all providers excluding the handler', async () => {
      try {
        await lastValueFrom(mediator.request<string>(testRequest));
      } catch {}
      expect(TestGlobalRequestPipeline.handle).toHaveBeenCalledTimes(1);
      expect(TestRequestPipeline.handle).toHaveBeenCalledTimes(1);
      expect(TestLaggingRequestPipeline.handle).toHaveBeenCalledTimes(1);
      expect(TestRequestHandler.handle).not.toHaveBeenCalled();
    });

    it('should log request handling steps', async () => {
      try {
        await lastValueFrom(mediator.request<string>(testRequest));
      } catch {}
      expect(logger.info).toHaveBeenCalledTimes(2);
      expect(logger.warn).toHaveBeenCalledTimes(0);
      expect(logger.error).toHaveBeenCalledTimes(1);
    });
  });
});
