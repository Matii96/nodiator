import { Type } from '../../../utils/type.interface';
import { MESSAGE_METADATA, EVENT_HANDLER_METADATA, SCOPE_OPTIONS_METADATA } from '../../constants';
import { MessageTypeInterferenceException } from '../../exceptions/message-type-interference.exception';
import { IMessageMetadata } from '../../interfaces/message-metadata.interface';
import { ScopeOptions } from '../../interfaces/scope.options';
import { MessageTypes } from '../../message-types.enum';
import { IEvent } from '../interfaces/event.interface';

type EventType = Type<IEvent>;

interface EventHandlerSingleOptions extends ScopeOptions {
  /**
   * Specifies the event to handle.
   */
  event: EventType;
}

interface EventHandlerMultipleOptions extends ScopeOptions {
  /**
   * Specifies events to handle.
   */
  events: EventType[];
}

/**
 * Represents a handler for given event.
 * @param events
 */
export function EventHandler(...events: EventType[]): ClassDecorator;

/**
 * Represents a handler for given event.
 * @param options Extended handler options
 */
export function EventHandler(options: EventHandlerSingleOptions): ClassDecorator;

/**
 * Represents a handler for given event.
 * @param options Extended handler options
 */
export function EventHandler(options: EventHandlerMultipleOptions): ClassDecorator;

export function EventHandler(
  ...eventOrOptions: (EventType | EventHandlerSingleOptions | EventHandlerMultipleOptions)[]
): ClassDecorator {
  return (target) => {
    let eventsTypes: Set<EventType>;
    switch (typeof eventOrOptions[0]) {
      case 'function':
        eventsTypes = new Set(eventOrOptions as EventType[]);
        break;
      case 'object':
        eventsTypes = new Set(
          (<EventHandlerSingleOptions>eventOrOptions[0]).event
            ? [(<EventHandlerSingleOptions>eventOrOptions[0]).event]
            : (<EventHandlerMultipleOptions>eventOrOptions[0]).events
        );
        Reflect.defineMetadata(SCOPE_OPTIONS_METADATA, { scoped: eventOrOptions[0].scoped } as ScopeOptions, target);
        break;
    }
    Reflect.defineMetadata(EVENT_HANDLER_METADATA, eventsTypes, target);

    eventsTypes.forEach((eventType) => {
      const existingMetadata: IMessageMetadata = Reflect.getMetadata(MESSAGE_METADATA, eventType);
      if (existingMetadata) {
        if (existingMetadata.type !== MessageTypes.EVENT) {
          throw new MessageTypeInterferenceException(eventType);
        }
        return;
      }

      Reflect.defineMetadata(MESSAGE_METADATA, { type: MessageTypes.EVENT } as IMessageMetadata, eventType);
    });
  };
}
