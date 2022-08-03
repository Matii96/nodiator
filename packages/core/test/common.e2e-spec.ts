import { Mediator, MediatorLoggingLevels } from '../lib';
import { MediatorLoggerMock } from '../lib/logging/logging.mocks';
import { TestEvent, TestEventHandler, TestGlobalEventHandler } from './events/events.mocks';
import { TestRequest, TestRequestHandler } from './requests/requests.mocks';

describe('@nodiator/core common (e2e)', () => {
  describe('nodiator setup', () => {
    it('should manually register handler and execute it', async () => {
      const logger = new MediatorLoggerMock();
      const mediator = new Mediator({ logger, loggingLevel: MediatorLoggingLevels.INFO });
      mediator.providers.register(TestRequestHandler, TestGlobalEventHandler, TestEventHandler);

      const testEvent = new TestEvent();
      const testRequest = new TestRequest('success');
      expect(await mediator.request<string>(testRequest)).toBe(testRequest.property);

      await mediator.publish(testEvent);
      const handle = expect(TestGlobalEventHandler.handle);
      handle.toHaveBeenCalledTimes(1);
      handle.toHaveBeenCalledWith(testEvent);

      expect(logger.info).toHaveBeenCalledTimes(2);
    });
  });
});
