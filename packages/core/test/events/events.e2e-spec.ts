import {
  Mediator,
  MessageTimeoutException,
  MessageTypes,
  PlainObjectMessageException,
  IEventsProvidersSchema,
  MediatorLoggingLevels,
  IMediatorLogger,
  IEventProcessingState,
} from '../../lib';
import { MediatorLoggerMock } from '../common/mocks';
import {
  TestEvent,
  TestEventHandler,
  TestFailingEventHandler,
  TestGlobalEventHandler,
  TestLaggingEventHandler,
} from './events.mocks';

describe('@nodiator/core events (e2e)', () => {
  const providers = [TestGlobalEventHandler, TestEventHandler];
  let logger: IMediatorLogger;
  let mediator: Mediator;
  let eventStates: IEventProcessingState[];

  beforeEach(() => {
    providers.forEach((provider) => provider.handle.mockReset());
    jest.spyOn(TestGlobalEventHandler, 'handle').mockImplementation(async () => null);
    jest.spyOn(TestEventHandler, 'handle').mockImplementation(async () => null);

    logger = new MediatorLoggerMock();
    mediator = new Mediator({ providers, logger, loggingLevel: MediatorLoggingLevels.DEBUG });
    eventStates = [];
    mediator.subscribe((state) => eventStates.push(state));
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

    it('should handle event', async () => {
      await mediator.publish(testEvent);
      expect(TestGlobalEventHandler.handle).toHaveBeenCalledTimes(1);
      expect(TestEventHandler.handle).toHaveBeenCalledTimes(1);
    });

    it('should emit event handling steps', async () => {
      await mediator.publish(testEvent);
      const id = eventStates[0]?.id;
      expect(eventStates).toEqual([
        {
          id,
          messageType: MessageTypes.EVENT,
          message: testEvent,
          provider: new TestGlobalEventHandler(),
        },
        {
          id,
          messageType: MessageTypes.EVENT,
          message: testEvent,
          provider: new TestEventHandler(),
        },
        {
          id,
          messageType: MessageTypes.EVENT,
          message: testEvent,
          provider: new TestGlobalEventHandler(),
          handled: true,
        },
        {
          id,
          messageType: MessageTypes.EVENT,
          message: testEvent,
          provider: new TestEventHandler(),
          handled: true,
        },
        {
          id,
          messageType: MessageTypes.EVENT,
          message: testEvent,
          processed: true,
        },
      ]);
    });

    it('should log event handling steps', async () => {
      await mediator.publish(testEvent);
      expect(logger.debug).toHaveBeenCalledTimes(5);
      expect(logger.info).toHaveBeenCalledTimes(2);
      expect(logger.warn).toHaveBeenCalledTimes(0);
      expect(logger.error).toHaveBeenCalledTimes(0);
    });
  });

  describe('passing plain object', () => {
    it('should reject plain object event', async () => {
      const task = mediator.publish({ property: 'property' });
      expect(task).rejects.toThrow(PlainObjectMessageException);
    });

    it('should not have emitted any event state', async () => {
      try {
        await mediator.publish({ property: 'property' });
      } catch {}
      expect(eventStates).toHaveLength(0);
    });
  });

  describe('handling timeouts', () => {
    const testEvent = new TestEvent();
    const timeoutProviders = [...providers, TestLaggingEventHandler];

    beforeEach(() => {
      mediator = new Mediator({ providers: timeoutProviders, eventsTimeout: 1 });
    });

    it('should throw timeout exception', () => {
      expect(mediator.publish(testEvent)).rejects.toThrow(MessageTimeoutException);
    });

    it('should emit event handling steps', async () => {
      mediator.subscribe((state) => eventStates.push(state));
      try {
        await mediator.publish(testEvent);
      } catch {}

      const id = eventStates[0]?.id;
      const error = new MessageTimeoutException(testEvent);
      expect(eventStates).toEqual([
        {
          id,
          messageType: MessageTypes.EVENT,
          message: testEvent,
          provider: new TestGlobalEventHandler(),
        },
        {
          id,
          messageType: MessageTypes.EVENT,
          message: testEvent,
          provider: new TestEventHandler(),
        },
        {
          id,
          messageType: MessageTypes.EVENT,
          message: testEvent,
          provider: new TestLaggingEventHandler(),
        },
        {
          id,
          messageType: MessageTypes.EVENT,
          message: testEvent,
          provider: new TestGlobalEventHandler(),
          handled: true,
        },
        {
          id,
          messageType: MessageTypes.EVENT,
          message: testEvent,
          provider: new TestEventHandler(),
          handled: true,
        },
        {
          id,
          messageType: MessageTypes.EVENT,
          message: testEvent,
          provider: new TestLaggingEventHandler(),
          error,
        },
        {
          id,
          messageType: MessageTypes.EVENT,
          message: testEvent,
          error,
          processed: true,
        },
      ]);
    });
  });

  describe('events failed retries', () => {
    it('should fail on the first attempt', async () => {
      mediator.providers.register(TestFailingEventHandler);
      expect(mediator.publish(new TestEvent())).rejects.toThrowError();
    });

    it('should fail on the second attempt', async () => {
      mediator = new Mediator({ providers, eventsHandlingRetriesAttempts: 1 });
      mediator.providers.register(TestFailingEventHandler);
      expect(mediator.publish(new TestEvent())).rejects.toThrowError();
    });
  });

  describe('events successful retries', () => {
    const testEvent = new TestEvent();
    const eventsHandlingRetriesDelay = 10;

    beforeEach(() => {
      logger = new MediatorLoggerMock();
      mediator = new Mediator({
        providers,
        eventsHandlingRetriesAttempts: 2,
        eventsHandlingRetriesDelay,
        logger,
        loggingLevel: MediatorLoggingLevels.DEBUG,
      });
      mediator.providers.register(TestFailingEventHandler);
      mediator.subscribe((state) => eventStates.push(state));
    });

    it('should succeed on the third attempt', async () => {
      const start = Date.now();
      await mediator.publish(testEvent);
      expect(Date.now() - start).toBeGreaterThanOrEqual(eventsHandlingRetriesDelay * 2);
    });

    it('should emit event handling steps', async () => {
      await mediator.publish(testEvent);
      const id = eventStates[0]?.id;
      expect(eventStates.map(({ provider, ...state }) => state)).toEqual([
        {
          id,
          messageType: MessageTypes.EVENT,
          message: testEvent,
        },
        {
          id,
          messageType: MessageTypes.EVENT,
          message: testEvent,
        },
        {
          id,
          messageType: MessageTypes.EVENT,
          message: testEvent,
        },
        {
          id,
          messageType: MessageTypes.EVENT,
          message: testEvent,
          handled: true,
        },
        {
          id,
          messageType: MessageTypes.EVENT,
          message: testEvent,
          handled: true,
        },
        {
          id,
          messageType: MessageTypes.EVENT,
          message: testEvent,
          error: TestFailingEventHandler.exception,
        },
        {
          id,
          messageType: MessageTypes.EVENT,
          message: testEvent,
          error: TestFailingEventHandler.exception,
        },
        {
          id,
          messageType: MessageTypes.EVENT,
          message: testEvent,
          handled: true,
        },
        {
          id,
          messageType: MessageTypes.EVENT,
          message: testEvent,
          processed: true,
        },
      ]);
    });

    it('should log event handling steps', async () => {
      await mediator.publish(testEvent);
      expect(logger.debug).toHaveBeenCalledTimes(9);
      expect(logger.info).toHaveBeenCalledTimes(2);
      expect(logger.warn).toHaveBeenCalledTimes(0);
      expect(logger.error).toHaveBeenCalledTimes(2);
    });
  });
});
