import { firstValueFrom, lastValueFrom } from 'rxjs';
import { IMediator, MediatorFactory } from '../lib';
import { IMediatorLogger, MediatorLoggingLevels } from '../lib/config';
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
    mediator = MediatorFactory.create({ logger, config: () => ({ loggingLevel: MediatorLoggingLevels.INFO }) });
    mediator.providers.register(TestRequestHandler, TestGlobalEventHandler, TestEventHandler);
  });

  it('should manually register handler and execute it', async () => {
    const requestResult = await firstValueFrom(mediator.request<string>(testRequest));
    expect(requestResult).toBe(testRequest.property);

    await lastValueFrom(mediator.publish(testEvent));
    const handle = expect(TestGlobalEventHandler.handle);
    handle.toHaveBeenCalledTimes(1);
    handle.toHaveBeenCalledWith(testEvent);
  });

  it('should log messages handling steps', async () => {
    await firstValueFrom(mediator.request<string>(testRequest));
    await lastValueFrom(mediator.publish(testEvent));

    expect(logger.info).toHaveBeenCalledTimes(2);
  });
});
