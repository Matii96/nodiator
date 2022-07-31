import {
  Mediator,
  MessageTimeoutException,
  MessageTypes,
  PlainObjectMessageException,
  IEventsProvidersSchema,
  MediatorLoggingLevels,
  IMediatorLogger,
} from '../../lib';
import { IEventProcessingState } from '../../lib/executor/messages/events/interfaces/event-processing-state.interface';
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

  describe('events publishing', () => {
    it('should handle event', async () => {
      const testEvent = new TestEvent();

      await mediator.publish(testEvent);

      const id = eventStates[0]?.id;
      eventStates.slice(0, -1).forEach(({ provider, handled, ...props }) => {
        expect(props).toEqual({
          id,
          messageType: MessageTypes.EVENT,
          message: testEvent,
        } as IEventProcessingState);
        expect(providers.some((providerType) => provider instanceof providerType)).toBe(true);
      });
      expect(eventStates[eventStates.length - 1]).toEqual({
        id,
        messageType: MessageTypes.EVENT,
        message: testEvent,
        processed: true,
      });

      providers.forEach((providerType) => expect(providerType.handle).toHaveBeenCalledTimes(1));

      expect(logger.debug).toHaveBeenCalledTimes(5);
      expect(logger.info).toHaveBeenCalledTimes(2);
      expect(logger.warn).toHaveBeenCalledTimes(0);
      expect(logger.error).toHaveBeenCalledTimes(0);
    });

    it('should reject plain object request', async () => {
      const task = mediator.publish({ property: 'property' });
      expect(task).rejects.toThrow(PlainObjectMessageException);

      try {
        await task;
      } catch {}
      expect(eventStates).toHaveLength(0);
    });

    it('should timeout', async () => {
      const testEvent = new TestEvent();
      const timeoutProviders = [...providers, TestLaggingEventHandler];
      mediator = new Mediator({ providers: timeoutProviders, eventsTimeout: 1 });
      mediator.subscribe((state) => eventStates.push(state));

      const task = mediator.publish(testEvent);
      expect(task).rejects.toThrow(MessageTimeoutException);

      try {
        await task;
      } catch {}
      const id = eventStates[0]?.id;
      eventStates.slice(0, -2).forEach(({ provider, handled, ...props }) => {
        expect(props).toEqual({
          id,
          messageType: MessageTypes.EVENT,
          message: testEvent,
        } as IEventProcessingState);
        expect(timeoutProviders.some((providerType) => provider instanceof providerType)).toBe(true);
      });
      expect(eventStates[eventStates.length - 2].error).toBeInstanceOf(MessageTimeoutException);
      expect(eventStates[eventStates.length - 1].processed).toBe(true);

      timeoutProviders.forEach((providerType) => expect(providerType.handle).toHaveBeenCalledTimes(1));
    });
  });

  describe('events fallback', () => {
    it('should fail on the first attempt', async () => {
      mediator.providers.register(TestFailingEventHandler);
      expect(mediator.publish(new TestEvent())).rejects.toThrowError();
    });

    it('should fail on the second attempt', async () => {
      mediator = new Mediator({ providers, eventsHandlingRetriesAttempts: 1 });
      mediator.providers.register(TestFailingEventHandler);
      expect(mediator.publish(new TestEvent())).rejects.toThrowError();
    });

    it('should succeed on the third attempt', async () => {
      const eventsHandlingRetriesDelay = 10;
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

      const start = Date.now();
      await mediator.publish(new TestEvent());
      expect(eventStates).toHaveLength(9);
      expect(Date.now() - start).toBeGreaterThanOrEqual(eventsHandlingRetriesDelay * 2);

      expect(logger.debug).toHaveBeenCalledTimes(9);
      expect(logger.info).toHaveBeenCalledTimes(2);
      expect(logger.warn).toHaveBeenCalledTimes(0);
      expect(logger.error).toHaveBeenCalledTimes(2);
    });
  });
});
