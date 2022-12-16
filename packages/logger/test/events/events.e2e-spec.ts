import { Mediator, MediatorFactory } from '@nodiator/core';
import { delay, lastValueFrom } from 'rxjs';
import { LoggerExtension } from '../../lib';
import { MediatorLoggerMock } from '../../lib/mediator-logger/mediator-logger.mocks';
import { MediatorLoggingLevels } from '../../lib/logging-level/logging-levels.enum';
import { generalizeLogs } from '../utils/generalize-logs';
import { FailingTestEventHandler, TestEvent, TestEventHandler, TestGlobalEventHandler } from './events.mocks';

describe('@nodiator/logger events (e2e)', () => {
  const testevent = new TestEvent();
  let logger: MediatorLoggerMock;
  let mediator: Mediator;

  beforeEach(() => {
    logger = new MediatorLoggerMock();
    mediator = MediatorFactory.create({ providers: [TestGlobalEventHandler, TestEventHandler] });
    mediator.use(new LoggerExtension({ logger, dynamicOptions: () => ({ level: MediatorLoggingLevels.DEBUG }) }));
  });

  it('should log event processing completion', async () => {
    await lastValueFrom(mediator.publish(testevent).pipe(delay(0)));
    expect(generalizeLogs(logger.timeline)).toEqual([
      'Emmited TestEvent (id=id)',
      ' -- handling TestEvent (id=id) by TestGlobalEventHandler',
      ' -- TestEvent (id=id) handled by TestGlobalEventHandler in 0s',
      ' -- handling TestEvent (id=id) by TestEventHandler',
      ' -- TestEvent (id=id) handled by TestEventHandler in 0s',
      'TestEvent (id=id) handled',
    ]);
  });

  it('should log event processing error', async () => {
    mediator.providers.register(FailingTestEventHandler);
    try {
      await lastValueFrom(mediator.publish(testevent).pipe(delay(0)));
    } catch {}
    expect(generalizeLogs(logger.timeline)).toEqual([
      'Emmited TestEvent (id=id)',
      ' -- handling TestEvent (id=id) by TestGlobalEventHandler',
      ' -- TestEvent (id=id) handled by TestGlobalEventHandler in 0s',
      ' -- handling TestEvent (id=id) by TestEventHandler',
      ' -- TestEvent (id=id) handled by TestEventHandler in 0s',
      ' -- handling TestEvent (id=id) by FailingTestEventHandler',
      'TestEvent (id=id) failed. Error:',
    ]);
  });
});
