import {
  IMessageProcessingState,
  Mediator,
  MessageTimeoutException,
  MessageTypes,
  PlainObjectMessageException,
  IRequestsProvidersSchema,
  IRequest,
  IMediatorLogger,
  MediatorLoggingLevels,
} from '../../lib';
import { MediatorLoggerMock } from '../../lib/logging/logging.mocks';
import {
  TestGlobalRequestPipeline,
  TestLaggingRequestPipeline,
  TestRequest,
  TestRequestHandler,
  TestRequestPipeline,
} from './requests.mocks';

describe('@nodiator/core requests (e2e)', () => {
  const providers = [TestGlobalRequestPipeline, TestRequestPipeline, TestRequestHandler];
  let logger: IMediatorLogger;
  let mediator: Mediator;
  let requestStates: IMessageProcessingState[];

  beforeEach(() => {
    providers.forEach((provider) => provider.handle.mockReset());
    jest
      .spyOn(TestGlobalRequestPipeline, 'handle')
      .mockImplementation((request: IRequest, next: () => Promise<void>) => next());
    jest
      .spyOn(TestRequestPipeline, 'handle')
      .mockImplementation((request: TestRequest, next: () => Promise<string>) => next());
    jest.spyOn(TestRequestHandler, 'handle').mockImplementation(async (request: TestRequest) => request.property);

    logger = new MediatorLoggerMock();
    mediator = new Mediator({ providers, logger, loggingLevel: MediatorLoggingLevels.DEBUG });
    requestStates = [];
    mediator.subscribe((state) => requestStates.push(state));
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

    it('should return "success"', async () => {
      expect(await mediator.request<string>(testRequest)).toBe(testRequest.property);
    });

    it('should call all providers', async () => {
      await mediator.request<string>(testRequest);
      providers.forEach((providerType) => expect(providerType.handle).toHaveBeenCalledTimes(1));
    });

    it('should emit request handling steps', async () => {
      await mediator.request<string>(testRequest);
      const id = requestStates[0].id;
      expect(requestStates).toEqual([
        {
          id,
          messageType: MessageTypes.REQUEST,
          message: testRequest,
          provider: new TestGlobalRequestPipeline(),
        },
        {
          id,
          messageType: MessageTypes.REQUEST,
          message: testRequest,
          provider: new TestRequestPipeline(),
        },
        {
          id,
          messageType: MessageTypes.REQUEST,
          message: testRequest,
          provider: new TestRequestHandler(),
        },
        {
          id,
          messageType: MessageTypes.REQUEST,
          message: testRequest,
          provider: new TestRequestHandler(),
          result: { value: testRequest.property },
        },
        {
          id,
          messageType: MessageTypes.REQUEST,
          message: testRequest,
          provider: new TestRequestPipeline(),
          result: { value: testRequest.property },
        },
        {
          id,
          messageType: MessageTypes.REQUEST,
          message: testRequest,
          provider: new TestGlobalRequestPipeline(),
          result: { value: testRequest.property },
        },
      ]);
    });

    it('should log request handling steps', async () => {
      await mediator.request<string>(testRequest);
      await new Promise<void>((resolve) => setImmediate(resolve));
      expect(logger.debug).toHaveBeenCalledTimes(10);
      expect(logger.info).toHaveBeenCalledTimes(2);
      expect(logger.warn).toHaveBeenCalledTimes(0);
      expect(logger.error).toHaveBeenCalledTimes(0);
    });
  });

  describe('passing plain object', () => {
    it('should reject plain object request', async () => {
      const task = mediator.request<string>({ property: 'property' });
      expect(task).rejects.toThrow(PlainObjectMessageException);
    });

    it('should not have emitted any request state', async () => {
      try {
        await mediator.request<string>({ property: 'property' });
      } catch {}
      expect(requestStates).toHaveLength(0);
    });
  });

  describe('handling timeouts', () => {
    const testRequest = new TestRequest('success');
    const providers = [TestGlobalRequestPipeline, TestRequestPipeline, TestLaggingRequestPipeline, TestRequestHandler];

    beforeEach(() => {
      TestLaggingRequestPipeline.handle.mockReset();
      jest
        .spyOn(TestLaggingRequestPipeline, 'handle')
        .mockImplementation((request: TestRequest, next: () => Promise<string>) =>
          new Promise((resolve) => setTimeout(resolve, 500)).then(() => next())
        );
      mediator = new Mediator({ providers, logger, requestsTimeout: 1 });
    });

    it('should throw timeout exception', async () => {
      const task = mediator.request<string>(testRequest);
      expect(mediator.request<string>(testRequest)).rejects.toThrow(MessageTimeoutException);
      try {
        await task;
      } catch {}
    });

    it('should emit request handling steps', async () => {
      mediator.subscribe((state) => requestStates.push(state));
      try {
        await mediator.request<string>(testRequest);
      } catch {}
      const id = requestStates[0]?.id;

      expect(requestStates).toEqual([
        {
          id,
          messageType: 0,
          message: testRequest,
          provider: new TestGlobalRequestPipeline(),
        },
        {
          id,
          messageType: 0,
          message: testRequest,
          provider: new TestRequestPipeline(),
        },
        {
          id,
          messageType: 0,
          message: testRequest,
          provider: new TestLaggingRequestPipeline(),
        },
        {
          id,
          messageType: 0,
          message: testRequest,
          error: new MessageTimeoutException(testRequest),
        },
      ]);
    });

    it('should call all providers excluding the handler', async () => {
      try {
        await mediator.request<string>(testRequest);
      } catch {}

      expect(TestGlobalRequestPipeline.handle).toHaveBeenCalledTimes(1);
      expect(TestRequestPipeline.handle).toHaveBeenCalledTimes(1);
      expect(TestLaggingRequestPipeline.handle).toHaveBeenCalledTimes(1);
      expect(TestRequestHandler.handle).not.toHaveBeenCalled();
    });

    it('should log request handling steps', async () => {
      try {
        await mediator.request<string>(testRequest);
      } catch {}
      expect(logger.debug).toHaveBeenCalledTimes(3);
      expect(logger.info).toHaveBeenCalledTimes(1);
      expect(logger.warn).toHaveBeenCalledTimes(0);
      expect(logger.error).toHaveBeenCalledTimes(0);
    });
  });
});
