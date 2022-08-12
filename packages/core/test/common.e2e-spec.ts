import { IMediator, IMediatorLogger, MediatorFactory } from '../lib';
import { MediatorLoggerMock } from '../lib/logging/logging.mocks';
import { TestEvent, TestEventHandler, TestGlobalEventHandler } from './events/events.mocks';
import { TestRequest, TestRequestHandler } from './requests/requests.mocks';

describe('@nodiator/core common (e2e)', () => {
  const testEvent = new TestEvent();
  const testRequest = new TestRequest('success');
  let logger: IMediatorLogger;
  let mediator: IMediator;

  beforeEach(() => {
    logger = new MediatorLoggerMock();
    mediator = MediatorFactory.create({ logger, loggingLevel: 'info' });
    mediator.providers.register(TestRequestHandler, TestGlobalEventHandler, TestEventHandler);
  });

  it('should manually register handler and execute it', async () => {
    expect(await mediator.request<string>(testRequest)).toBe(testRequest.property);
    await mediator.publish(testEvent);

    const handle = expect(TestGlobalEventHandler.handle);
    handle.toHaveBeenCalledTimes(1);
    handle.toHaveBeenCalledWith(testEvent);
  });

  it('should log messages handling steps', async () => {
    await mediator.request<string>(testRequest);
    await mediator.publish(testEvent);

    expect(logger.info).toHaveBeenCalledTimes(2);
  });
});
