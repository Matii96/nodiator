import { IEventProcessingState, MessageTimeoutException, MessageTypes } from '../../lib';
import {
  TestEvent,
  TestEventHandler,
  TestFailingEventHandler,
  TestGlobalEventHandler,
  TestLaggingEventHandler,
} from './events.mocks';

export const handlingSteps = (id: string, testEvent: TestEvent): IEventProcessingState[] => [
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
];

export const timeoutSteps = (
  id: string,
  testEvent: TestEvent,
  error: MessageTimeoutException
): IEventProcessingState[] => [
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
    processed: true,
  },
];

export const retriesSteps = (id: string, testEvent: TestEvent): IEventProcessingState[] => [
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
    provider: new TestFailingEventHandler(),
  },
  {
    id,
    messageType: MessageTypes.EVENT,
    message: testEvent,
    handled: true,
    provider: new TestGlobalEventHandler(),
  },
  {
    id,
    messageType: MessageTypes.EVENT,
    message: testEvent,
    handled: true,
    provider: new TestEventHandler(),
  },
  {
    id,
    messageType: MessageTypes.EVENT,
    message: testEvent,
    error: TestFailingEventHandler.exception,
    provider: new TestFailingEventHandler(),
  },
  {
    id,
    messageType: MessageTypes.EVENT,
    message: testEvent,
    error: TestFailingEventHandler.exception,
    provider: new TestFailingEventHandler(),
  },
  {
    id,
    messageType: MessageTypes.EVENT,
    message: testEvent,
    handled: true,
    provider: new TestFailingEventHandler(),
  },
  {
    id,
    messageType: MessageTypes.EVENT,
    message: testEvent,
    processed: true,
  },
];
