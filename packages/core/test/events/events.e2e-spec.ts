import { lastValueFrom } from 'rxjs';
import {
  MessageTimeoutException,
  MessageTypes,
  PlainObjectMessageException,
  IEventsProvidersSchema,
  IMediatorLogger,
  IEventProcessingState,
  IMediator,
  MediatorFactory,
} from '../../lib';
import { MediatorLoggerMock } from '../../lib/logging/logging.mocks';
import {
  TestEvent,
  TestEventHandler,
  TestFailingEventHandler,
  TestGlobalEventHandler,
  TestLaggingEventHandler,
} from './events.mocks';
import { handlingSteps, retriesSteps, timeoutSteps } from './events.mocks.results';

describe('@nodiator/core events (e2e)', () => {
  const providers = [TestGlobalEventHandler, TestEventHandler];
  let logger: IMediatorLogger;
  let mediator: IMediator;
  let eventStates: IEventProcessingState[];

  beforeEach(() => {
    logger = new MediatorLoggerMock();
    mediator = MediatorFactory.create({ providers, logger, loggingLevel: 'debug' });
    eventStates = [];
    mediator.subscribe((state) => eventStates.push(state));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('nodiator setup', () => {
    it('should retrieve events providers schema', () => {
      const schema = mediator.providers.get<IEventsProvidersSchema>(MessageTypes.EVENT);
      const specific = new Map();
      specific.set(TestEvent, { handlers: [TestEventHandler] });
      expect(schema).toEqual({ global: { handlers: [TestGlobalEventHandler] }, specific });
    });
  });

  describe('events handling', () => {
    const testEvent = new TestEvent();

    it('should handle event', (done) => {
      mediator.publish(testEvent).subscribe({
        complete() {
          expect(TestGlobalEventHandler.handle).toHaveBeenCalledTimes(1);
          expect(TestEventHandler.handle).toHaveBeenCalledTimes(1);
          done();
        },
      });
    });

    it('should emit event handling steps', (done) => {
      mediator.publish(testEvent).subscribe({
        complete() {
          expect(eventStates).toEqual(handlingSteps(eventStates[0]?.id, testEvent));
          done();
        },
      });
    });

    it('should log event handling steps', (done) => {
      mediator.publish(testEvent).subscribe({
        complete() {
          expect(logger.debug).toHaveBeenCalledTimes(5);
          expect(logger.info).toHaveBeenCalledTimes(2);
          expect(logger.warn).toHaveBeenCalledTimes(0);
          expect(logger.error).toHaveBeenCalledTimes(0);
          done();
        },
      });
    });
  });

  describe('passing plain object', () => {
    it('should reject plain object event', async () => {
      const task = lastValueFrom(mediator.publish({ property: 'property' }));
      expect(task).rejects.toThrow(PlainObjectMessageException);
    });

    it('should not have emitted any event state', async () => {
      try {
        await lastValueFrom(mediator.publish({ property: 'property' }));
      } catch {}
      expect(eventStates).toHaveLength(0);
    });
  });

  describe('timeouts handling', () => {
    const testEvent = new TestEvent();
    const timeoutProviders = [...providers, TestLaggingEventHandler];

    beforeEach(() => {
      mediator = MediatorFactory.create({ providers: timeoutProviders, eventsTimeout: 1 });
    });

    it('should throw timeout exception', () => {
      expect(lastValueFrom(mediator.publish(testEvent))).rejects.toThrow(MessageTimeoutException);
    });

    it('should emit event handling steps', async () => {
      mediator.subscribe((state) => eventStates.push(state));
      try {
        await lastValueFrom(mediator.publish(testEvent));
      } catch {}
      expect(eventStates).toEqual(timeoutSteps(eventStates[0]?.id, testEvent, new MessageTimeoutException(testEvent)));
    });
  });

  describe('events failed retries', () => {
    it('should fail on the first attempt', async () => {
      mediator.providers.register(TestFailingEventHandler);
      expect(lastValueFrom(mediator.publish(new TestEvent()))).rejects.toThrowError();
    });

    it('should fail on the second attempt', async () => {
      mediator = MediatorFactory.create({ providers, eventsHandlingRetriesAttempts: 1 });
      mediator.providers.register(TestFailingEventHandler);
      expect(lastValueFrom(mediator.publish(new TestEvent()))).rejects.toThrowError();
    });
  });

  describe('events successful retries', () => {
    const testEvent = new TestEvent();
    const eventsHandlingRetriesDelay = 10;

    beforeEach(() => {
      logger = new MediatorLoggerMock();
      mediator = MediatorFactory.create({
        providers,
        eventsHandlingRetriesAttempts: 20,
        eventsHandlingRetriesDelay,
        logger,
        loggingLevel: 'debug',
      });
      mediator.providers.register(TestFailingEventHandler);
      mediator.subscribe((state) => eventStates.push(state));
    });

    it('should succeed on the third attempt', (done) => {
      const start = Date.now();
      mediator.publish(testEvent).subscribe({
        complete() {
          expect(Date.now() - start).toBeGreaterThanOrEqual(eventsHandlingRetriesDelay * 2);
          done();
        },
      });
    });

    it('should emit event handling steps', (done) => {
      mediator.publish(testEvent).subscribe({
        complete() {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const expected = retriesSteps(eventStates[0]?.id, testEvent).map(({ provider, ...state }) => state);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const received = eventStates.map(({ provider, ...state }) => state);
          expect(expected).toEqual(received);
          done();
        },
      });
    });

    it('should log event handling steps', (done) => {
      mediator.publish(testEvent).subscribe({
        complete() {
          expect(logger.debug).toHaveBeenCalledTimes(9);
          expect(logger.info).toHaveBeenCalledTimes(2);
          expect(logger.warn).toHaveBeenCalledTimes(0);
          expect(logger.error).toHaveBeenCalledTimes(2);
          done();
        },
      });
    });
  });
});
