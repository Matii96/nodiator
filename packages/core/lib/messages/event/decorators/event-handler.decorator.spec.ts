import 'reflect-metadata';
import { EVENT_HANDLER_METADATA, MESSAGE_METADATA, SCOPE_OPTIONS_METADATA } from '../../constants';
import { MessageTypeInterferenceException } from '../../exceptions/message-type-interference.exception';
import { ScopeOptions } from '../../interfaces';
import { IMessageMetadata } from '../../interfaces/message-metadata.interface';
import { MessageTypes } from '../../message-types.enum';
import { TestEvent, TestEventHandler } from '../../messages.mocks';
import { EventHandler } from './event-handler.decorator';

class AnotherEvent {}

describe('EventHandler', () => {
  beforeEach(() => {
    Reflect.defineMetadata(MESSAGE_METADATA, undefined, TestEvent);
  });

  describe('events registration', () => {
    it('should register handler for single event', () => {
      EventHandler(TestEvent)(TestEventHandler);

      expect(Reflect.getMetadata(SCOPE_OPTIONS_METADATA, TestEventHandler)).toBeUndefined();
      expect(Reflect.getMetadata(EVENT_HANDLER_METADATA, TestEventHandler)).toEqual(new Set([TestEvent]));
      expect(Reflect.getMetadata(MESSAGE_METADATA, TestEvent)).toEqual({
        type: MessageTypes.EVENT,
      } as IMessageMetadata);
    });

    it('should register handler for multiple events', () => {
      EventHandler(TestEvent, AnotherEvent)(TestEventHandler);

      expect(Reflect.getMetadata(SCOPE_OPTIONS_METADATA, TestEventHandler)).toBeUndefined();
      expect(Reflect.getMetadata(EVENT_HANDLER_METADATA, TestEventHandler)).toEqual(new Set([TestEvent, AnotherEvent]));
      expect(Reflect.getMetadata(MESSAGE_METADATA, TestEvent)).toEqual({
        type: MessageTypes.EVENT,
      } as IMessageMetadata);
    });

    it('should throw MessageTypeInterferenceException', () => {
      Reflect.defineMetadata(MESSAGE_METADATA, { type: MessageTypes.REQUEST } as IMessageMetadata, TestEvent);
      expect(() => EventHandler(TestEvent)(TestEventHandler)).toThrow(MessageTypeInterferenceException);
    });
  });

  describe('scoping', () => {
    it('should register provider as scoped', () => {
      EventHandler({ event: TestEvent, scoped: true })(TestEventHandler);
      expect(Reflect.getMetadata(SCOPE_OPTIONS_METADATA, TestEventHandler)).toEqual({ scoped: true } as ScopeOptions);
    });
  });
});
