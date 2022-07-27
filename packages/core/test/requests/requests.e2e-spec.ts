import {
  IMessageProcessingState,
  Mediator,
  MessageTimeoutException,
  MessageTypes,
  PlainObjectMessageException,
  IRequestsProvidersSchema,
  IRequest,
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

    mediator = new Mediator({ providers });
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

      const id = requestStates[0]?.id;
      requestStates.forEach(({ provider, ...props }, idx) => {
        expect(props).toEqual({ id, type: MessageTypes.REQUEST, data: testRequest });
        expect(provider instanceof providers[idx]).toBe(true);
      });

      providers.forEach((providerType) => expect(providerType.handle).toHaveBeenCalledTimes(1));
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
      mediator = new Mediator({ providers, requestsTimeout: 1 });
      mediator.subscribe((state) => requestStates.push(state));

      const task = mediator.request<string>(testRequest);
      expect(task).rejects.toThrow(MessageTimeoutException);

      try {
        await task;
      } catch {}
      const id = requestStates[0]?.id;
      requestStates.slice(0, -1).forEach(({ provider, ...props }, idx) => {
        expect(props).toEqual({ id, type: MessageTypes.REQUEST, data: testRequest });
        expect(provider instanceof providers[idx]).toBe(true);
      });
      expect(requestStates[requestStates.length - 1].error).toBeInstanceOf(MessageTimeoutException);

      expect(TestGlobalRequestPipeline.handle).toHaveBeenCalledTimes(1);
      expect(TestRequestPipeline.handle).toHaveBeenCalledTimes(1);
      expect(TestLaggingRequestPipeline.handle).toHaveBeenCalledTimes(1);
      expect(TestRequestHandler.handle).not.toHaveBeenCalled();
    });
  });
});
