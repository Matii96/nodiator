import { Event } from '../../../messages';
import { MessageExecutor } from '../shared/message-executor';

export interface EventsExecutor extends MessageExecutor<Event, Event> {}
