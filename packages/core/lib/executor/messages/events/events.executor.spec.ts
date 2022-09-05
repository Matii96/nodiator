import 'reflect-metadata';
import { lastValueFrom, Subject } from 'rxjs';
import { MessageTypes } from '../../../messages';
import { TestEvent, TestEventHandler } from '../../../messages/messages.mocks';
import { IProvidersManager } from '../../../providers-manager/ports/providers-manager.port';
import { ProvidersManagerMock } from '../../../providers-manager/providers-manager.mocks';
import { IEventsProvidersSchema } from '../../../providers-manager/messages/events/interfaces/events-providers-schema.interface';
import { ProvidersInstantiator } from '../../ports/providers-instantiator.port';
import { MessageTimeoutException } from '../../exceptions/message-timeout.exception';
import { IEventProcessingState } from './interfaces/event-processing-state.interface';
import { IEventsExecutor } from './ports/events.executor.port';
import { EventsExecutor } from './events.executor';

describe('EventsExecutor', () => {
  const id = 'id';
  const event = new TestEvent();
  const handler = new TestEventHandler();
  const providersInstantiatorMock: ProvidersInstantiator = () => handler as any;
  let subject: Subject<IEventProcessingState>;
  let providersManager: IProvidersManager;
  let eventStates: IEventProcessingState[];
  let executor: IEventsExecutor;

  beforeEach(() => {
    providersManager = new ProvidersManagerMock();
    const specific = new Map();
    specific.set(TestEvent, { handlers: [TestEventHandler] });
    jest
      .spyOn(providersManager, 'get')
      .mockReturnValue({ global: { handlers: [] }, specific } as IEventsProvidersSchema);

    subject = new Subject();
    eventStates = [];
    subject.subscribe((state) => eventStates.push(state));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('events handling', () => {
    beforeEach(() => {
      executor = new EventsExecutor(subject, { config: () => ({}) }, providersManager, providersInstantiatorMock);
    });

    it('should handle event', (done) => {
      executor.execute(id, event).subscribe({
        complete() {
          expect(handler.handle).toHaveBeenCalledTimes(1);
          done();
        },
      });
    });

    it('should emit event handling steps', async () => {
      await lastValueFrom(executor.execute(id, event));
      expect(eventStates).toEqual([
        { id, messageType: MessageTypes.EVENT, message: event, provider: handler },
        { id, messageType: MessageTypes.EVENT, message: event, provider: handler, handled: true },
        { id, messageType: MessageTypes.EVENT, message: event, processed: true },
      ]);
    });
  });

  describe('timeouts handling', () => {
    beforeEach(() => {
      executor = new EventsExecutor(
        subject,
        { config: () => ({ eventsTimeout: 1 }) },
        providersManager,
        providersInstantiatorMock
      );
      jest.spyOn(handler, 'handle').mockImplementationOnce(() => new Promise((resolve) => setTimeout(resolve, 5)));
    });

    it('should throw timeout exception', async () => {
      const task = lastValueFrom(executor.execute(id, event));
      expect(task).rejects.toThrow(MessageTimeoutException);
      try {
        await task;
      } catch {}
    });

    it('should emit event handling steps', async () => {
      try {
        await lastValueFrom(executor.execute(id, event));
      } catch {}

      const error = new MessageTimeoutException(event);
      expect(eventStates).toEqual([
        { id, messageType: MessageTypes.EVENT, message: event, provider: handler },
        { id, messageType: MessageTypes.EVENT, message: event, provider: handler, error },
        { id, messageType: MessageTypes.EVENT, message: event, processed: true },
      ]);
    });
  });
});
