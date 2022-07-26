import { Mediator, MessageTimeoutException, PlainObjectMessageException } from '../../lib';
import {
  TestGlobalRequestPipeline,
  TestLaggingPipeline,
  TestRequest,
  TestRequestHandler,
  TestRequestPipeline,
} from './requests.mocks';

describe('@nodiator/core (e2e)', () => {
  describe('full requests execution chain', () => {
    it('should return "success"', async () => {
      const mediator = new Mediator({
        providers: [TestGlobalRequestPipeline, TestRequestPipeline, TestRequestHandler],
      });
      const testProperty = 'success';
      expect(await mediator.request<string>(new TestRequest(testProperty))).toBe(testProperty);
    });

    it('should timeout', async () => {
      const mediator = new Mediator({
        providers: [TestGlobalRequestPipeline, TestRequestPipeline, TestLaggingPipeline, TestRequestHandler],
        requestsTimeout: 1,
      });
      expect(mediator.request<string>(new TestRequest(''))).rejects.toThrow(MessageTimeoutException);
    });

    it('should reject plain object request', async () => {
      const mediator = new Mediator({
        providers: [TestGlobalRequestPipeline, TestRequestPipeline, TestRequestHandler],
      });
      expect(mediator.request<string>({ property: 'property' })).rejects.toThrow(PlainObjectMessageException);
    });
  });
});
