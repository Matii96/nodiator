import {
  IMessageProcessingState,
  Mediator,
  MessageTimeoutException,
  MessageTypes,
  PlainObjectMessageException,
  IRequestsProvidersSchema,
} from '../../lib';
import {
  TestGlobalRequestPipeline,
  TestLaggingPipeline,
  TestRequest,
  TestRequestHandler,
  TestRequestPipeline,
} from './requests.mocks';

describe('@nodiator/core requests (e2e)', () => {
  let mediator: Mediator;
  let requestStates: IMessageProcessingState[];

  beforeEach(() => {
    mediator = new Mediator({
      providers: [TestGlobalRequestPipeline, TestRequestPipeline, TestRequestHandler],
    });
    requestStates = [];
    mediator.subscribe((state) => requestStates.push(state));
  });

  describe('nodiator setup', () => {
    it('should manually register handler and execute it', async () => {
      const mediator = new Mediator();
      mediator.providers.register(TestRequestHandler);

      const testRequest = new TestRequest('success');
      expect(await mediator.request<string>(testRequest)).toBe(testRequest.property);
    });

    it('should retrieve requests providers schema', () => {
      const schema = mediator.providers.get<IRequestsProvidersSchema>(MessageTypes.REQUEST);
      const specific = new Map();
      specific.set(TestRequest, { pipelines: [TestRequestPipeline], handler: TestRequestHandler });

      expect(schema).toEqual({ global: { pipelines: [TestGlobalRequestPipeline] }, specific });
    });
  });

  describe('full requests execution chain', () => {
    it('should return "success"', async () => {
      const testRequest = new TestRequest('success');

      expect(await mediator.request<string>(testRequest)).toBe(testRequest.property);

      const id = requestStates[0]?.id;
      const expectedProvidersChain = [TestGlobalRequestPipeline, TestRequestPipeline, TestRequestHandler];
      requestStates.forEach(({ provider, ...props }, idx) => {
        expect(props).toEqual({ id, type: MessageTypes.REQUEST, data: testRequest });
        expect(provider instanceof expectedProvidersChain[idx]).toBe(true);
      });
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
      const providers = [TestGlobalRequestPipeline, TestRequestPipeline, TestLaggingPipeline, TestRequestHandler];
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
    });
  });
});
