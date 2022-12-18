import { Mediator, MediatorFactory } from '@nodiator/core';
import { delay, lastValueFrom } from 'rxjs';
import { LoggerExtension } from '../../lib';
import { MediatorLoggerMock } from '../../lib/mediator-logger/mediator-logger.mocks';
import { MediatorLoggingLevels } from '../../lib/logging-level/logging-levels.enum';
import { generalizeLogs } from '../utils/generalize-logs';
import { FailingTestRequestPipeline, TestRequest, TestRequestHandler, TestRequestPipeline } from './requests.mocks';

describe('@nodiator/extension-logger requests (e2e)', () => {
  const testRequest = new TestRequest('success');
  let logger: MediatorLoggerMock;
  let mediator: Mediator;

  beforeEach(() => {
    logger = new MediatorLoggerMock();
    mediator = MediatorFactory.create({ providers: [TestRequestPipeline, TestRequestHandler] });
    mediator.use(new LoggerExtension({ logger, dynamicOptions: () => ({ level: MediatorLoggingLevels.DEBUG }) }));
  });

  it('should log request processing completion', async () => {
    await lastValueFrom(mediator.request(testRequest).pipe(delay(0)));
    expect(generalizeLogs(logger.timeline)).toEqual([
      'Requested TestRequest (id=id)',
      ' -- handling TestRequest (id=id) by TestRequestPipeline',
      ' -- handling TestRequest (id=id) by TestRequestHandler',
      ' -- TestRequestHandler responded to TestRequest (id=id)',
      ' -- TestRequestPipeline responded to TestRequest (id=id)',
      ' -- TestRequest (id=id) took 0s',
      'TestRequest (id=id) handled',
    ]);
  });

  it('should log request processing error', async () => {
    mediator.providers.register(FailingTestRequestPipeline);
    try {
      await lastValueFrom(mediator.request(testRequest).pipe(delay(0)));
    } catch {}
    expect(generalizeLogs(logger.timeline)).toEqual([
      'Requested TestRequest (id=id)',
      ' -- handling TestRequest (id=id) by TestRequestPipeline',
      ' -- handling TestRequest (id=id) by FailingTestRequestPipeline',
      ' -- handling TestRequest (id=id) by TestRequestHandler',
      ' -- TestRequestHandler responded to TestRequest (id=id)',
      'TestRequest (id=id) failed. Error:',
    ]);
  });
});
