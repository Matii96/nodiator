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
import { MediatorLoggerMock } from '../common/mocks';
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

  describe('full request execution chain', () => {
    it('should return "success"', async () => {
      const testRequest = new TestRequest('success');

      expect(await mediator.request<string>(testRequest)).toBe(testRequest.property);

      expect(requestStates).toHaveLength(6);
      const id = requestStates[0].id;
      requestStates.slice(0, 3).forEach(({ provider, ...props }, idx) => {
        expect(props).toEqual({ id, messageType: MessageTypes.REQUEST, message: testRequest });
        expect(provider instanceof providers[idx]).toBe(true);
      });
      requestStates.slice(3).forEach(({ provider, ...props }, idx) => {
        expect(props).toEqual({
          id,
          messageType: MessageTypes.REQUEST,
          message: testRequest,
          result: { value: testRequest.property },
        });
        expect(provider instanceof providers.slice().reverse()[idx]).toBe(true);
      });

      providers.forEach((providerType) => expect(providerType.handle).toHaveBeenCalledTimes(1));

      await new Promise<void>((resolve) => setImmediate(resolve));
      expect(logger.debug).toHaveBeenCalledTimes(10);
      expect(logger.info).toHaveBeenCalledTimes(2);
      expect(logger.warn).toHaveBeenCalledTimes(0);
      expect(logger.error).toHaveBeenCalledTimes(0);
    });

    it('should reject plain object request', async () => {
      const task = mediator.request<string>({ property: 'property' });
      expect(task).rejects.toThrow(PlainObjectMessageException);

      try {
        await task;
      } catch {}
      expect(requestStates).toHaveLength(0);
    });

    it('should timeout', async () => {
      const testRequest = new TestRequest('success');
      const providers = [
        TestGlobalRequestPipeline,
        TestRequestPipeline,
        TestLaggingRequestPipeline,
        TestRequestHandler,
      ];
      mediator = new Mediator({ providers, logger, requestsTimeout: 1 });
      mediator.subscribe((state) => requestStates.push(state));

      const task = mediator.request<string>(testRequest);
      expect(task).rejects.toThrow(MessageTimeoutException);

      try {
        await task;
      } catch {}
      const id = requestStates[0]?.id;
      requestStates.slice(0, -1).forEach(({ provider, ...props }, idx) => {
        expect(props).toEqual({ id, messageType: MessageTypes.REQUEST, message: testRequest });
        expect(provider instanceof providers[idx]).toBe(true);
      });
      expect(requestStates[requestStates.length - 1].error).toBeInstanceOf(MessageTimeoutException);

      providers.slice(0, -1).forEach((providerType) => expect(providerType.handle).toHaveBeenCalledTimes(1));
      expect(TestRequestHandler.handle).not.toHaveBeenCalled();

      expect(logger.debug).toHaveBeenCalledTimes(3);
      expect(logger.info).toHaveBeenCalledTimes(1);
      expect(logger.warn).toHaveBeenCalledTimes(0);
      expect(logger.error).toHaveBeenCalledTimes(0);
    });
  });
});
