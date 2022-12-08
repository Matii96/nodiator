import 'reflect-metadata';
import { lastValueFrom, Subject } from 'rxjs';
import { TestEvent, TestEventHandler } from '../../../messages/messages.mocks';
import { IProvidersManager } from '../../../providers-manager/ports/providers-manager.port';
import { ProvidersManagerMock } from '../../../providers-manager/providers-manager.mocks';
import { IEventsProvidersSchema } from '../../../providers-manager/messages/events/interfaces/events-providers-schema.interface';
import { ProvidersInstantiator } from '../../ports/providers-instantiator.port';
import { MessageTimeoutException } from '../../exceptions/message-timeout.exception';
import { IMessageProcessingState } from '../../message-processing';
import { IEventsExecutor } from './ports/events.executor.port';
import { EventsExecutor } from './events.executor';
import {
  HandlingCompletedEventProcessingState,
  HandlingErrorEventProcessingState,
  HandlingStartedEventProcessingState,
} from './processing-states';

describe('EventsExecutor', () => {
  const event = new TestEvent();
  const handler = new TestEventHandler();
  const providersInstantiatorMock: ProvidersInstantiator = () => handler as any;
  let subject: Subject<IMessageProcessingState>;
  let providersManager: IProvidersManager;
  let eventStates: IMessageProcessingState[];
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
      executor = new EventsExecutor({ dynamicOptions: () => ({}) }, providersManager, providersInstantiatorMock);
    });

    it('should handle event', (done) => {
      executor.execute(subject, event).subscribe({
        complete() {
          expect(handler.handle).toHaveBeenCalledTimes(1);
          done();
        },
      });
    });

    it('should emit event handling steps', (done) => {
      executor.execute(subject, event).subscribe({
        complete() {
          expect(eventStates).toEqual([
            new HandlingStartedEventProcessingState(handler),
            new HandlingCompletedEventProcessingState(handler),
          ]);
          done();
        },
      });
    });
  });

  describe('timeouts handling', () => {
    beforeEach(() => {
      executor = new EventsExecutor(
        { dynamicOptions: () => ({ events: { timeout: 1 } }) },
        providersManager,
        providersInstantiatorMock
      );
      jest.spyOn(handler, 'handle').mockImplementationOnce(() => new Promise((resolve) => setTimeout(resolve, 5)));
    });

    it('should throw timeout exception', async () => {
      const task = lastValueFrom(executor.execute(subject, event));
      expect(task).rejects.toThrow(MessageTimeoutException);
      try {
        await task;
      } catch {}
    });

    it('should emit event handling steps', async () => {
      try {
        await lastValueFrom(executor.execute(subject, event));
      } catch {}

      const error = new MessageTimeoutException(event);
      expect(eventStates).toEqual([
        new HandlingStartedEventProcessingState(handler),
        new HandlingErrorEventProcessingState(handler, error),
      ]);
    });
  });
});
