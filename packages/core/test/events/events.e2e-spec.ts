import { lastValueFrom } from 'rxjs';
import {
  MessageTimeoutException,
  MessageTypes,
  PlainObjectMessageException,
  EventsProvidersSchema,
  Mediator,
  MediatorFactory,
} from '../../lib';
import {
  TestEvent,
  TestEventHandler,
  TestFailingEventHandler,
  TestGlobalEventHandler,
  TestLaggingEventHandler,
} from './events.mocks';

describe('@nodiator/core events (e2e)', () => {
  const providers = [TestGlobalEventHandler, TestEventHandler];
  let mediator: Mediator;

  beforeEach(() => {
    mediator = MediatorFactory.create({
      providers,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('nodiator setup', () => {
    it('should retrieve events providers schema', () => {
      const schema = mediator.providers.get<EventsProvidersSchema>(MessageTypes.EVENT);
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
  });

  describe('passing plain object', () => {
    it('should reject plain object event', async () => {
      const task = lastValueFrom(mediator.publish({ property: 'property' }));
      expect(task).rejects.toThrow(PlainObjectMessageException);
    });
  });

  describe('timeouts handling', () => {
    const testEvent = new TestEvent();
    const timeoutProviders = [...providers, TestLaggingEventHandler];

    beforeEach(() => {
      mediator = MediatorFactory.create({
        providers: timeoutProviders,
        dynamicOptions: () => ({ events: { timeout: 1 } }),
      });
    });

    it('should throw timeout exception', () => {
      expect(lastValueFrom(mediator.publish(testEvent))).rejects.toThrow(MessageTimeoutException);
    });
  });

  describe('events failed retries', () => {
    it('should fail on the first attempt', async () => {
      mediator.providers.register(TestFailingEventHandler);
      expect(lastValueFrom(mediator.publish(new TestEvent()))).rejects.toThrowError();
    });

    it('should fail on the second attempt', async () => {
      mediator = MediatorFactory.create({
        providers,
        dynamicOptions: () => ({ events: { handlingRetriesAttempts: 1 } }),
      });
      mediator.providers.register(TestFailingEventHandler);
      expect(lastValueFrom(mediator.publish(new TestEvent()))).rejects.toThrowError();
    });
  });

  describe('events successful retries', () => {
    const testEvent = new TestEvent();
    const handlingRetriesDelay = 10;

    beforeEach(() => {
      mediator = MediatorFactory.create({
        providers,
        dynamicOptions: () => ({ events: { handlingRetriesAttempts: 2, handlingRetriesDelay } }),
      });
      mediator.providers.register(TestFailingEventHandler);
    });

    it('should succeed on the third attempt', (done) => {
      const start = Date.now();
      mediator.publish(testEvent).subscribe({
        complete() {
          expect(Date.now() - start).toBeGreaterThanOrEqual(handlingRetriesDelay * 2);
          done();
        },
      });
    });
  });
});
